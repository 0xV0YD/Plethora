import { Connection, Keypair, PublicKey, Transaction, ComputeBudgetProgram } from '@solana/web3.js'; // <-- Import ComputeBudgetProgram
import { 
  getAssociatedTokenAddress, 
  createTransferCheckedInstruction // <-- Import "Checked" version
} from '@solana/spl-token';
import fs from 'fs';
import bs58 from 'bs58';

const WALLET_FILE = 'wallets.json';

export class PayerService {
  constructor(rpcEndpoints) {
    this.rpcEndpoints = rpcEndpoints;
    this.wallets = [];
    this.rpcIndex = 0;
    this.walletIndex = 0;
    this.loadWallets();
  }

  loadWallets() {
    console.log(`[PayerService] Loading wallets from ${WALLET_FILE}...`);
    try {
      const walletsData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
      this.wallets = walletsData.map(wallet => {
        const secretKeyBytes = bs58.decode(wallet.secretKey);
        return Keypair.fromSecretKey(secretKeyBytes);
      });
      console.log(`[PayerService] Successfully loaded ${this.wallets.length} wallets into memory.`);
    } catch (err) {
      console.error(`[PayerService] FATAL ERROR: Could not load ${WALLET_FILE}.`);
      process.exit(1);
    }
  }

  getWallet() {
    this.walletIndex = (this.walletIndex + 1) % this.wallets.length;
    return this.wallets[this.walletIndex];
  }

  getRpcEndpoint() {
    this.rpcIndex = (this.rpcIndex + 1) % this.rpcEndpoints.length;
    return this.rpcEndpoints[this.rpcIndex];
  }

  // --- THIS IS THE FINAL "GASLESS" 3-INSTRUCTION FUNCTION ---
  async createSignedTransaction(paymentDetails) {
    const rpcUrl = this.getRpcEndpoint();
    const connection = new Connection(rpcUrl, 'confirmed');
    const payer = this.getWallet(); // This is the agent's wallet

    const { payTo, maxAmountRequired, asset, extra } = paymentDetails;
    const toPublicKey = new PublicKey(payTo);
    const amount = BigInt(maxAmountRequired);
    const splTokenMint = new PublicKey(asset);
    const feePayerPublicKey = new PublicKey(extra.feePayer);
    
    // Get decimals from the 402 response (default to 6 for USDC)
    const decimals = extra.decimals ? Number(extra.decimals) : 6;

    const startTime = Date.now();
    
    try {
      // 1. Get Token Accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        splTokenMint,
        payer.publicKey
      );
      const toTokenAccount = await getAssociatedTokenAddress(
        splTokenMint,
        toPublicKey
      );

      // --- **THE FIX IS HERE** ---
      // As per the Go code, we MUST add compute budget instructions
      
      // Instruction 1: SetComputeUnitLimit
      const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 200000, // 200,000 units
      });

      // Instruction 2: SetComputeUnitPrice
      const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 10000, // 10,000 microlamports
      });

      // Instruction 3: The Transfer
      // We use `createTransferCheckedInstruction` as per the Go code
      const transferIx = createTransferCheckedInstruction(
        fromTokenAccount,  // from
        splTokenMint,      // mint
        toTokenAccount,    // to
        payer.publicKey,   // from's owner
        amount,            // amount
        decimals           // decimals
      );

      // 4. Create the transaction
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: feePayerPublicKey, 
      })
      .add(computeLimitIx) // <-- INSTRUCTION 1
      .add(computePriceIx) // <-- INSTRUCTION 2
      .add(transferIx);    // <-- INSTRUCTION 3
      
      // 5. PARTIALLY sign
      transaction.partialSign(payer);
      
      // 6. Serialize
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
      });

      const signTimeMs = Date.now() - startTime;
      
      return {
        serializedTx_base64: serializedTx.toString('base64'),
        signTimeMs,
      };

    } catch (err) {
      console.error(`[SignError] ${err.message}`);
      throw new Error(`Solana Sign Error: ${err.message}`);
    }
  }
}
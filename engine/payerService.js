import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import fs from 'fs';
import bs58 from 'bs58';

const WALLET_FILE = 'wallets.json';

export class PayerService {
  constructor(rpcEndpoints, splTokenMint) {
    this.rpcEndpoints = rpcEndpoints;
    this.splTokenMint = new PublicKey(splTokenMint);
    this.wallets = []; // This will be populated by loadWallets()
    this.rpcIndex = 0;
    this.walletIndex = 0;
    
    // Load wallets right when the service is created
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
      console.error('Did you run `node utils/generate-wallets.js` first?');
      process.exit(1); // Exit if wallets can't be loaded
    }
  }

  // --- Pool Management ---

  getWallet() {
    this.walletIndex = (this.walletIndex + 1) % this.wallets.length;
    return this.wallets[this.walletIndex];
  }

  getRpcEndpoint() {
    this.rpcIndex = (this.rpcIndex + 1) % this.rpcEndpoints.length;
    return this.rpcEndpoints[this.rpcIndex];
  }
  
  // ... createSignedTransaction method remains exactly the same ...
  
  async createSignedTransaction(paymentDetails) {
    // (This function is identical to the one in the previous answer)
    const rpcUrl = this.getRpcEndpoint();
    const connection = new Connection(rpcUrl, 'confirmed');
    const payer = this.getWallet();

    const { recipient, amount } = paymentDetails;
    const toPublicKey = new PublicKey(recipient);

    const startTime = Date.now();
    
    try {
      const fromTokenAccount = await getAssociatedTokenAddress(
        this.splTokenMint,
        payer.publicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        this.splTokenMint,
        toPublicKey
      );

      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        payer.publicKey,
        BigInt(amount)
      );

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: payer.publicKey,
      }).add(transferInstruction);

      transaction.sign(payer);
      const serializedTx = transaction.serialize();
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
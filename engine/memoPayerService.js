import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferCheckedInstruction, getMint } from '@solana/spl-token';
import fs from 'fs';
import bs58 from 'bs58';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const WALLET_FILE = 'wallets.json';

export class MemoPayerService {
  constructor(rpcEndpoints, splTokenMint) {
    this.rpcEndpoints = rpcEndpoints;
    this.splTokenMint = new PublicKey(splTokenMint);
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
      console.error('Did you run `node utils/generate-wallets.js` first?');
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

  // Build a tx that matches "exact" server templates
  async createSignedTransaction(paymentDetails) {
    const rpcUrl = this.getRpcEndpoint();
    const connection = new Connection(rpcUrl, 'confirmed');
    const payer = this.getWallet();

    const { payTo, maxAmountRequired, asset, extra = {}, resource } = paymentDetails;

    const toOwner = new PublicKey(payTo);
    const mintPk = new PublicKey(asset);
    const amountRaw = BigInt(maxAmountRequired);
    const feePayer = new PublicKey(extra.feePayer);

    // Determine decimals: use extra.decimals if provided, else fetch from chain
    let decimals;
    if (typeof extra.decimals === 'number') {
      decimals = extra.decimals;
    } else {
      const mintInfo = await getMint(connection, mintPk);
      decimals = mintInfo.decimals; // safer than guessing
    }

    // Expectation controls (defaults to EXACTLY 1 instruction)
    const expectMemo = !!extra.expectMemo;         // set to true ONLY if server says memo is required
    const expectedIxCount = expectMemo ? 2 : 1;    // server "exact" templates typically 1 or 2

    const start = Date.now();

    try {
      // Derive ATAs (do NOT create inside this tx)
      const fromAta = await getAssociatedTokenAddress(mintPk, payer.publicKey);
      const toAta   = await getAssociatedTokenAddress(mintPk, toOwner);

      const ixs = [];

      // Add Memo ONLY if explicitly required
      if (expectMemo) {
        const memoText = (extra.memo ?? resource ?? '').toString();
        if (!memoText) {
          throw new Error('Server expects a Memo but no memo text provided (extra.memo/resource missing).');
        }
        ixs.push(
          new TransactionInstruction({
            programId: MEMO_PROGRAM_ID,
            keys: [],
            data: Buffer.from(memoText, 'utf8'),
          })
        );
      }

      // TransferChecked as the ONLY (or second) instruction
      ixs.push(
        createTransferCheckedInstruction(
          fromAta,
          mintPk,
          toAta,
          payer.publicKey,
          Number(amountRaw), // fine for small amounts like 5000
          decimals
        )
      );

      // Assemble tx with facilitator fee payer
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: feePayer,
      }).add(...ixs);

      // Partial sign by the token owner only
      tx.partialSign(payer);

      // Serialize without facilitator sig
      const serialized = tx.serialize({ requireAllSignatures: false });

      // Debug: verify instruction count BEFORE sending to server
      const deser = Transaction.from(serialized);
      console.log('[Debug] ix count =', deser.instructions.length, `(expected ${expectedIxCount})`);
      deser.instructions.forEach((ix, i) =>
        console.log(`[Debug] ix[${i}] program = ${ix.programId.toBase58()}`)
      );

      if (deser.instructions.length !== expectedIxCount) {
        console.warn('[Warn] Instruction count does not match expected template. Server may reject this tx.');
      }

      return {
        serializedTx_base64: serialized.toString('base64'),
        signTimeMs: Date.now() - start,
      };
    } catch (e) {
      console.error(`[SignError] ${e.message}`);
      throw new Error(`Solana Sign Error: ${e.message}`);
    }
  }
}

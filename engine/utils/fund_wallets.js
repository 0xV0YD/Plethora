import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import fs from 'fs';
import dotenv from 'dotenv';
import bs58 from 'bs58';

dotenv.config({ path: './.env' }); // Ensure it reads the .env from root

const DEVNET_RPC = 'https://api.devnet.solana.com';
const WALLET_FILE = 'wallets.json';

// --- CONFIGURE THESE ---
const SOL_TO_SEND = 0.05; // 0.001 SOL per wallet for fees
const TOKEN_TO_SEND = 100000; 
const YOUR_SPL_TOKEN_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // This is USDC on devnet
// -----------------------

async function fund() {
  console.log('Starting wallet funding process...');

  const connection = new Connection(DEVNET_RPC, 'confirmed');
  const mintPublicKey = new PublicKey(YOUR_SPL_TOKEN_MINT);

  // 1. Load Funder Wallet 
  if (!process.env.FUNDER_WALLET_SECRET_KEY) {
    throw new Error('FUNDER_WALLET_SECRET_KEY not found in .env');
  }
  const funderKeypair = Keypair.fromSecretKey(
    bs58.decode(process.env.FUNDER_WALLET_SECRET_KEY)
  );
  console.log(`Funder wallet: ${funderKeypair.publicKey.toBase58()}`);

  // 2. Load Wallets to Fund from file
  let walletsToFund;
  try {
    walletsToFund = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${WALLET_FILE}.`);
    console.error('Please run `node utils/generate-wallets.js` first.');
    return;
  }

  const funderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    funderKeypair,
    mintPublicKey,
    funderKeypair.publicKey
  );

  console.log(`Funding ${walletsToFund.length} wallets...`);

  // 3. Loop and fund each wallet
  for (const wallet of walletsToFund) {
    const walletPublicKey = new PublicKey(wallet.publicKey);
    try {
      console.log(`Funding ${walletPublicKey.toBase58()}...`);
      
      // A. Send SOL
      const solTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: funderKeypair.publicKey,
          toPubkey: walletPublicKey,
          lamports: SOL_TO_SEND * LAMPORTS_PER_SOL,
        })
      );
      await sendAndConfirmTransaction(connection, solTx, [funderKeypair]);

      // B. Send SPL Token
      const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        funderKeypair, // Payer for account creation
        mintPublicKey,
        walletPublicKey
      );

      await transfer(
        connection,
        funderKeypair, // Payer
        funderTokenAccount.address,
        destinationTokenAccount.address,
        funderKeypair.publicKey,
        BigInt(TOKEN_TO_SEND) // Assumes your token has 6 decimals like USDC
      );

      console.log(`Successfully funded ${walletPublicKey.toBase58()}`);
    } catch (err) {
      console.error(`Failed to fund ${walletPublicKey.toBase58()}: ${err.message}`);
    }
  }
  console.log('Wallet funding complete.');
}

fund();
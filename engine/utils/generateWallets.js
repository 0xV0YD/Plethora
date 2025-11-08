// Run this ONCE with: node utils/generate-wallets.js
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import bs58 from 'bs58';

const WALLET_POOL_SIZE = 200;
const WALLET_FILE = 'wallets.json';

function generateWallets() {
  console.log(`Generating ${WALLET_POOL_SIZE} wallets...`);
  const wallets = [];
  for (let i = 0; i < WALLET_POOL_SIZE; i++) {
    const keypair = Keypair.generate();
    wallets.push({
      publicKey: keypair.publicKey.toBase58(),
      // We save the secret key to be able to reconstruct the wallet
      secretKey: bs58.encode(keypair.secretKey),
    });
  }

  fs.writeFileSync(WALLET_FILE, JSON.stringify(wallets, null, 2));
  console.log(`Successfully generated and saved wallets to ${WALLET_FILE}`);
  console.log(`IMPORTANT: Add ${WALLET_FILE} to your .gitignore NOW.`);
}

generateWallets();
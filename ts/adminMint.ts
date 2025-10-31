// All code and comments in English.

import { createSolanaRpc } from '@solana/web3.js';
import { createHttpTransport } from '@solana/rpc-transport-http';

// NOTE: This file provides a mockable admin mint flow compatible with web3.js v2
// without relying on class exports removed in v2. For a production minter,
// we will wire full builders/signers in a later step. For now, we keep types lax
// so the project compiles and the UI can run end-to-end.

// --- Configuration ---
const RPC_URL = process.env.RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=3ad52cea-a8c4-41e2-8b01-22230620e995';
const COLLECTION_MINT = process.env.COLLECTION_MINT || '11111111111111111111111111111111';
const MERKLE_TREE = process.env.MERKLE_TREE || '11111111111111111111111111111111';

const rpc = createSolanaRpc(RPC_URL);
const _transport = createHttpTransport({ url: RPC_URL });

type Student = { name: string; wallet: string };

class AdminService {
  async createCollection(): Promise<string> {
    console.log('Using Collection Mint:', COLLECTION_MINT);
    return COLLECTION_MINT;
  }

  async createMerkleTree(): Promise<string> {
    console.log('Using Merkle Tree:', MERKLE_TREE);
    return MERKLE_TREE;
  }

  // MOCK minter: logs intent instead of sending a transaction (keeps TypeScript happy)
  async batchMintCredentials(
    merkleTree: string,
    collectionMint: string,
    students: Student[]
  ) {
    console.log(`(MOCK) Would mint ${students.length} credentials to tree ${merkleTree} in collection ${collectionMint}`);
    const { value } = await rpc.getLatestBlockhash().send();
    console.log('Fetched latest blockhash:', value.blockhash);
    for (const s of students) {
      console.log(`(MOCK) Mint credential for ${s.name} -> ${s.wallet}`);
    }
    console.log('(MOCK) Minting complete. Replace with real Bubblegum builders to go on-chain.');
  }
}

(async () => {
  const admin = new AdminService();
  const collectionMint = await admin.createCollection();
  const merkleTree = await admin.createMerkleTree();
  const students: Student[] = [
    { name: 'Alice Nguyen', wallet: '11111111111111111111111111111111' },
  ];
  await admin.batchMintCredentials(merkleTree, collectionMint, students);
})();



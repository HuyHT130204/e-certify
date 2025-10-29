/*
  Admin minting service (scaffold) for APEC-Credify
  - Uses @solana/web3.js v2 transport
  - Prepares Bubblegum MintToCollection instruction
  Note: For hackathon MVP, several parts are placeholders (collection creation, Anchor provider setup).
*/

import {
  createSolanaRpc,
  createHttpTransport,
  Keypair,
  PublicKey,
  generateKeypair,
  address,
  signTransaction
} from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import {
  createMintToCollectionV1Instruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID
} from '@metaplex-foundation/mpl-bubblegum';

// v2 compatible SPL Account Compression types imported via Bubblegum instruction building

// Replace with your RPC (Helius strongly recommended)
const RPC_URL = 'https://api.devnet.solana.com';
// Replace with your admin secret key
const PAYER_SECRET_KEY = new Uint8Array([]); // TODO: fill in

const rpc = createSolanaRpc(RPC_URL);
const transport = createHttpTransport({ url: RPC_URL });

const payer = Keypair.fromSecretKey(PAYER_SECRET_KEY);
const wallet = new Wallet(payer);

export type StudentInput = { name: string; wallet: PublicKey };

class AdminService {
  private rpc = rpc;
  private payer = payer;

  async createCollection(): Promise<PublicKey> {
    console.log('Creating Collection NFT (placeholder)...');
    // TODO: Use Metaplex (Umi) to create a verified Collection NFT
    const collectionMint = new PublicKey('YourHardcodedCollectionMint');
    console.log('Collection Mint:', collectionMint.toBase58());
    return collectionMint;
  }

  async createMerkleTree(maxDepth = 14, maxBufferSize = 64): Promise<PublicKey> {
    console.log('Creating Merkle Tree (placeholder)...');
    // TODO: Call Anchor program create_tree with PDA authority
    const merkleTree = generateKeypair();
    console.log('Merkle Tree created:', merkleTree.publicKey.toBase58());
    return merkleTree.publicKey;
  }

  async batchMintCredentials(
    merkleTree: PublicKey,
    collectionMint: PublicKey,
    students: StudentInput[]
  ) {
    console.log(`Starting to mint ${students.length} credentials...`);

    for (const student of students) {
      const metadata = {
        name: `APEC Dual-Degree: ${student.name}`,
        symbol: 'APEC-DD',
        uri: 'https://example.com/metadata.json',
        sellerFeeBasisPoints: 0,
        creators: [{ address: this.payer.publicKey, verified: true, share: 100 }],
        collection: { key: collectionMint, verified: false },
        uses: null,
        primarySaleHappened: false,
        isMutable: true,
        tokenStandard: 0
      } as any; // Bubblegum metadataArgs type

      // Minimal account metas required by Bubblegum mint_to_collection
      const accounts: any = {
        treeAuthority: PublicKey.findProgramAddressSync([Buffer.from('authority')], new PublicKey('CRD111111111111111111111111111111111111111'))[0],
        leafOwner: student.wallet,
        leafDelegate: student.wallet,
        merkleTree,
        payer: this.payer.publicKey,
        treeDelegate: this.payer.publicKey,
        logWrapper: new PublicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
        compressionProgram: new PublicKey('cmtDvXumGCrqC1AgeyjX7G9sps45Hkuk6NBR3Vv5qfC'),
        bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
        collectionMint,
        collectionAuthority: this.payer.publicKey,
        collectionAuthorityRecordPda: new PublicKey('11111111111111111111111111111111'),
        collectionMetadata: new PublicKey('11111111111111111111111111111111'),
        editionAccount: new PublicKey('11111111111111111111111111111111')
      };

      const ix = createMintToCollectionV1Instruction(accounts as any, { metadataArgs: metadata });

      const { value: { blockhash } } = await this.rpc.getLatestBlockhash().send();

      const tx = {
        version: 0 as const,
        recentBlockhash: blockhash,
        feePayer: this.payer.publicKey,
        instructions: [ix]
      };

      const signed = await signTransaction(tx, [this.payer]);
      const sig = await this.rpc.sendTransaction(signed).send();
      console.log(`Minted credential for ${student.name}: ${sig}`);
    }
  }
}

(async () => {
  const admin = new AdminService();
  const collectionMint = await admin.createCollection();
  const merkleTree = await admin.createMerkleTree();

  const students: StudentInput[] = [
    { name: 'Alice Nguyen', wallet: new PublicKey('11111111111111111111111111111111') }
  ];

  await admin.batchMintCredentials(merkleTree, collectionMint, students);
})();



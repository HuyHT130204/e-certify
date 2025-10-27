import { PublicKey, Transaction, Connection } from '@solana/web3.js';

// Helper function to safely create PublicKey
function createPublicKey(address: string): PublicKey {
  try {
    return new PublicKey(address);
  } catch (error) {
    console.warn(`Invalid PublicKey address: ${address}`, error);
    // Return a fallback PublicKey for MVP
    return new PublicKey('11111111111111111111111111111111');
  }
}

// Metaplex Bubblegum Program ID (Mainnet)
export const BUBBLEGUM_PROGRAM_ID = createPublicKey('BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY');

// SPL Compression Program ID (Mainnet)
export const COMPRESSION_PROGRAM_ID = createPublicKey('cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91LzxKmVg');

// SPL Log Wrapper Program ID (Noop Program) - Using correct Noop address
export const LOG_WRAPPER_PROGRAM_ID = createPublicKey('noopb9bkMVfRPU8AsbpTUg4AQVxCuBmMZbD1e16Yga9');

// Token Metadata Program ID (Mainnet)
export const TOKEN_METADATA_PROGRAM_ID = createPublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Token Program ID (Mainnet)
export const TOKEN_PROGRAM_ID = createPublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export interface CredentialMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface MintCredentialParams {
  merkleTree: PublicKey;
  leafOwner: PublicKey;
  treeAuthority: PublicKey;
  payer: PublicKey;
  metadata: CredentialMetadata;
  metadataUri: string;
}

// Create a simple cNFT mint instruction for MVP
export async function createMintCredentialInstruction(
  params: MintCredentialParams
): Promise<Transaction> {
  const transaction = new Transaction();

  // For MVP, we'll create a simplified instruction that logs the credential
  // In production, this would be a proper Bubblegum mint instruction
  const instructionData = Buffer.concat([
    Buffer.from([0]), // Mint discriminator
    params.leafOwner.toBuffer(),
    Buffer.from(params.metadata.name, 'utf8'),
    Buffer.from(params.metadataUri, 'utf8'),
  ]);

  const mintInstruction = {
    programId: BUBBLEGUM_PROGRAM_ID,
    keys: [
      { pubkey: params.leafOwner, isSigner: false, isWritable: false },
      { pubkey: params.merkleTree, isSigner: false, isWritable: true },
      { pubkey: params.treeAuthority, isSigner: true, isWritable: false },
      { pubkey: params.payer, isSigner: true, isWritable: true },
      { pubkey: BUBBLEGUM_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false }, // System Program
    ],
    data: instructionData,
  };

  transaction.add(mintInstruction);
  return transaction;
}

// Upload metadata to Arweave (simplified for MVP)
export async function uploadMetadataToArweave(
  metadata: CredentialMetadata
): Promise<string> {
  // For MVP, we'll return a mock URI
  // In production, this would upload to Arweave or IPFS
  const mockUri = `https://arweave.net/mock-${Date.now()}`;
  
  // Log the metadata for debugging
  console.log('Uploading metadata:', metadata);
  console.log('Mock URI:', mockUri);
  
  return mockUri;
}

// Mint credential for a single student
export async function mintCredentialForStudent(
  connection: Connection,
  wallet: {
    publicKey: PublicKey | null;
    signTransaction: ((transaction: Transaction) => Promise<Transaction>) | undefined;
  },
  studentWallet: PublicKey,
  credentialName: string,
  credentialType: string,
  skillBusiness: string,
  skillTech: string,
  merkleTree: PublicKey
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  // Create metadata
  const metadata: CredentialMetadata = {
    name: credentialName,
    symbol: 'APEC-CRED',
    description: `Credential issued by APEC University: ${credentialName}`,
    image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=APEC+Credential',
    attributes: [
      { trait_type: 'Credential_Type', value: credentialType },
      { trait_type: 'Skill_Business', value: skillBusiness },
      { trait_type: 'Skill_Tech', value: skillTech },
      { trait_type: 'Issuer_Name', value: 'APEC University' },
      { trait_type: 'Issuer_Address', value: wallet.publicKey.toString() },
      { trait_type: 'Valid_Until', value: '2025-12-31' },
    ],
  };

  // Upload metadata
  const metadataUri = await uploadMetadataToArweave(metadata);

  // Create mint instruction
  const mintParams: MintCredentialParams = {
    merkleTree,
    leafOwner: studentWallet,
    treeAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    metadata,
    metadataUri,
  };

  const transaction = await createMintCredentialInstruction(mintParams);

  // Sign and send transaction
  const signedTransaction = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  await connection.confirmTransaction(signature);

  return signature;
}

// Batch mint credentials for multiple students
export async function batchMintCredentials(
  connection: Connection,
  wallet: {
    publicKey: PublicKey | null;
    signTransaction: ((transaction: Transaction) => Promise<Transaction>) | undefined;
  },
  students: Array<{
    wallet: PublicKey;
    name: string;
    internalId: string;
  }>,
  credentialName: string,
  credentialType: string,
  skillBusiness: string,
  skillTech: string,
  merkleTree: PublicKey,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const signatures: string[] = [];
  
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    try {
      const signature = await mintCredentialForStudent(
        connection,
        wallet,
        student.wallet,
        credentialName,
        credentialType,
        skillBusiness,
        skillTech,
        merkleTree
      );
      
      signatures.push(signature);
      
      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, students.length);
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Failed to mint credential for student ${student.name}:`, error);
      // Continue with next student
    }
  }
  
  return signatures;
}
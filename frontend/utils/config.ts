// Environment configuration for E-Certify MVP
export const CONFIG = {
  SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID || 'ECertifyProgram11111111111111111111111111111',
  HELIUS_API_KEY: process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'demo-key',
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' 
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com',
} as const;


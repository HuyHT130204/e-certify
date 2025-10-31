APEC-Credify

Overview
- A Solana Colosseum Hackathon MVP to issue, manage, and verify academic credentials for APEC University using compressed NFTs (cNFTs) on Solana.
- System components: Anchor on-chain authority, Admin minting script (TypeScript), Student PWA (Next.js) with DAS, and a simple Verifier page.

Critical SDKs and Versions
- @solana/web3.js ^2.0.0
- @coral-xyz/anchor ^0.32.1 (JS), anchor-lang = 0.32.1 (Rust)
- @solana-program/token ^0.6.0
- @metaplex-foundation/mpl-bubblegum ^5.0.2
- spl-account-compression ^0.2.0 (Rust), mpl-bubblegum ^2.1.1 (Rust)
- @solana/rpc-transport-http ^2.0.0

Monorepo Layout
- Anchor program: programs/credify_program
- Admin script: ts/adminMint.ts
- Frontend (Next.js App Router): app/

Prerequisites
- Node 18+
- Rust 1.90.0 (2024 edition)
- Anchor CLI 0.32.0, Solana CLI ~2.3.13

Setup
1) Install dependencies
   npm install

2) Configure environment
   - Create a file named `.env.local` in the project root and set:
     - `NEXT_PUBLIC_DAS_URL` = a DAS-enabled RPC URL (e.g., your Helius URL)
     - `NEXT_PUBLIC_DEMO_OWNER` = a base58 wallet address to preview credentials
     - `NEXT_PUBLIC_APEC_COLLECTION` = optional collection mint to filter credentials
     - `RPC_URL` = same as above (used by the admin script)
     - `COLLECTION_MINT` = your collection mint address (for cNFT grouping)
     - `MERKLE_TREE` = your merkle tree address

Build
- On-chain: anchor build

Run Admin Script (mint)
- npx ts-node ts/adminMint.ts

Run Frontend (PWA)
- npm run dev
- App runs at http://localhost:3000

Notes
- The Anchor program intentionally avoids CPI minting to Bubblegum for MVP simplicity; the admin script mints directly using Bubblegum.
- Use a DAS-enabled RPC (e.g., Helius) for SkillsPassport and Verification pages.
 - Wallet: The dashboard includes a simple Phantom connect button (no seed phrase exposure). Install Phantom and click "Connect Wallet".
 - Env: copy .env.local.example to .env.local and fill RPC/collection/owner values. If not present, the app will still render and can mock or show public content.


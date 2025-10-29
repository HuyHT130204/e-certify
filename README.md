# APEC-Credify

A Solana Colosseum Hackathon MVP to create an on-chain credentialing system for APEC University using compressed NFTs (cNFTs).

## Product Overview
- B2B admin issues credentials in batch to students
- Students view a mobile-first Skills Passport (your existing frontend)
- Verifiers confirm authenticity via a public verification page (provided by your frontend)

## Critical SDKs and Versions
- @solana/web3.js: ^2.0.0 (v2 API)
- @coral-xyz/anchor: ^0.32.1 (TS client)
- Anchor Rust crate: 0.32.1
- Anchor CLI: 0.32.0 (via avm)
- @metaplex-foundation/mpl-bubblegum: ^5.0.2 (cNFTs)
- @solana-program/token: ^0.6.0
- @solana/rpc-transport-http: ^2.0.0
- Rust edition: 2021 (use stable 1.90.0+ as available)

## Project Structure
- programs/credify_program: Anchor on-chain program (tree authority, governance scaffolding)
- ts/adminMint.ts: Admin backend script to batch mint credentials using Bubblegum
- frontend/: Your existing frontend application (use this for UI)

## Prerequisites
- Node.js 18+
- pnpm/npm/yarn
- Rust + Solana + Anchor CLI
  - avm install 0.32.0 && avm use 0.32.0
  - anchor --version

## Install Dependencies (root: on-chain + admin script)
```bash
npm install
```

## Build On-chain Program
```bash
npm run anchor:build
```

## Run Admin Script
Edit `ts/adminMint.ts` and fill in your payer secret key, collection mint, and RPC.
```bash
npx ts-node ts/adminMint.ts
```

## Frontend
Use your existing app under `frontend/`. Install and run it with your current workflow, e.g.:
```bash
cd frontend
npm install
npm run dev
```

## Environment
- DAS RPC (Helius) for asset queries:
  - `https://mainnet.helius-rpc.com/?api-key=3ad52cea-a8c4-41e2-8b01-22230620e995`

## Notes
- On-chain CPI details for creating trees and proof math verification are left as placeholders for the MVP. Replace with full implementations as you iterate.

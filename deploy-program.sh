#!/bin/bash

# E-Certify Program Deployment Script
# This script builds and deploys the E-Certify program to Solana Devnet

set -e

echo "🚀 Starting E-Certify Program Deployment..."

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI is not installed. Please install it first."
    echo "   Visit: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Check if we're on the right network
echo "📡 Checking Solana network..."
CURRENT_NETWORK=$(solana config get | grep "RPC URL" | awk '{print $3}')
echo "Current network: $CURRENT_NETWORK"

if [[ "$CURRENT_NETWORK" != *"devnet"* ]]; then
    echo "⚠️  Not on devnet. Switching to devnet..."
    solana config set --url devnet
fi

# Check wallet
echo "💰 Checking wallet..."
WALLET_ADDRESS=$(solana address)
if [ -z "$WALLET_ADDRESS" ]; then
    echo "❌ No wallet configured. Please run: solana-keygen new"
    exit 1
fi
echo "Wallet address: $WALLET_ADDRESS"

# Check SOL balance
BALANCE=$(solana balance)
echo "SOL balance: $BALANCE"

if [ "$BALANCE" = "0 SOL" ]; then
    echo "⚠️  No SOL balance. Requesting airdrop..."
    solana airdrop 2
    echo "✅ Airdrop completed"
fi

# Build the program
echo "🔨 Building E-Certify program..."
cd program

# Try to build with cargo build-bpf first
if command -v cargo build-bpf &> /dev/null; then
    echo "Using cargo build-bpf..."
    cargo build-bpf
else
    echo "Using cargo build-sbf..."
    cargo build-sbf
fi

# Deploy the program
echo "🚀 Deploying program to Devnet..."
PROGRAM_ID=$(solana program deploy target/deploy/e_certify.so --program-id target/deploy/e_certify-keypair.json)

if [ $? -eq 0 ]; then
    echo "✅ Program deployed successfully!"
    echo "Program ID: $PROGRAM_ID"
    
    # Update the program ID in the frontend
    echo "📝 Updating program ID in frontend..."
    cd ../frontend
    
    # Update the program ID in ecertify.ts
    sed -i "s/ECertifyProgram11111111111111111111111111111/$PROGRAM_ID/g" utils/ecertify.ts
    
    # Update the program ID in bubblegum.ts
    sed -i "s/ECertifyProgram11111111111111111111111111111/$PROGRAM_ID/g" utils/bubblegum.ts
    
    # Update the program ID in helius.ts
    sed -i "s/ECertifyProgram11111111111111111111111111111/$PROGRAM_ID/g" utils/helius.ts
    
    echo "✅ Program ID updated in frontend files"
    
    # Create a deployment summary
    echo "📋 Creating deployment summary..."
    cat > ../DEPLOYMENT_SUMMARY.md << EOF
# E-Certify Program Deployment Summary

## Deployment Details
- **Network**: Solana Devnet
- **Program ID**: $PROGRAM_ID
- **Wallet**: $WALLET_ADDRESS
- **Deployment Time**: $(date)
- **Build Status**: ✅ Success

## Updated Files
- \`frontend/utils/ecertify.ts\`
- \`frontend/utils/bubblegum.ts\`
- \`frontend/utils/helius.ts\`

## Next Steps
1. Start the frontend: \`cd frontend && npm run dev\`
2. Test the application at: http://localhost:3000
3. Connect wallet and test all three flows:
   - Admin Dashboard (Issuer Registration)
   - Student Wallet (Credential Viewing)
   - Verifier Portal (Credential Verification)

## Program Instructions
- \`initialize_issuer\`: Register university as credential issuer
- \`create_merkle_tree\`: Create Merkle tree for credential batch
- \`issue_credential_via_cpi\`: Mint cNFT credential
- \`verify_zk_proof\`: Verify Zero-Knowledge proofs (placeholder)

EOF
    
    echo "✅ Deployment summary created: DEPLOYMENT_SUMMARY.md"
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "📖 Check DEPLOYMENT_SUMMARY.md for details"
    echo "🚀 Start the frontend with: cd frontend && npm run dev"
    
else
    echo "❌ Program deployment failed!"
    exit 1
fi
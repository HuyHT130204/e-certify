# E-Certify Program Deployment Script for Windows
# This script builds and deploys the E-Certify program to Solana Devnet

Write-Host "🚀 Starting E-Certify Program Deployment..." -ForegroundColor Green

# Check if Solana CLI is installed
try {
    $solanaVersion = solana --version
    Write-Host "✅ Solana CLI found: $solanaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Solana CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Visit: https://docs.solana.com/cli/install-solana-cli-tools" -ForegroundColor Yellow
    exit 1
}

# Check if we're on the right network
Write-Host "📡 Checking Solana network..." -ForegroundColor Cyan
$config = solana config get
$currentNetwork = ($config | Select-String "RPC URL").ToString().Split(" ")[-1]
Write-Host "Current network: $currentNetwork" -ForegroundColor Yellow

if ($currentNetwork -notlike "*devnet*") {
    Write-Host "⚠️  Not on devnet. Switching to devnet..." -ForegroundColor Yellow
    solana config set --url devnet
}

# Check wallet
Write-Host "💰 Checking wallet..." -ForegroundColor Cyan
$walletAddress = solana address
if ([string]::IsNullOrEmpty($walletAddress)) {
    Write-Host "❌ No wallet configured. Please run: solana-keygen new" -ForegroundColor Red
    exit 1
}
Write-Host "Wallet address: $walletAddress" -ForegroundColor Green

# Check SOL balance
$balance = solana balance
Write-Host "SOL balance: $balance" -ForegroundColor Yellow

if ($balance -eq "0 SOL") {
    Write-Host "⚠️  No SOL balance. Requesting airdrop..." -ForegroundColor Yellow
    solana airdrop 2
    Write-Host "✅ Airdrop completed" -ForegroundColor Green
}

# Build the program
Write-Host "🔨 Building E-Certify program..." -ForegroundColor Cyan
Set-Location program

# Try to build with cargo build-bpf first
try {
    Write-Host "Using cargo build-bpf..." -ForegroundColor Yellow
    cargo build-bpf
} catch {
    Write-Host "Using cargo build-sbf..." -ForegroundColor Yellow
    cargo build-sbf
}

# Deploy the program
Write-Host "🚀 Deploying program to Devnet..." -ForegroundColor Cyan
$deployOutput = solana program deploy target/deploy/e_certify.so --program-id target/deploy/e_certify-keypair.json
$programId = ($deployOutput | Select-String "Program Id:").ToString().Split(" ")[-1]

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Program deployed successfully!" -ForegroundColor Green
    Write-Host "Program ID: $programId" -ForegroundColor Green
    
    # Update the program ID in the frontend
    Write-Host "📝 Updating program ID in frontend..." -ForegroundColor Cyan
    Set-Location ../frontend
    
    # Update the program ID in ecertify.ts
    (Get-Content utils/ecertify.ts) -replace "ECertifyProgram11111111111111111111111111111", $programId | Set-Content utils/ecertify.ts
    
    # Update the program ID in bubblegum.ts
    (Get-Content utils/bubblegum.ts) -replace "ECertifyProgram11111111111111111111111111111", $programId | Set-Content utils/bubblegum.ts
    
    # Update the program ID in helius.ts
    (Get-Content utils/helius.ts) -replace "ECertifyProgram11111111111111111111111111111", $programId | Set-Content utils/helius.ts
    
    Write-Host "✅ Program ID updated in frontend files" -ForegroundColor Green
    
    # Create a deployment summary
    Write-Host "📋 Creating deployment summary..." -ForegroundColor Cyan
    $summary = @"
# E-Certify Program Deployment Summary

## Deployment Details
- **Network**: Solana Devnet
- **Program ID**: $programId
- **Wallet**: $walletAddress
- **Deployment Time**: $(Get-Date)
- **Build Status**: ✅ Success

## Updated Files
- `frontend/utils/ecertify.ts`
- `frontend/utils/bubblegum.ts`
- `frontend/utils/helius.ts`

## Next Steps
1. Start the frontend: `cd frontend && npm run dev`
2. Test the application at: http://localhost:3000
3. Connect wallet and test all three flows:
   - Admin Dashboard (Issuer Registration)
   - Student Wallet (Credential Viewing)
   - Verifier Portal (Credential Verification)

## Program Instructions
- `initialize_issuer`: Register university as credential issuer
- `create_merkle_tree`: Create Merkle tree for credential batch
- `issue_credential_via_cpi`: Mint cNFT credential
- `verify_zk_proof`: Verify Zero-Knowledge proofs (placeholder)
"@
    
    $summary | Out-File -FilePath "../DEPLOYMENT_SUMMARY.md" -Encoding UTF8
    
    Write-Host "✅ Deployment summary created: DEPLOYMENT_SUMMARY.md" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "📖 Check DEPLOYMENT_SUMMARY.md for details" -ForegroundColor Yellow
    Write-Host "🚀 Start the frontend with: cd frontend && npm run dev" -ForegroundColor Yellow
    
} else {
    Write-Host "❌ Program deployment failed!" -ForegroundColor Red
    exit 1
}


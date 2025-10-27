# E-Certify Build and Deploy Script
Write-Host "Building E-Certify Solana Program..." -ForegroundColor Green

# Build the program
Write-Host "Step 1: Building program..." -ForegroundColor Yellow
cargo build --release

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Create deploy directory if it doesn't exist
    if (!(Test-Path "target/deploy")) {
        New-Item -ItemType Directory -Path "target/deploy" -Force
    }
    
    # Copy the built library to deploy directory
    $libPath = "target/release/e_certify.dll"
    $deployPath = "target/deploy/e_certify.so"
    
    if (Test-Path $libPath) {
        Copy-Item $libPath $deployPath -Force
        Write-Host "Program copied to deploy directory" -ForegroundColor Green
        
        # Deploy to devnet (if we have SOL)
        Write-Host "Step 2: Deploying to devnet..." -ForegroundColor Yellow
        solana program deploy target/deploy/e_certify.so --program-id ECertifyProgram11111111111111111111111111111
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Deployment successful!" -ForegroundColor Green
            Write-Host "Program ID: ECertifyProgram11111111111111111111111111111" -ForegroundColor Cyan
        } else {
            Write-Host "Deployment failed. You may need SOL in your wallet." -ForegroundColor Red
            Write-Host "Try: solana airdrop 1" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Build artifact not found at $libPath" -ForegroundColor Red
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}

Write-Host "Build and deploy script completed." -ForegroundColor Green


# Simple Frontend Start Script
Write-Host "Starting E-Certify Frontend..." -ForegroundColor Green

# Check if we're in frontend directory
if (!(Test-Path "package.json")) {
    Write-Host "Please run this script from the frontend directory" -ForegroundColor Red
    exit 1
}

# Create .env.local if it doesn't exist
if (!(Test-Path ".env.local")) {
    Write-Host "Creating environment file..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=ECertifyProgram11111111111111111111111111111
NEXT_PUBLIC_HELIUS_API_KEY=demo-key
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
}

Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

npm run dev


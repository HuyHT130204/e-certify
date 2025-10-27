#!/bin/bash

# E-Certify Demo Script
# This script starts the frontend demo without requiring Solana CLI

echo "🚀 Starting E-Certify Demo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Start the development server
echo "🚀 Starting development server..."
echo ""
echo "🎉 E-Certify Demo is starting!"
echo "📱 Open your browser and go to: http://localhost:3000"
echo ""
echo "🔧 Demo Features:"
echo "   - Admin Dashboard: Register issuer and create credential batches"
echo "   - Student Wallet: View and share credentials"
echo "   - Verifier Portal: Verify credential authenticity"
echo ""
echo "💡 Note: This is a demo version with mock data"
echo "   For production deployment, run: ./deploy-program.sh"
echo ""

npm run dev


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@solana/web3.js',
      '@coral-xyz/anchor',
      '@metaplex-foundation/mpl-bubblegum'
    ]
  }
};

export default nextConfig;



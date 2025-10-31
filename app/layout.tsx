import './globals.css';
export const metadata = {
  title: 'APEC-Credify',
  description: 'On-chain Skills Passport using Solana cNFTs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}



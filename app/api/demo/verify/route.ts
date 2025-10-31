import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { assetId } = await req.json();
  return NextResponse.json({
    ok: true,
    asset: {
      id: assetId || 'demo-asset',
      content: { metadata: { name: 'Verified Demo Credential' } },
    },
    proof: { root: 'DEMO_ROOT', leaf: 'DEMO_LEAF' },
  });
}




import { NextRequest, NextResponse } from 'next/server';

// Minimal batch mint endpoint (MVP): validates payload and returns mocked txids.
// Later we can import real Bubblegum minter here.

type CsvRow = {
  student_email: string;
  student_name: string;
  major: string;
  issue_date: string;
  wallet?: string;
};

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Partial<{
      collectionMint: string;
      merkleTree: string;
      rows: CsvRow[];
    }>;

    // Relaxed validation for MVP: only require rows array.
    if (!Array.isArray(payload?.rows)) {
      return NextResponse.json({ error: 'Invalid request body: rows are required' }, { status: 400 });
    }

    const collectionMint = payload.collectionMint || process.env.NEXT_PUBLIC_APEC_COLLECTION || process.env.COLLECTION_MINT || '';
    const merkleTree = payload.merkleTree || process.env.MERKLE_TREE || '';

    // Mocked: generate fake txids for each row (replace with real mint later)
    const results = payload.rows.map((r, i) => ({
      student_email: r.student_email,
      tx: `mockTx_${Date.now()}_${i}`,
    }));

    return NextResponse.json({ ok: true, count: results.length, results, collectionMint, merkleTree });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Mint failed' }, { status: 500 });
  }
}




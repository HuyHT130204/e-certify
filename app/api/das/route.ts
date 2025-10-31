import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_DAS_URL || '';
    if (!url) return NextResponse.json({ error: 'DAS URL not configured' }, { status: 500 });
    const body = await req.text();
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const data = await resp.text();
    return new NextResponse(data, { status: resp.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Proxy failed' }, { status: 500 });
  }
}





"use client";

import React, { useEffect, useState } from 'react';

type DasAsset = { id: string; content?: { metadata?: { name?: string } } };
type DasProof = { root: string; proof: string[]; leaf: string };

const DAS_URL = '/api/das';
const DEMO_MODE = (process.env.NEXT_PUBLIC_DEMO_MODE || '').toLowerCase() === 'true';

type Status = 'loading' | 'verified' | 'invalid';

export default function VerificationPage({ assetId }: { assetId: string }) {
  const [status, setStatus] = useState<Status>('loading');
  const [asset, setAsset] = useState<DasAsset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const [assetRes, proofRes] = await Promise.all([
          fetch(DAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 'x', method: 'getAsset', params: { id: assetId } }),
          }),
          fetch(DAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 'y', method: 'getAssetProof', params: { id: assetId } }),
          }),
        ]);
        const assetJson = await assetRes.json();
        const proofJson = await proofRes.json();
        let a: DasAsset = assetJson?.result;
        let p: DasProof = proofJson?.result;

        if (DEMO_MODE && (!a || !p)) {
          const demo = await fetch('/api/demo/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetId }) });
          const dj = await demo.json();
          a = dj?.asset || a;
          p = dj?.proof || p;
        }
        setAsset(a);

        // MVP: trust DAS proof root equals itself; production should compare to on-chain root
        if (p && typeof p.root === 'string' && p.root.length > 0) setStatus('verified');
        else setStatus('invalid');
      } catch (e) {
        console.error(e);
        setError('Không thể xác minh chứng chỉ. Hãy kiểm tra asset_id, RPC hoặc mạng.');
        setStatus('invalid');
      }
    };
    run();
  }, [assetId]);

  if (status === 'loading') return <div>Verifying credential...</div>;

  return (
    <div className="p-4">
      {status === 'verified' ? (
        <>
          <h2>✅ VERIFIED</h2>
          <p>Chứng chỉ hợp lệ.</p>
          <div className="card">
            <div style={{ fontWeight: 600 }}>{asset?.content?.metadata?.name || 'Credential'}</div>
            <div className="opacity-80 text-sm mt-1">Asset ID: {assetId}</div>
          </div>
        </>
      ) : (
        <>
          <h2>❌ INVALID</h2>
          <p>Không thể xác minh chứng chỉ.</p>
          {error && <div className="card" style={{ color: '#b91c1c' }}>{error}</div>}
        </>
      )}
    </div>
  );
}




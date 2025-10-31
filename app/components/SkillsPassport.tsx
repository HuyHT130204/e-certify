"use client";

import React, { useEffect, useState } from 'react';

type DasAsset = {
  id: string;
  content?: {
    json_uri?: string;
    metadata?: {
      name?: string;
      symbol?: string;
      attributes?: { trait_type: string; value: string }[];
    };
  };
  grouping?: { group_key: string; group_value: string }[];
};

const DAS_URL = process.env.NEXT_PUBLIC_DAS_URL || 'https://devnet.helius-rpc.com/?api-key=3ad52cea-a8c4-41e2-8b01-22230620e995';
const APEC_COLLECTION_MINT = process.env.NEXT_PUBLIC_APEC_COLLECTION || '';
const DEMO_MODE = (process.env.NEXT_PUBLIC_DEMO_MODE || '').toLowerCase() === 'true';

export default function SkillsPassport({ ownerBase58 }: { ownerBase58: string }) {
  const [credentials, setCredentials] = useState<DasAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerBase58) return;
    const fetchCredentials = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/das', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'apec-credify',
            method: 'getAssetsByOwner',
            params: { ownerAddress: ownerBase58 },
          }),
        });
        const body = await res.json();
        let items: DasAsset[] = body?.result?.items || [];
        if (DEMO_MODE && (!items || items.length === 0)) {
          const d = await fetch('/api/demo/credentials', { method: 'POST' });
          const dj = await d.json();
          items = dj?.result?.items || [];
        }
        const filtered = APEC_COLLECTION_MINT
          ? items.filter((a) => a.grouping?.find((g) => g.group_key === 'collection')?.group_value === APEC_COLLECTION_MINT)
          : items;
        setCredentials(filtered);
      } catch (e) {
        console.error('Failed to fetch credentials', e);
        setError('Không thể tải dữ liệu DAS. Vui lòng kiểm tra RPC hoặc mạng.');
      } finally {
        setLoading(false);
      }
    };
    fetchCredentials();
  }, [ownerBase58]);

  if (!ownerBase58) return <div style={{ opacity: 0.8 }}>Cung cấp địa chỉ ví để xem Hộ chiếu Kỹ năng.</div>;
  if (loading) return <div>Loading Skills Passport...</div>;

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div className="font-semibold">My Skills Passport</div>
        <ShareProfile ownerBase58={ownerBase58} />
      </div>
      {error && <div className="card" style={{ color: '#b91c1c' }}>{error}</div>}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {credentials.length === 0 ? (
          <div>Chưa có chứng chỉ nào.</div>
        ) : (
          credentials.map((c) => <CredentialCard key={c.id} asset={c} />)
        )}
      </div>
    </div>
  );
}

function CredentialCard({ asset }: { asset: DasAsset }) {
  const title = asset.content?.metadata?.name || 'Credential';
  const symbol = asset.content?.metadata?.symbol || '';
  return (
    <div className="card">
      <div className="font-semibold text-lg">{title}</div>
      <div className="opacity-70 mt-1">{symbol}</div>
    </div>
  );
}

function ShareProfile({ ownerBase58 }: { ownerBase58: string }) {
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/passport?owner=${ownerBase58}`
    : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(profileUrl)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(profileUrl); } catch {}
  };
  return (
    <div className="flex items-center gap-3">
      <img src={qrUrl} alt="QR" width={60} height={60} className="rounded" />
      <a className="btn-ghost" href={profileUrl} target="_blank" rel="noreferrer">Mở hồ sơ</a>
      <button className="btn-primary" onClick={copy}>Copy link</button>
    </div>
  );
}




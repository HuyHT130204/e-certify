const BASE = process.env.NEXT_PUBLIC_MOCK_BASE || 'http://localhost:4000';

// Lightweight safe fetch with timeout and graceful fallback so UI doesn't crash
async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    return null as any;
  }
}

export type Issuer = {
  authority: string;
  name: string;
  logo_uri: string;
  website: string;
  createdAt: string;
} | null;

export type Batch = {
  id: string;
  name: string;
  maxDepth: number;
  maxBufferSize: number;
  createdAt: string;
};

export async function getIssuer(): Promise<Issuer> {
  const res = await safeFetch(`${BASE}/api/issuer`);
  if (!res) return null;
  try {
    const json = await res.json();
    return json.issuer ?? null;
  } catch {
    return null;
  }
}

export async function registerIssuer(payload: { authority: string; name: string; logo_uri: string; website: string; }) {
  const res = await safeFetch(`${BASE}/api/register-issuer`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!res) return { ok: false, error: 'mock server unavailable' } as any;
  return res.json();
}

export async function getBatches(): Promise<Batch[]> {
  const res = await safeFetch(`${BASE}/api/batches`);
  if (!res) return [];
  try {
    const json = await res.json();
    return json.batches ?? [];
  } catch {
    return [];
  }
}

export async function createBatch(payload: { name: string; maxDepth: number; maxBufferSize: number; }) {
  const res = await safeFetch(`${BASE}/api/create-batch`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!res) return { ok: false } as any;
  return res.json();
}

export async function mintCredentials(payload: { students: Array<{ wallet: string; name: string; internalId: string; credentialName?: string; credentialType?: string; skillBusiness?: string; skillTech?: string; metadataUri?: string; }>; collectionMint?: string; }) {
  const res = await safeFetch(`${BASE}/api/mint-credentials`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!res) return { ok: false, results: [] } as any;
  return res.json();
}

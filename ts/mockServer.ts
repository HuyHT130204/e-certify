import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Load mock data
const dataPath = path.join(process.cwd(), 'mock', 'mock-data.json');
let db = { assets: [], proofs: [], issuer: null, batches: [] } as any;
function loadDb() {
  if (fs.existsSync(dataPath)) {
    db = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (!db.assets) db.assets = [];
    if (!db.proofs) db.proofs = [];
    if (!db.batches) db.batches = [];
    if (!('issuer' in db)) db.issuer = null;
  } else {
    console.warn('Mock data not found, starting with empty DB');
  }
}
function saveDb() {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf-8');
}
loadDb();

// Simple helper to build JSON-RPC responses
function rpcResult(id: any, result: any) {
  return { jsonrpc: '2.0', id, result };
}
function rpcError(id: any, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

// JSON-RPC DAS mocks
app.post('/', (req, res) => {
  const { id, method, params } = req.body || {};
  try {
    switch (method) {
      case 'getAssetsByOwner': {
        const ownerAddress = params?.ownerAddress as string;
        const limit = params?.limit ?? 100;
        const page = params?.page ?? 1;
        const items = db.assets.filter((a: any) => a.ownership?.owner === ownerAddress);
        const start = (page - 1) * limit;
        const paginated = items.slice(start, start + limit);
        return res.json(rpcResult(id, { items: paginated, total: items.length, limit, page }));
      }
      case 'getAsset': {
        const assetId = params?.id as string;
        const asset = db.assets.find((a: any) => a.id === assetId);
        if (!asset) return res.json(rpcError(id, -32004, 'Asset not found'));
        return res.json(rpcResult(id, asset));
      }
      case 'getAssetProof': {
        const assetId = params?.id as string;
        const proof = db.proofs.find((p: any) => p.leaf === assetId);
        if (!proof) return res.json(rpcError(id, -32004, 'Proof not found'));
        return res.json(rpcResult(id, proof));
      }
      default:
        return res.json(rpcError(id, -32601, `Method not found: ${method}`));
    }
  } catch (e: any) {
    return res.json(rpcError(id, -32603, e?.message || 'Internal error'));
  }
});

// REST endpoints for full demo flows
app.get('/api/issuer', (_req, res) => {
  return res.json({ issuer: db.issuer });
});

app.post('/api/register-issuer', (req, res) => {
  const { authority, name, logo_uri, website } = req.body || {};
  db.issuer = { authority, name, logo_uri, website, createdAt: new Date().toISOString() };
  saveDb();
  return res.json({ ok: true, issuer: db.issuer });
});

app.get('/api/batches', (_req, res) => {
  return res.json({ batches: db.batches });
});

app.post('/api/create-batch', (req, res) => {
  const { name, maxDepth, maxBufferSize } = req.body || {};
  const batch = {
    id: `batch-${Date.now()}`,
    name: name || 'Default Batch',
    maxDepth: maxDepth ?? 20,
    maxBufferSize: maxBufferSize ?? 64,
    createdAt: new Date().toISOString()
  };
  db.batches.push(batch);
  saveDb();
  return res.json({ ok: true, batch });
});

app.get('/api/assets', (req, res) => {
  const owner = (req.query.owner as string) || undefined;
  const assets = owner ? db.assets.filter((a: any) => a.ownership?.owner === owner) : db.assets;
  return res.json({ assets });
});

app.post('/api/mint-credentials', (req, res) => {
  const { students, collectionMint } = req.body || {};
  if (!Array.isArray(students)) return res.status(400).json({ ok: false, error: 'students array required' });

  const results: any[] = [];
  for (const s of students) {
    const assetId = `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const asset = {
      id: assetId,
      interface: 'V1_NFT',
      content: {
        schema: 'https://schema.org/CreativeWork',
        json_uri: s.metadataUri || 'https://example.com/mock.json',
        metadata: {
          name: `${s.credentialName || 'Credential'} - ${s.name}`,
          symbol: 'ECERT-APEC',
          description: `Credential issued to ${s.name}`,
          attributes: [
            { trait_type: 'Student_ID_Internal', value: s.internalId || 'N/A' },
            { trait_type: 'Credential_Type', value: s.credentialType || 'Dual_Degree_Module' },
            { trait_type: 'Skill_Business', value: s.skillBusiness || 'N/A' },
            { trait_type: 'Skill_Tech', value: s.skillTech || 'N/A' },
            { trait_type: 'Issuer_Name', value: (db.issuer?.name || 'APEC University') },
            { trait_type: 'Issuer_Address', value: (db.issuer?.authority || 'APEC-UNIV-AUTH') }
          ]
        }
      },
      authorities: [ { address: (db.issuer?.authority || 'APEC-UNIV-AUTH'), scopes: ['full'] } ],
      compression: {
        eligible: true,
        compressed: true,
        data_hash: `hash-data-${assetId}`,
        creator_hash: `hash-creator-${assetId}`,
        asset_hash: `hash-asset-${assetId}`,
        tree: 'tree-demo-1',
        seq: 1,
        leaf_id: 0
      },
      ownership: {
        frozen: false,
        delegated: false,
        ownership_model: 'token',
        owner: s.wallet
      },
      mutable: true,
      burnt: false
    };
    const proof = {
      root: 'mock-root-abc',
      proof: ['mock-sibling-1', 'mock-sibling-2'],
      node_index: 0,
      leaf: assetId,
      tree_id: 'tree-demo-1'
    };
    db.assets.push(asset);
    db.proofs.push(proof);
    results.push({ success: true, assetId });
  }
  saveDb();
  return res.json({ ok: true, results });
});

const PORT = process.env.MOCK_PORT ? Number(process.env.MOCK_PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Mock DAS server running at http://localhost:${PORT}`);
});

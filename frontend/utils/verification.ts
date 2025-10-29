export interface MerkleProof {
  root: string;
  proof: string[];
  node_index: number;
  leaf: string;
  tree_id: string;
}

export interface AssetData {
  id: string;
  owner: string;
  metadata: any;
}

// Simple Merkle Tree implementation for verification
export class MerkleTree {
  private leaves: string[] = [];
  private tree: string[][] = [];

  constructor(leaves: string[]) {
    this.leaves = leaves.map(leaf => this.hash(leaf));
    this.buildTree();
  }

  private hash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16).padStart(8, '0');
  }

  private buildTree(): void {
    this.tree = [this.leaves];
    let currentLevel = this.leaves;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;
        nextLevel.push(this.hash(left + right));
      }
      this.tree.push(nextLevel);
      currentLevel = nextLevel;
    }
  }

  getRoot(): string {
    return this.tree[this.tree.length - 1][0];
  }

  verifyProof(leaf: string, proof: string[], root: string, index: number): boolean {
    let currentHash = this.hash(leaf);
    let currentIndex = index;
    for (let i = 0; i < proof.length; i++) {
      const sibling = proof[i];
      if (currentIndex % 2 === 0) currentHash = this.hash(currentHash + sibling);
      else currentHash = this.hash(sibling + currentHash);
      currentIndex = Math.floor(currentIndex / 2);
    }
    return currentHash === root;
  }
}

// Verify credential against on-chain data (MVP with mock support)
export async function verifyCredentialOnChain(
  assetId: string,
  connection: any
): Promise<{
  isValid: boolean;
  credential?: any;
  error?: string;
}> {
  try {
    const { getAsset } = await import('./helius');
    const asset = await getAsset(assetId);

    // For demo: if we can fetch the asset at all, consider it valid
    if (asset && asset.id) {
      const metadata = asset.content?.metadata;
      const attrs = metadata?.attributes || [];
      const getAttr = (k: string) => attrs.find((a: any) => a.trait_type === k)?.value;
      return {
        isValid: true,
        credential: {
          id: assetId,
          name: metadata?.name || 'Credential',
          student_name: getAttr('Student_Name') || 'Student Name',
          issuer_name: getAttr('Issuer_Name') || 'APEC University',
          issued_date: new Date().toISOString().split('T')[0],
          type: getAttr('Credential_Type') || 'Credential',
          skill_business: getAttr('Skill_Business') || 'N/A',
          skill_tech: getAttr('Skill_Tech') || 'N/A',
        }
      }
    }

    return { isValid: false, error: 'Asset not found' };
  } catch (error) {
    console.error('Error verifying credential on-chain:', error);
    return { isValid: false, error: error instanceof Error ? error.message : 'Verification failed' };
  }
}

export function generateVerificationUrl(assetId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/verify?asset_id=${assetId}`;
}

export function parseAssetIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('asset_id');
  } catch (error) {
    console.error('Error parsing asset ID from URL:', error);
    return null;
  }
}

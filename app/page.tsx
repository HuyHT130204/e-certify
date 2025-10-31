"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Avvvatars from 'avvvatars-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Shell from './components/Shell';
import WalletBar from './components/WalletBar';
import DashboardBanner from './components/DashboardBanner';
import SkillsPassport from './components/SkillsPassport';
import VerificationPage from './components/VerificationPage';

// Mega single-page application that hosts all flows: Dashboard, Passport, Admin, Verify.
// It reads the `view` query param and renders the corresponding section.

export default function Home() {
  const sp = useSearchParams();
  const view = useMemo(() => sp.get('view') || 'explore', [sp]);
  return (
    <Shell title="Your Personal Learning" subtitle="Based on your preferences" headerRight={<WalletBar />}>
      <ViewSwitcher view={view} />
    </Shell>
  );
}

function ViewSwitcher({ view }: { view: string }) {
  if (view === 'passport') return <PassportSection />;
  if (view === 'admin') return <AdminSection />;
  if (view === 'verify') return <VerifySection />;
  return <DashboardSection />;
}

// 1) Dashboard Section (rich UI with multiple widgets and animation)
function DashboardSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
      <div className="xl:col-span-3 space-y-4">
        <DashboardBanner />
        <GoalGrid />
        <ContinueWatching />
        <Achievements />
        <OnChainCredentialsCard />
        <ActivityFeed />
      </div>
      <div className="xl:col-span-2 space-y-4">
        <QuickActions />
        <TutorsList />
        <CourseFilters />
      </div>
    </div>
  );
}

// Sub-widgets used in Dashboard
function GoalGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card animate-fade-in">
          <div className="font-semibold mb-1">Goals</div>
          <div className="opacity-70 text-sm">Manage Goals</div>
          <div className="mt-3 h-2 rounded-full bg-[#ede9fe] pulse-soft">
            <div className="h-2 rounded-full" style={{ width: `${60 + i * 5}%`, background: 'var(--color-primary)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ContinueWatching() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Continue Watching</div>
        <Link href="#" className="btn-ghost text-sm">View all</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm animate-fade-in">
            <div className="h-[140px] bg-[#1f2937]/90" />
            <div className="p-3">
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-[#ede9fe] text-primary inline-block mb-2">FRONTEND</div>
              <div className="font-medium text-sm">Beginner's Guide To Becoming A Professional Frontend Developer</div>
              <div className="flex items-center gap-2 mt-3 opacity-70 text-xs">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Avvvatars value={`course-${i}`} size={24} />
                </div>
                <div>
                  <div>Prashant Kumar Singh</div>
                  <div>Software Developer</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Achievements() {
  return (
    <div className="card">
      <div className="font-semibold mb-2">Achievements</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-fade-in" style={{ background: '#f3f4f6' }}>
            <div className="text-2xl font-bold">{10 * i}%</div>
            <div className="opacity-70 text-sm">Completion</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OnChainCredentialsCard() {
  return (
    <div className="card">
      <div className="font-semibold mb-2">On-chain Credentials</div>
      <SkillsPassport ownerBase58={process.env.NEXT_PUBLIC_DEMO_OWNER || ''} />
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="card">
      <div className="font-semibold mb-2">Activity Feed</div>
      <div className="space-y-2">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Avvvatars value={`activity-${idx}`} size={32} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Completed lesson {idx + 1}</div>
              <div className="opacity-70 text-xs">2h ago</div>
            </div>
            <div className="text-xs btn-ghost">View</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const router = useRouter();
  return (
    <div className="card">
      <div className="font-semibold mb-2">Quick Actions</div>
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => router.push('/?view=passport')}>Open Skills Passport</button>
        <button className="btn-ghost" onClick={() => router.push('/?view=admin')}>Admin – Batch Issuance</button>
        <button className="btn-ghost" onClick={() => router.push('/?view=verify')}>Verifier – Paste asset_id</button>
      </div>
    </div>
  );
}

function TutorsList() {
  return (
    <div className="card">
      <div className="font-semibold mb-2">My Tutors</div>
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Avvvatars value={`tutor-${i}`} size={32} />
              </div>
              <div>
                <div className="font-medium text-sm">Tutor {i + 1}</div>
                <div className="opacity-70 text-xs">Senior Instructor</div>
              </div>
            </div>
            <button className="btn-ghost">Message</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseFilters() {
  return (
    <div className="card">
      <div className="font-semibold mb-2">New Courses</div>
      <div className="grid grid-cols-2 gap-3">
        <select className="h-10 rounded-xl px-3 bg-white/90 ring-1 ring-black/5 outline-none">
          <option>Price</option>
          <option>Free</option>
          <option>Paid</option>
        </select>
        <select className="h-10 rounded-xl px-3 bg-white/90 ring-1 ring-black/5 outline-none">
          <option>Duration</option>
          <option>Short</option>
          <option>Medium</option>
          <option>Long</option>
        </select>
      </div>
    </div>
  );
}

// 2) Passport Section (reuses SkillsPassport, adds header and stats panels)
function PassportSection() {
  const [owner, setOwner] = useState<string>(process.env.NEXT_PUBLIC_DEMO_OWNER || '');
  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="font-semibold">Skills Passport</div>
          <div className="opacity-70 text-sm">All cNFT credentials you own</div>
        </div>
        <WalletBar onConnected={setOwner} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 space-y-4">
          <div className="card">
            <SkillsPassport ownerBase58={owner} />
          </div>
        </div>
        <div className="xl:col-span-2 space-y-4">
          <div className="card">
            <div className="font-semibold mb-2">Share</div>
            <div className="opacity-70 text-sm">Share your public profile URL or QR</div>
          </div>
          <div className="card">
            <div className="font-semibold mb-2">Tips</div>
            <ul className="list-disc pl-5 opacity-80 text-sm">
              <li>Attach your profile URL to LinkedIn</li>
              <li>Use QR in resumes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3) Admin Section (Batch Issuance)
type CsvRow = { student_email: string; student_name: string; major: string; issue_date: string };
function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift()?.split(',').map((s) => s.trim().toLowerCase()) || [];
  const idx = (k: string) => header.indexOf(k);
  return lines.map((line) => {
    const cols = line.split(',');
    return {
      student_email: cols[idx('student_email')]?.trim() || '',
      student_name: cols[idx('student_name')]?.trim() || '',
      major: cols[idx('major')]?.trim() || '',
      issue_date: cols[idx('issue_date')]?.trim() || '',
    };
  });
}

function AdminSection() {
  const [csvText, setCsvText] = useState<string>('student_email,student_name,major,issue_date\nnguyen.a@apec.edu.vn,Nguyen Van A,Entrepreneurship,2025-10-20');
  const rows = useMemo(() => parseCsv(csvText), [csvText]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; count?: number; results?: { student_email: string; tx: string }[]; error?: string } | null>(null);
  const [collection, setCollection] = useState<string>(process.env.NEXT_PUBLIC_APEC_COLLECTION || '');
  const [tree, setTree] = useState<string>(process.env.MERKLE_TREE || '');

  const submit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionMint: collection, merkleTree: tree, rows }),
      });
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setResult({ error: e?.message || 'Request failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="font-semibold mb-2">Step 0 – Configuration</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-10 rounded-xl px-3 bg-white/90 ring-1 ring-black/5 outline-none" placeholder="Collection Mint" value={collection} onChange={(e) => setCollection(e.target.value)} />
          <input className="h-10 rounded-xl px-3 bg-white/90 ring-1 ring-black/5 outline-none" placeholder="Merkle Tree" value={tree} onChange={(e) => setTree(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Step 1 – Upload CSV</div>
        <textarea className="w-full h-40 rounded-lg p-3 bg-white/90 ring-1 ring-black/5 outline-none" value={csvText} onChange={(e) => setCsvText(e.target.value)} />
        <div className="text-xs opacity-70 mt-2">Columns required: student_email, student_name, major, issue_date</div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Step 2 – Preview ({rows.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-70">
                <th className="py-2">Student Email</th>
                <th className="py-2">Name</th>
                <th className="py-2">Major</th>
                <th className="py-2">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="py-2 pr-3">{r.student_email}</td>
                  <td className="py-2 pr-3">{r.student_name}</td>
                  <td className="py-2 pr-3">{r.major}</td>
                  <td className="py-2 pr-3">{r.issue_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="opacity-70 text-sm">Estimated cost: ~0.02 SOL</div>
        <button className="btn-primary" onClick={submit} disabled={submitting}>{submitting ? 'Minting…' : 'Mint Batch'}</button>
      </div>

      {result && (
        <div className="card">
          <div className="font-semibold mb-2">Result</div>
          {result.error ? (
            <div className="text-red-600 text-sm">{result.error}</div>
          ) : (
            <div className="text-sm">
              <div>Success: {String(result.ok)}</div>
              <div>Count: {result.count}</div>
              <div className="mt-2 space-y-1">
                {result.results?.map((r) => (
                  <div key={r.student_email} className="opacity-80">{r.student_email} → {r.tx}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 4) Verify Section
function VerifySection() {
  const router = useRouter();
  const sp = useSearchParams();
  const assetId = useMemo(() => sp.get('asset_id') || '', [sp]);
  const [input, setInput] = useState<string>(assetId);

  const go = () => {
    const id = (input || '').trim();
    if (!id) return;
    router.push(`/?view=verify&asset_id=${encodeURIComponent(id)}`);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="font-semibold mb-2">Verifier</div>
        <div className="flex items-center gap-2">
          <input className="w-full h-10 rounded-xl px-3 bg-white/90 ring-1 ring-black/5 outline-none" placeholder="Paste asset_id here" value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="btn-primary" onClick={go}>Verify</button>
        </div>
      </div>
      {assetId ? (
        <VerificationPage assetId={assetId} />
      ) : (
        <div className="card">Provide an asset_id in the URL query.</div>
      )}
    </div>
  );
}


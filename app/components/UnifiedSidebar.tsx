"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/?view=explore', label: 'Explore', icon: '🧭' },
  { href: '/?view=passport', label: 'Dashboard', icon: '📊' },
  { href: '/?view=admin', label: 'My Settings', icon: '⚙️' },
  { href: '/?view=verify', label: 'Course Calendar', icon: '📅' },
];

export default function UnifiedSidebar() {
  const pathname = usePathname();
  return (
    <aside className="space-y-3">
      <div className="card">
        <div className="font-semibold">APEC-Credify</div>
        <div className="opacity-70 text-sm">Improved Learning</div>
      </div>
      <nav className="card">
        <div className="space-y-2">
          {nav.map((n) => {
            const active = typeof window !== 'undefined' ? window.location.search.includes(n.href.split('view=')[1]) : false;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={active ? 'bg-primary text-white rounded-xl px-3 py-2 flex items-center gap-3' : 'btn-ghost px-3 py-2 flex items-center gap-3'}
              >
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: active ? 'rgba(255,255,255,0.18)' : '#f3f4f6'
                }}>{n.icon}</span>
                <span style={{ fontWeight: 600 }}>{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dbeafe', display: 'grid', placeItems: 'center' }}>🚀</div>
        <div style={{ fontSize: 14 }}>
          <div className="font-semibold">Upgrade to Pro</div>
          <div className="opacity-70">Get 1 month free</div>
        </div>
      </div>
    </aside>
  );
}



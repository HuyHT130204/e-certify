"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/passport', label: 'Passport' },
  { href: '/admin', label: 'Admin' },
  { href: '/verify', label: 'Verify' },
];

export default function AppTabs() {
  const pathname = usePathname();
  return (
    <div className="card" style={{ padding: 8 }}>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = pathname === t.href || pathname?.startsWith(t.href + '?');
          return (
            <Link key={t.href} href={t.href} className={active ? 'btn-primary' : 'btn-ghost'}>
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}




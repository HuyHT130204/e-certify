"use client";

import React from 'react';
import WalletBar from './WalletBar';
import AvatarRow from './AvatarRow';

export default function UnifiedHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <header className="py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{title}</div>
          {subtitle && <div className="opacity-70 text-sm mt-1">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-3">
          {right}
          {!right && <WalletBar />}
        </div>
      </div>
      <div className="mt-4">
        <AvatarRow
          users={[
            { id: 'mai@example.com', label: 'Mai' },
            { id: 'lam@example.com', label: 'Lam' },
            { id: 'an@example.com', label: 'An' },
            { id: 'linh@example.com', label: 'Linh' },
            { id: 'ha@example.com', label: 'Ha' },
            { id: 'vu@example.com', label: 'Vu' },
            { id: 'nga@example.com', label: 'Nga' },
          ]}
        />
      </div>
    </header>
  );
}



"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AppHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <button className="btn-ghost" onClick={() => router.back()}>Back</button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">{right}</div>
    </div>
  );
}




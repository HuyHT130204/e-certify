"use client";

import React from 'react';

export default function SearchPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5 flex items-center gap-2">
        <input
          className="flex-1 outline-none px-2 h-10"
          placeholder="Search for a course"
        />
        <button className="px-4 h-10 rounded-xl bg-primary text-white">GO</button>
      </div>

      <div className="flex items-center gap-4 px-1">
        <button className="text-sm font-semibold text-[#111827]">New Courses</button>
        <button className="text-sm opacity-70 hover:opacity-100">Library</button>
        <button className="text-sm opacity-70 hover:opacity-100">Categories</button>
      </div>

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

      <div className="space-y-3">
        {[
          { title: 'Master Figma', subtitle: 'Learn Figma in 30 days' },
          { title: 'UI With Mikey', subtitle: 'Learn UI in 30 days' },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl p-4 bg-white ring-1 ring-black/5 animate-fade-in">
            <div className="text-xs opacity-70 mb-1">42 Hours • $199.00</div>
            <div className="font-semibold">{c.title}</div>
            <div className="opacity-70 text-sm">{c.subtitle}</div>
            <div className="mt-3">
              <button className="text-sm px-3 py-1 rounded-lg bg-primary text-white">Enroll Today!</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



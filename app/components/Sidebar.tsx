"use client";

import React from 'react';
import Avatar from './Avatar';

export default function Sidebar() {
  return (
    <aside className="w-[240px] p-0 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary" />
        <div className="font-extrabold tracking-wide">COURSE</div>
      </div>

      <nav className="flex flex-col gap-2">
        {['Dashboard', 'Inbox', 'Lesson', 'Task', 'Group'].map((item) => (
          <div key={item} className={`px-3 py-2 rounded-xl transition ${item === 'Dashboard' ? 'bg-panel shadow-sm font-medium' : 'hover:bg-panel/60'}`}>
            {item}
          </div>
        ))}
      </nav>

      <div className="mt-2 text-xs opacity-70">FRIENDS</div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Avatar seed={`Friend-${i}`} size={32} />
            <div>
              <div className="text-sm">Prashant</div>
              <div className="text-xs opacity-70">Software Developer</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="px-3 py-2 rounded-xl hover:bg-panel/60">Settings</div>
        <div className="px-3 py-2 rounded-xl text-[#ff5a5a] hover:bg-[#3a2a2a]/40">Logout</div>
      </div>
    </aside>
  );
}



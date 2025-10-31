"use client";

import React from 'react';
import Avatar from './Avatar';

export default function UserPanel() {
  return (
    <aside className="w-[320px] p-4 flex flex-col gap-4">
      <div className="card items-center text-center gap-2">
        <Avatar seed="Prashant" size={72} />
        <div className="font-bold">Good Morning Prashant</div>
        <div className="opacity-70 text-xs">Continue Your Journey And Achieve Your Target</div>
      </div>

      <div className="card">
        <div className="flex gap-2 items-end h-[120px]">
          {[24, 48, 32, 72, 44].map((h, i) => (
            <div key={i} className="w-6 bg-primary/90 rounded-md" style={{ height: h }} />
          ))}
        </div>
      </div>

      <div>
        <div className="font-bold mb-2">Your Mentor</div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar seed={`Mentor-${i}`} size={32} />
                <div>
                  <div className="text-sm">Prashant Kumar Singh</div>
                  <div className="text-xs opacity-70">Software Developer</div>
                </div>
              </div>
              <button className="btn-ghost hover:opacity-90">Follow</button>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full mt-3 hover:opacity-90">See All</button>
      </div>
    </aside>
  );
}



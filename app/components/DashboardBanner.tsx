"use client";

import React from 'react';

export default function DashboardBanner() {
  return (
    <div className="rounded-[18px] p-5 text-white bg-linear-to-r from-primary to-[#7c5dff] shadow-md">
      <div className="text-xs opacity-90 mb-2">ONLINE COURSE</div>
      <div className="font-extrabold text-2xl leading-tight max-w-[640px]">
        Sharpen Your Skills With Professional Online Courses
      </div>
      <div className="mt-3">
        <button className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90">Join Now</button>
      </div>
    </div>
  );
}



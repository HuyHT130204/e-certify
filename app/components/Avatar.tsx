"use client";

import React from 'react';
import Avvvatars from 'avvvatars-react';

export default function Avatar({ seed, size = 32, className = "" }: { seed: string; size?: number; className?: string }) {
  return (
    <div className={className}>
      <Avvvatars 
        value={seed} 
        size={size} 
        style="shape" 
        shadow={true} 
        radius={8}
      />
    </div>
  );
}




"use client";

import React from 'react';

export default function Avatar({ seed, size = 32, className = "" }: { seed: string; size?: number; className?: string }) {
  const url = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundType=gradientLinear&shapeColor=6c4cff`;
  return (
    <img
      src={url}
      alt={seed}
      width={size}
      height={size}
      className={className + " rounded-full"}
      loading="lazy"
    />
  );
}




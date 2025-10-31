"use client";

import React from 'react';
import Avvvatars from 'avvvatars-react';

type AvatarRowProps = {
  users: { id: string; label?: string }[];
  size?: number;
  overlap?: number;
};

export default function AvatarRow({ users, size = 36, overlap = 12 }: AvatarRowProps) {
  return (
    <div className="flex items-center">
      {users.map((u, idx) => (
        <div
          key={u.id}
          className="rounded-full ring-2 ring-white"
          style={{
            width: size,
            height: size,
            marginLeft: idx === 0 ? 0 : -overlap,
            background: 'white',
          }}
          title={u.label || u.id}
        >
          <Avvvatars value={u.id} size={size} style={{ borderRadius: '9999px' }} />
        </div>
      ))}
    </div>
  );
}




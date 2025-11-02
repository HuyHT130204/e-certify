"use client";

import Avvvatars from "avvvatars-react";

export function UserAvatar({ value, size = 36 }: { value: string; size?: number }) {
  return (
    <div className="inline-block" style={{ display: 'inline-block' }}>
      <Avvvatars 
        value={value || "user"} 
        size={size} 
        style="shape" 
        shadow={true} 
        radius={8}
      />
    </div>
  );
}





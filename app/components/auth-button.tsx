"use client";

import { useCallback, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";

export default function AuthButton({ userEmail }: { userEmail?: string | null }) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  }, [supabase]);

  if (!userEmail) {
    return <Button variant="ghost" onClick={() => (window.location.href = "/login")}>Log in</Button>;
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground truncate">{userEmail}</span>
      <Button variant="ghost" onClick={handleLogout} disabled={loading}>Log out</Button>
    </div>
  );
}





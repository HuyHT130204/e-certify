"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Wait a bit for cookies to be set after redirect
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Auth check error:', error);
          setChecking(false);
          if (error.message.includes('session')) {
            // Session error, redirect to login
            router.replace("/login");
          }
          return;
        }

        if (!session) {
          // No session found, redirect to login
          router.replace("/login");
          return;
        }
        
        // Session exists, allow access
        setReady(true);
        setChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        if (mounted) {
          setChecking(false);
          router.replace("/login");
        }
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setReady(true);
        setChecking(false);
      } else if (event === 'SIGNED_OUT') {
        setReady(false);
        router.replace("/login");
      } else if (!session && ready) {
        // Only redirect if we were previously authenticated
        setReady(false);
        router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase, ready]);

  // Show loading state while checking
  if (checking || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


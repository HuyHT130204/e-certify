import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!url || !anonKey) {
    throw new Error("Supabase client env not configured");
  }
  
  // Use createBrowserClient from @supabase/ssr for proper cookie handling
  return createBrowserClient(url, anonKey);
};




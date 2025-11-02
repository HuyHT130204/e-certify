import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const createClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!url || !anonKey) {
    throw new Error("Supabase server env not configured");
  }
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        try { cookieStore.set(name, value, options); } catch {}
      },
      remove: (name: string, options: any) => {
        try { cookieStore.set(name, "", { ...options, maxAge: 0 }); } catch {}
      },
    },
  });
};



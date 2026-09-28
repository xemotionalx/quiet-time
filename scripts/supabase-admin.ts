import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../src/lib/database.types";

export type SupabaseAdmin = SupabaseClient<Database>;

export function createSupabaseAdmin(): SupabaseAdmin {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. Check .env.local.",
    );
  }

  return createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

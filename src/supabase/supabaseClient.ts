import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase URL або API ключ не завантажені!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

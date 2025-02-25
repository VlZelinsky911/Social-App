import { createClient, SupabaseClient  } from "@supabase/supabase-js";

export const supabaseUrl: string = "https://tvcikevghrhzdnbqieto.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2lrZXZnaHJoemRuYnFpZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzgyMDEsImV4cCI6MjA1NTkxNDIwMX0.NqNJ9aSVR4cDJHLm7qbJSJ9xthowtnqClaD8wIrBm3s"; // Вставте свій ключ

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

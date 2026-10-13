import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Melakukan sign-in Google OAuth khusus domain @smktelkom-mlg.sch.id
 * Menggunakan parameter hd (hosted domain) untuk membatasi akun Google Workspace
 */
export async function signInWithGoogleTelkom() {
  if (!supabase) {
    return {
      data: null,
      error: new Error(
        "Kredensial Supabase belum diatur di file .env.local (NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY)"
      ),
    };
  }

  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "";

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        hd: "smktelkom-mlg.sch.id", // Restriksi resmi Google Hosted Domain SMK Telkom Malang
        prompt: "select_account",
      },
    },
  });
}

export async function signOutSupabase() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase sign out error:", err);
    }
  }
}

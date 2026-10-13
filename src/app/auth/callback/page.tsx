"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { ShieldAlert, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { User } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login, logout } = usePortoGuru();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      if (!supabase) {
        setStatus("error");
        setErrorMessage("Konfigurasi Supabase belum aktif di file .env.local.");
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session?.user) {
          // If no session found immediately, listen to onAuthStateChange
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (session?.user && isMounted) {
                authListener.subscription.unsubscribe();
                await processUser(session.user);
              }
            }
          );

          // Timeout fallback if no session received within 6 seconds
          setTimeout(() => {
            if (isMounted && status === "loading") {
              setStatus("error");
              setErrorMessage("Gagal memverifikasi sesi login Google. Silakan coba kembali.");
            }
          }, 6000);
          return;
        }

        await processUser(data.session.user);
      } catch (err: unknown) {
        if (isMounted) {
          setStatus("error");
          const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses login Google.";
          setErrorMessage(msg);
        }
      }
    }

    async function processUser(user: User) {
      const email = user.email ? user.email.toLowerCase().trim() : "";
      setUserEmail(email);

      // Verifikasi restriksi domain resmi @smktelkom-mlg.sch.id
      if (!email.endsWith("@smktelkom-mlg.sch.id")) {
        // Sign out dari Supabase karena domain tidak diizinkan
        if (supabase) await supabase.auth.signOut();
        logout();
        setStatus("error");
        setErrorMessage(
          `Domain akun Google (${email}) tidak diizinkan. Sistem hanya mengizinkan akun resmi Google Workspace @smktelkom-mlg.sch.id.`
        );
        return;
      }

      // Ambil nama dari user_metadata Google jika tersedia
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        undefined;

      // Login ke context sistem aplikasi
      const res = login(email, fullName);
      if (res.success) {
        setStatus("success");
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      } else {
        setStatus("error");
        setErrorMessage(res.message);
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [login, logout, router, status]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100 text-center">
        {status === "loading" && (
          <div className="py-6 space-y-4">
            <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
              Memverifikasi Akun Google...
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Memeriksa autentikasi domain resmi <strong>@smktelkom-mlg.sch.id</strong> melalui Supabase.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="py-6 space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Autentikasi Berhasil!
            </h3>
            <p className="text-xs text-slate-600 font-mono">
              {userEmail}
            </p>
            <p className="text-xs text-emerald-700 font-medium">
              Mengarahkan Anda ke Portal PortoGuru...
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Buka Dashboard Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Akses Ditolak
            </h3>
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3.5 rounded-2xl leading-relaxed">
              {errorMessage}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Kembali ke Beranda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

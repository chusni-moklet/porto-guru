"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Loader2,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  FileBadge,
  BookOpen,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { signInWithGoogleTelkom, isSupabaseConfigured } from "@/lib/supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccessLogin,
}: LoginModalProps) {
  const {
    login,
    quickLoginAsAdmin,
    quickLoginAsGuruBudi,
    quickLoginAsGuruFauzanPending,
    quickLoginAsAdminScope,
  } = usePortoGuru();

  const [emailInput, setEmailInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  if (!isOpen) return null;

  // Handle Google OAuth Login via Supabase
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage(
        "Kredensial Supabase belum diatur di file .env.local. Silakan masukkan NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY Anda, atau gunakan akses cepat akun terintegrasi di bawah."
      );
      return;
    }

    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogleTelkom();
      if (error) {
        setIsGoogleLoading(false);
        setErrorMessage(
          error.message || "Gagal menghubungkan ke layanan Google OAuth."
        );
      }
      // If successful, browser will be redirected to Google OAuth page
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memulai Google OAuth.";
      setErrorMessage(msg);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!emailInput.trim()) {
      setErrorMessage("Silakan masukkan alamat email.");
      return;
    }

    const res = login(emailInput);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
        if (onSuccessLogin) onSuccessLogin();
      }, 700);
    }
  };

  const handleQuick = (loginFn: () => void) => {
    setErrorMessage("");
    setSuccessMessage("");
    loginFn();
    setSuccessMessage("Berhasil masuk!");
    setTimeout(() => {
      onClose();
      if (onSuccessLogin) onSuccessLogin();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Bersih Sesuai Desain Mockup User */}
        <div className="pt-8 px-7 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Khusus Domain @smktelkom-mlg.sch.id</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back. Sign in to continue.
          </p>
        </div>

        <div className="px-7 pb-7">
          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Primary Action: Tombol Google Auth (Persis Mockup Gambar User) */}
          <div className="mt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-700/80 hover:border-slate-900 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-150 shadow-xs hover:shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  {/* Google "G" Logo Resmi Multi-Color */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-slate-800 group-hover:text-black">
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 justify-center mt-2 text-[11px] text-slate-500">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Otomatis membatasi login akun Google Workspace sekolah</span>
            </div>
          </div>

          {/* Status Integrasi Supabase */}
          {!isSupabaseConfigured && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <div className="font-bold flex items-center gap-1 mb-0.5 text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Supabase Ready (.env.local)</span>
              </div>
              Project Supabase Anda sudah terhubung. Masukkan{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              &{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              ke file <strong>.env.local</strong>.
            </div>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">
                atau pilih akses akun terintegrasi
              </span>
            </div>
          </div>

          {/* Akun Admin & Demo Guru Terintegrasi */}
          <div className="space-y-2">
            {/* Akun Admin Utama Chusni (Prioritas Utama User) */}
            <button
              type="button"
              onClick={() => handleQuick(quickLoginAsAdmin)}
              className="w-full p-3 rounded-2xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 transition-all text-left flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-950">
                      M. Chusni Agus, M. Pd.
                    </span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      Super Admin
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-mono block">
                    chusni@smktelkom-mlg.sch.id
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Sub-Admin Verifikator Per Bidang (Prestasi, Sertifikasi, Karya) */}
            <div className="pt-1 pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
                Admin Verifikator Spesifik Bidang:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {/* 1. Admin Prestasi */}
                <button
                  type="button"
                  onClick={() => handleQuick(() => quickLoginAsAdminScope("prestasi"))}
                  className="p-2 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/90 text-left transition-all cursor-pointer group shadow-2xs"
                  title="Masuk sebagai Admin Verifikator Prestasi (Dra. Siti Aminah)"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-md bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                      <Award className="w-3 h-3 text-amber-700" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-900 truncate">
                      Verif. Prestasi
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 block truncate font-medium">
                    Dra. Siti Aminah
                  </span>
                </button>

                {/* 2. Admin Sertifikasi */}
                <button
                  type="button"
                  onClick={() => handleQuick(() => quickLoginAsAdminScope("sertifikasi"))}
                  className="p-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/90 text-left transition-all cursor-pointer group shadow-2xs"
                  title="Masuk sebagai Admin Verifikator Sertifikasi (Ir. Bambang Trihatmodjo)"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-md bg-blue-200 text-blue-800 flex items-center justify-center shrink-0">
                      <FileBadge className="w-3 h-3 text-blue-700" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-900 truncate">
                      Verif. Sertifikasi
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-800 block truncate font-medium">
                    Ir. Bambang Tri
                  </span>
                </button>

                {/* 3. Admin Karya */}
                <button
                  type="button"
                  onClick={() => handleQuick(() => quickLoginAsAdminScope("karya"))}
                  className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/90 text-left transition-all cursor-pointer group shadow-2xs"
                  title="Masuk sebagai Admin Verifikator Karya & Modul (Achmad Fauzi, M.Pd)"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-md bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3 h-3 text-emerald-700" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-900 truncate">
                      Verif. Karya
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800 block truncate font-medium">
                    Achmad Fauzi, M.Pd
                  </span>
                </button>
              </div>
            </div>

            {/* Akun Guru Terverifikasi (Budi Santoso) */}
            <button
              type="button"
              onClick={() => handleQuick(quickLoginAsGuruBudi)}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 transition-colors text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Budi Santoso, S.Kom. (Pendidik RPL)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    budi_santoso@smktelkom-mlg.sch.id
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Guru
              </span>
            </button>

            {/* Akun Guru Pending (Fauzan Akbar) */}
            <button
              type="button"
              onClick={() => handleQuick(quickLoginAsGuruFauzanPending)}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Fauzan Akbar, S.T. (Status Pending)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    fauzan_akbar@smktelkom-mlg.sch.id
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Pending
              </span>
            </button>
          </div>

          {/* Toggle Form Login Manual (Opsional) */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowManualForm(!showManualForm)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 mx-auto cursor-pointer"
            >
              <span>Atau masukkan email sekolah lainnya</span>
              {showManualForm ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showManualForm && (
              <form onSubmit={handleManualLogin} className="mt-3 space-y-3 animate-in fade-in duration-150">
                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="nama_guru@smktelkom-mlg.sch.id"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    defaultValue="smktelkommlg123"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Masuk dengan Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

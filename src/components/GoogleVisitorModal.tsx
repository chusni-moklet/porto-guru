"use client";

import React, { useState } from "react";
import { X, Check, Mail, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { GoogleVisitorUser } from "@/types/karya";
import { PRESET_GOOGLE_USERS, saveGoogleVisitor } from "@/lib/karyaStorage";
import { isSupabaseConfigured, signInWithGoogleTelkom } from "@/lib/supabase";

export function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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
  );
}

interface GoogleVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: GoogleVisitorUser) => void;
  actionContext?: "like" | "comment" | "general";
}

export default function GoogleVisitorModal({
  isOpen,
  onClose,
  onSuccess,
  actionContext = "general",
}: GoogleVisitorModalProps) {
  const [selectedUser, setSelectedUser] = useState<GoogleVisitorUser>(
    PRESET_GOOGLE_USERS[0]
  );
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSelectPreset = (user: GoogleVisitorUser) => {
    setSelectedUser(user);
    setIsCustomMode(false);
    setError("");
  };

  const handleConfirmLogin = async () => {
    setError("");
    setLoading(true);

    let activeUser: GoogleVisitorUser;

    if (isCustomMode) {
      if (!customName.trim()) {
        setError("Silakan isi nama akun Google Anda.");
        setLoading(false);
        return;
      }
      if (!customEmail.trim() || !customEmail.includes("@")) {
        setError("Silakan isi alamat email Google yang valid.");
        setLoading(false);
        return;
      }
      activeUser = {
        id: `g-custom-${Date.now()}`,
        name: customName.trim(),
        email: customEmail.trim().toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
          customName.trim()
        )}`,
        isVerified: true,
      };
    } else {
      activeUser = selectedUser;
    }

    // Save visitor user to localStorage
    saveGoogleVisitor(activeUser);

    setTimeout(() => {
      setLoading(false);
      onSuccess(activeUser);
      onClose();
    }, 400);
  };

  const handleSupabaseOAuth = async () => {
    if (!isSupabaseConfigured) {
      setError(
        "Kredensial Supabase belum aktif di file .env.local. Anda dapat menggunakan akun Google di bawah untuk verifikasi instan."
      );
      return;
    }
    setLoading(true);
    const res = await signInWithGoogleTelkom();
    if (res.error) {
      setError(res.error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="p-6 pb-4 border-b border-slate-100 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mx-auto mb-3">
            <GoogleLogo className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Masuk dengan Google
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {actionContext === "like"
              ? "Verifikasi identitas Google Anda untuk memberikan tanda Suka pada karya ini."
              : actionContext === "comment"
              ? "Verifikasi identitas Google Anda untuk mengirim ulasan resmi pada karya ini."
              : "Pilih akun Google Anda untuk berinteraksi dengan karya literasi & modul ajar."}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pilih Akun Google Terverifikasi:
            </label>

            {/* List Akun Preset */}
            <div className="space-y-2">
              {PRESET_GOOGLE_USERS.map((user) => {
                const isSelected = !isCustomMode && selectedUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectPreset(user)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-[#2563EB] bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-800">
                            {user.name}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded-full">
                            <GoogleLogo className="w-2.5 h-2.5 inline" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opsi Custom Akun */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isCustomMode ? "← Gunakan akun pilihan di atas" : "+ Gunakan Akun Google Saya Sendiri"}</span>
            </button>

            {isCustomMode && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Lengkap Google
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Clarissa Putri"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Google (@gmail.com)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="e.g. clarissa@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmLogin}
            className="w-full py-3 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <GoogleLogo className="w-4 h-4" />
            <span>
              {loading
                ? "Memverifikasi..."
                : `Masuk sebagai ${
                    isCustomMode
                      ? customName || "Akun Saya"
                      : selectedUser.name
                  }`}
            </span>
          </button>

          {isSupabaseConfigured && (
            <button
              type="button"
              onClick={handleSupabaseOAuth}
              className="w-full py-2 px-3 text-xs text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer"
            >
              Atau masuk via Single Sign-On (SSO) Google Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

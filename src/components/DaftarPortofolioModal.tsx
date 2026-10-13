"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  CheckCircle2,
  UploadCloud,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface DaftarPortofolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DaftarPortofolioModal({
  isOpen,
  onClose,
}: DaftarPortofolioModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    nuptk: "",
    school: "",
    province: "Jawa Barat",
    level: "SMA / MA",
    subject: "",
    driveLink: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup form"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pendaftaran Pendidik Gratis
          </div>

          <h3 className="text-xl sm:text-2xl font-bold leading-snug">
            Daftarkan Portofolio Guru
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Bergabunglah dalam repositori nasional untuk membagikan modul ajar dan sertifikasi Anda.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#1E293B]">
                Pendaftaran Berhasil Dikirim!
              </h4>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto leading-relaxed">
                Terima kasih, <strong>{formData.name || "Bapak/Ibu Guru"}</strong>. Tim kurator Porto Guru akan memverifikasi NIP dan berkas modul ajar Anda dalam 1-2 hari kerja.
              </p>

              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-all cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahmat Hidayat, S.Pd., Gr."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    Nomor NIP *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor NIP Resmi"
                    value={formData.nuptk}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    Instansi / Asal Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMK Telkom Malang"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    Jenjang Sekolah
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                  >
                    <option>PAUD / TK</option>
                    <option>SD / MI</option>
                    <option>SMP / MTs</option>
                    <option>SMA / MA</option>
                    <option>SMK</option>
                    <option>SLB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    Mata Pelajaran / Bidang *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Biologi / IPA"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Tautan Google Drive / Berkas Modul Ajar *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.driveLink}
                  onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  Pastikan izin akses tautan Google Drive diatur ke &ldquo;Siapa saja yang memiliki tautan dapat melihat&rdquo;.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Ringkasan Praktik Baik & Modul Unggulan
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan metode pembelajaran inovatif atau fokus modul ajar yang Anda unggah..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Kirim Data Portofolio untuk Verifikasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

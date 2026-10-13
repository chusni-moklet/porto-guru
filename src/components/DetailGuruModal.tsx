"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  MapPin,
  BookOpen,
  Award,
  Download,
  Share2,
  Mail,
  ExternalLink,
  Star,
  Check,
} from "lucide-react";

export interface TeacherDetailModalData {
  name: string;
  avatar: string;
  nuptk: string;
  school: string;
  city?: string;
  province: string;
  subject: string;
  rating?: number;
  badges?: string[];
  bio?: string;
  modulesCount?: number;
  experienceYears?: number;
  topModules?: { title: string; downloadUrl: string; pages: string }[];
  certificates?: string[];
}

interface DetailGuruModalProps {
  teacher: TeacherDetailModalData | null;
  onClose: () => void;
}

export default function DetailGuruModal({ teacher, onClose }: DetailGuruModalProps) {
  const [downloadedIdx, setDownloadedIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (teacher) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  const handleDownload = (idx: number) => {
    setDownloadedIdx(idx);
    setTimeout(() => setDownloadedIdx(null), 3000);
  };

  const sampleModules = teacher.topModules || [
    {
      title: "Modul Ajar Kurikulum Merdeka: Pembelajaran Berbasis Proyek (PBL)",
      downloadUrl: "#",
      pages: "24 Halaman • PDF",
    },
    {
      title: "Panduan Asesmen Diagnostik Awal & Lembar Kerja Diferensiasi",
      downloadUrl: "#",
      pages: "18 Halaman • PDF & Docs",
    },
    {
      title: "Media Interaktif & Skenario Praktik Sains Ramah Lingkungan",
      downloadUrl: "#",
      pages: "32 Slide • PPTX & Canva",
    },
  ];

  const sampleCerts = teacher.certificates || [
    "Sertifikat Pendidik Profesional Kemendikbudristek",
    "Google Certified Educator Level 2",
    "Fasilitator Guru Penggerak Nasional",
    "Pelatihan Asesmen Kurikulum Merdeka (64 JP)",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md shrink-0 bg-slate-100">
              <Image
                src={teacher.avatar}
                alt={teacher.name}
                fill
                className="object-cover object-top"
                sizes="80px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  <CheckCircle2 className="w-3 h-3" />
                  NIP Terverifikasi
                </span>
                <span className="text-xs text-blue-100 font-mono">
                  {teacher.nuptk}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
                {teacher.name}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                {teacher.subject} • {teacher.school}
              </p>
              <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {teacher.province}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Bio Singkat */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Tentang & Fokus Pembelajaran
            </h4>
            <p className="text-sm text-[#475569] leading-relaxed">
              {teacher.bio ||
                "Pendidik berdedikasi tinggi yang aktif merancang materi ajar berdiferensiasi dan memfasilitasi komunitas belajar guru di tingkat kabupaten/kota."}
            </p>
          </div>

          {/* Sertifikasi Resmi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#2563EB]" />
              Sertifikasi & Lisensi Resmi Terdata
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleCerts.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modul Ajar Tersedia untuk Diunduh */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#F97316]" />
              Karya Modul Ajar Kurikulum Merdeka (OER)
            </h4>
            <div className="space-y-2.5">
              {sampleModules.map((mod, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors gap-3"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
                      {mod.title}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {mod.pages}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold hover:bg-[#2563EB] hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    {downloadedIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersimpan!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Modul</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Hubungi */}
          <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href="mailto:halo@portoguru.id?subject=Undangan%20Narasumber%20Berbagi%20Praktik%20Baik"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Ajak Berbagi Praktik Baik (Narasumber)</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 text-xs font-semibold text-[#475569] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

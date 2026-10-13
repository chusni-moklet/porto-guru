"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Sparkles,
  Trophy,
  CheckCircle2,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Filter,
} from "lucide-react";

interface HeroProps {
  onOpenDewiProfile: () => void;
  onFilterSubmit: (query: string, provinsi: string, jenjang: string) => void;
}

const PROVINSI_LIST = [
  "Semua Provinsi",
  "D.I. Yogyakarta",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Banten",
  "Bali",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Sumatera Selatan",
  "Lampung",
  "Kalimantan Barat",
  "Kalimantan Timur",
  "Sulawesi Selatan",
  "Sulawesi Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
];

const JENJANG_LIST = [
  "Semua Jenjang",
  "PAUD / TK",
  "SD / MI",
  "SMP / MTs",
  "SMA / MA",
  "SMK",
  "SLB",
];

export default function Hero({ onOpenDewiProfile, onFilterSubmit }: HeroProps) {
  const [keyword, setKeyword] = useState("");
  const [provinsi, setProvinsi] = useState("Semua Provinsi");
  const [jenjang, setJenjang] = useState("Semua Jenjang");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterSubmit(keyword, provinsi, jenjang);
    const galeriEl = document.getElementById("galeri");
    if (galeriEl) {
      galeriEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="beranda"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#EFF6FF]/70 via-[#F8FAFC] to-[#F8FAFC]"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-blue-200/40 via-sky-100/30 to-orange-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Kolom Kiri: Headline & Multi-Parameter Search (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* National Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs font-semibold text-[#1E293B]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
              <span>Repositori Resmi Portofolio Pendidik Nusantara</span>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              <span className="text-[#2563EB] font-bold">Terbuka & Gratis</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1E293B] leading-[1.15] tracking-[-0.02em]">
              Rayakan Karya & Dedikasi{" "}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                Guru Terbaik Indonesia.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#64748B] leading-[1.6] max-w-2xl font-normal">
              Platform direktori dan etalase karya inovatif, modul ajar Kurikulum Merdeka, serta praktik baik dari ribuan guru berprestasi di seluruh 38 provinsi Indonesia.
            </p>

            {/* Interactive Multi-Parameter Search Card */}
            <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(37,99,235,0.08)] mt-2">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Cari nama guru, mata pelajaran, atau topik (mis: Dewi Lestari, Robotika, IPA)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all bg-[#F8FAFC]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={provinsi}
                      onChange={(e) => setProvinsi(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC]"
                    >
                      {PROVINSI_LIST.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Filter className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={jenjang}
                      onChange={(e) => setJenjang(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC]"
                    >
                      {JENJANG_LIST.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span className="font-semibold text-[#1E293B]">Populer:</span>
                    <button
                      type="button"
                      onClick={() => setKeyword("Kurikulum Merdeka")}
                      className="hover:text-[#2563EB] underline"
                    >
                      Kurikulum Merdeka
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setKeyword("STEAM")}
                      className="hover:text-[#2563EB] underline"
                    >
                      STEAM
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setKeyword("Inklusi")}
                      className="hover:text-[#2563EB] underline"
                    >
                      Inklusi
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-xs sm:text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Cari Pendidik</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#64748B] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Verifikasi NIP & Dapodik
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Open Educational Resources (OER)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Kurasi Tim Pendidik Ahli
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Sorotan Pendidik Terverifikasi (Dewi Lestari, M.Pd.) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            {/* Background Soft Glow */}
            <div className="absolute w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full blur-3xl -z-10 transform translate-y-4" />

            {/* Kartu Sorotan Profil Guru Pemenang */}
            <div className="w-full max-w-[420px] bg-white rounded-3xl border-2 border-[#E2E8F0] shadow-[0_16px_40px_rgba(37,99,235,0.12)] p-6 relative group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.16)]">
              {/* Header Badge Sorotan */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Sorotan Pekan Ini (#1 Nasional)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  NIP Terverifikasi
                </span>
              </div>

              {/* Foto Profil & Identitas */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-slate-100">
                <Image
                  src="/dewi-lestari.jpg"
                  alt="Dewi Lestari, M.Pd. - Guru Penggerak Inspiratif"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Badges di Foto */}
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#2563EB] text-white uppercase tracking-wider inline-block mb-1">
                      Guru Penggerak Angkatan 7
                    </span>
                    <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                      Dewi Lestari, M.Pd.
                    </h3>
                    <p className="text-xs text-blue-100 leading-snug">
                      SMA Negeri 1 Yogyakarta • D.I. Yogyakarta
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio Singkat & Tag Spesialisasi */}
              <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                Pelopor modul ajar matematika gamifikasi berbasis AI etis. Telah mengimbaskan praktik baik ke lebih dari 45 sekolah di Jawa dan Sumatera.
              </p>

              {/* Badges Spesialisasi */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                  Kurikulum Merdeka
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F97316] border border-orange-100">
                  Google Certified Level 2
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                  Duta Teknologi
                </span>
              </div>

              {/* Metrik Portofolio Guru */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-5 text-center">
                <div>
                  <p className="text-lg font-extrabold text-[#1E293B]">48 Modul</p>
                  <p className="text-[11px] text-[#64748B]">Ajar Terbit & Diunduh</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#2563EB]">980+ Guru</p>
                  <p className="text-[11px] text-[#64748B]">Telah Terinspirasi</p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <button
                onClick={onOpenDewiProfile}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#2563EB] text-white text-xs sm:text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <span>Lihat Portofolio Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  ShieldCheck,
  Sparkles,
  Filter,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { GuruProfile } from "@/types/porto-guru";

interface DaftarGuruTableProps {
  onSelectGuru: (guru: GuruProfile) => void;
  onOpenAdminPanel?: () => void;
  onOpenGuruDashboard?: () => void;
}

export default function DaftarGuruTable({
  onSelectGuru,
  onOpenAdminPanel,
  onOpenGuruDashboard,
}: DaftarGuruTableProps) {
  const { guruProfiles, approvedGuruProfiles, pendingGuruProfiles, isAdmin, currentUser } =
    usePortoGuru();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState<string>("Semua");
  const [selectedSpesialisasi, setSelectedSpesialisasi] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("approved"); // default to approved
  const [sortBy, setSortBy] = useState<string>("nama-asc");

  // Collect all unique specializations across teachers
  const allSpecializations = useMemo(() => {
    const set = new Set<string>();
    guruProfiles.forEach((g) => {
      g.specializations.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [guruProfiles]);

  // Filtered & sorted guru
  const filteredGuru = useMemo(() => {
    return guruProfiles.filter((guru) => {
      // Status filter
      if (selectedStatus !== "Semua") {
        if (selectedStatus === "approved" && guru.validationStatus !== "approved") {
          return false;
        }
        if (selectedStatus === "pending" && guru.validationStatus !== "pending") {
          return false;
        }
      }

      // Jurusan filter
      if (selectedJurusan !== "Semua" && guru.jurusan !== selectedJurusan) {
        return false;
      }

      // Spesialisasi filter
      if (
        selectedSpesialisasi !== "Semua" &&
        !guru.specializations.some((s) =>
          s.toLowerCase().includes(selectedSpesialisasi.toLowerCase())
        )
      ) {
        return false;
      }

      // Search query (name or email or nip)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = guru.name.toLowerCase().includes(q);
        const matchEmail = guru.email.toLowerCase().includes(q);
        const matchNip = guru.nuptkOrNip.toLowerCase().includes(q);
        const matchMapel = guru.mapel.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchNip && !matchMapel) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "nama-asc") return a.name.localeCompare(b.name);
      if (sortBy === "nama-desc") return b.name.localeCompare(a.name);
      if (sortBy === "prestasi-desc") return b.prestasiList.length - a.prestasiList.length;
      if (sortBy === "karya-desc") return b.karyaList.length - a.karyaList.length;
      return 0;
    });
  }, [guruProfiles, selectedStatus, selectedJurusan, selectedSpesialisasi, searchQuery, sortBy]);

  return (
    <section id="daftar-guru" className="py-16 bg-white border-t border-[#E2E8F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Khusus Admin jika ada pending review */}
        {isAdmin && pendingGuruProfiles.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Panel Admin: {pendingGuruProfiles.length} Portofolio Guru Menunggu Validasi
                </h4>
                <p className="text-xs text-amber-700">
                  Sebagai akun <span className="font-semibold underline">chusni@smktelkom-mlg.sch.id</span>, Anda dapat meninjau & menyetujui portofolio agar muncul di direktori ini.
                </p>
              </div>
            </div>
            {onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                Buka Panel Validasi Admin
              </button>
            )}
          </div>
        )}

        {/* Banner Guru jika portofolionya pending atau belum lengkap */}
        {currentUser && !isAdmin && currentUser.guruId && (
          <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">
                  Portal Portofolio Anda ({currentUser.name})
                </h4>
                <p className="text-xs text-blue-700">
                  Lengkapi data profil, upload sertifikasi, karya, dan prestasi Anda untuk divalidasi oleh Admin.
                </p>
              </div>
            </div>
            {onOpenGuruDashboard && (
              <button
                onClick={onOpenGuruDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                <Award className="w-4 h-4" />
                Kelola Portofolio Saya
              </button>
            )}
          </div>
        )}

        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direktori Pendidik SMK Telkom Malang</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Daftar Guru
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-1.5">
            Daftar profil resmi, keahlian, prestasi, dan karya pendidik SMK Telkom Malang yang telah tervalidasi oleh Penjamin Mutu.
          </p>
        </div>

        {/* Filter Bar (Identik dengan format referensi gambar) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-2xs"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Jurusan Dropdown */}
            <div className="relative">
              <select
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="Semua">Jurusan / Bidang (Semua)</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
                <option value="PG">PG</option>
                <option value="Normatif">Normatif</option>
                <option value="Adaptif">Adaptif</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Spesialisasi Dropdown */}
            <div className="relative">
              <select
                value={selectedSpesialisasi}
                onChange={(e) => setSelectedSpesialisasi(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-2xs max-w-[180px] truncate"
              >
                <option value="Semua">Spesialisasi (Semua)</option>
                {allSpecializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Status Validasi Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="approved">Status: Tervalidasi ({approvedGuruProfiles.length})</option>
                <option value="Semua">Status: Semua</option>
                {isAdmin && (
                  <option value="pending">
                    Status: Menunggu Validasi ({pendingGuruProfiles.length})
                  </option>
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Urutkan Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer shadow-2xs"
              >
                <option value="nama-asc">Urutkan: Nama (A-Z)</option>
                <option value="nama-desc">Urutkan: Nama (Z-A)</option>
                <option value="prestasi-desc">Prestasi Terbanyak</option>
                <option value="karya-desc">Karya Terbanyak</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabel Daftar Guru (Sesuai Layout Screenshot Siswa yang Diadaptasi ke Guru) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-600 tracking-wider">
                  <th className="py-4 px-5">Nama</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Jurusan</th>
                  <th className="py-4 px-5">Spesialisasi</th>
                  <th className="py-4 px-4 text-center">Prestasi</th>
                  <th className="py-4 px-4 text-center">Karya</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredGuru.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700">
                          Tidak ada guru yang sesuai dengan kriteria filter.
                        </p>
                        <p className="text-xs text-slate-400">
                          Coba ganti kata kunci pencarian atau ubah filter jurusan/spesialisasi.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGuru.map((guru) => (
                    <tr
                      key={guru.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Nama + Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={guru.avatarUrl}
                            alt={guru.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors block leading-tight">
                              {guru.name}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {guru.mapel}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 font-mono text-xs text-slate-600">
                        {guru.email}
                      </td>

                      {/* Jurusan */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-[#2563EB] border border-blue-200/60">
                          {guru.jurusan}
                        </span>
                      </td>

                      {/* Spesialisasi (Badges persis referensi gambar) */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {guru.specializations.map((spec, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/70 whitespace-nowrap"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Prestasi */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] text-xs font-bold text-slate-800">
                          {guru.prestasiList.length}
                        </span>
                      </td>

                      {/* Karya & Sertifikasi */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] text-xs font-bold text-slate-800">
                          {guru.karyaList.length}
                        </span>
                      </td>

                      {/* Status Validasi */}
                      <td className="py-4 px-5 text-center">
                        {guru.validationStatus === "approved" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Tervalidasi
                          </span>
                        ) : guru.validationStatus === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Menunggu Validasi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            Perlu Revisi
                          </span>
                        )}
                      </td>

                      {/* Aksi (Icon Mata) */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => onSelectGuru(guru)}
                          title="Lihat Detail Portofolio"
                          className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="py-3.5 px-5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <span className="font-semibold text-slate-800">{filteredGuru.length}</span> pendidik dari total {guruProfiles.length} guru terdaftar
            </span>
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verifikasi Mutu Terpusat oleh Admin SMK Telkom Malang
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

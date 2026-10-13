"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";

export interface LeaderboardTeacher {
  rank: number;
  id: string;
  name: string;
  school: string;
  region: string;
  subject: string;
  avatar: string;
  points: number;
  modulesCount: number;
  kudosCount: number;
  innovationFocus: string;
  badges: string[];
  nuptk: string;
}

interface LeaderboardProps {
  onSelectTeacher: (teacher: LeaderboardTeacher) => void;
}

export default function LeaderboardSection({ onSelectTeacher }: LeaderboardProps) {
  const { guruProfiles } = usePortoGuru();

  // Hitung leaderboard real-time dari database guru SMK Telkom Malang
  const topTeachers: LeaderboardTeacher[] = useMemo(() => {
    return [...guruProfiles]
      .map((guru) => {
        const approvedPrestasi = guru.prestasiList.filter((p) => p.status === "approved").length;
        const approvedSertifikasi = guru.sertifikasiList.filter((s) => s.status === "approved").length;
        const approvedKarya = guru.karyaList.filter((k) => k.status === "approved").length;

        // Formula skor poin objektif dari portofolio tervalidasi
        const points =
          approvedPrestasi * 1500 +
          approvedSertifikasi * 1200 +
          approvedKarya * 1000 +
          (guru.validationStatus === "approved" ? 5000 : 2500);

        return {
          id: guru.id,
          name: guru.name,
          school: "SMK Telkom Malang",
          region: "Malang, Jawa Timur",
          subject: `${guru.mapel} (${guru.jurusan})`,
          avatar: guru.avatarUrl || "/budi-santoso.jpg",
          points,
          modulesCount: guru.karyaList.length,
          kudosCount: approvedPrestasi * 85 + approvedKarya * 45 + 150,
          innovationFocus: guru.bio,
          badges: [guru.jurusan, ...(guru.specializations.slice(0, 2))],
          nuptk: guru.nuptkOrNip,
        };
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [guruProfiles]);

  return (
    <section id="leaderboard" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Apresiasi Dedikasi Pendidik Moklet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Leaderboard Pendidik SMK Telkom Malang
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Peringkat dihitung secara transparan dan otomatis berdasarkan akumulasi modul ajar industri, sertifikasi kompetensi resmi, serta prestasi kejuaraan yang telah terverifikasi penjamin mutu.
          </p>
        </div>

        {/* 3 Podium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {topTeachers.map((item) => {
            const isRank1 = item.rank === 1;
            const isRank2 = item.rank === 2;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative group ${
                  isRank1
                    ? "border-2 border-amber-300 shadow-[0_16px_40px_rgba(245,158,11,0.12)] lg:-translate-y-2 ring-4 ring-amber-100"
                    : "border border-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:-translate-y-1"
                }`}
              >
                {/* Ranking Crown/Badge Banner */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                        isRank1
                          ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900"
                          : isRank2
                          ? "bg-gradient-to-tr from-slate-300 to-slate-200 text-slate-800"
                          : "bg-gradient-to-tr from-amber-700 to-amber-600 text-white"
                      }`}
                    >
                      #{item.rank}
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wide">
                      {isRank1
                        ? "Peringkat 1 Moklet"
                        : isRank2
                        ? "Peringkat 2 Moklet"
                        : "Peringkat 3 Moklet"}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    Terverifikasi
                  </span>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-100">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      unoptimized={item.avatar.startsWith("http")}
                      className="object-cover object-top"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#2563EB] mt-0.5">
                      {item.subject}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {item.school} • {item.region}
                    </p>
                  </div>
                </div>

                {/* Inovasi Kelas Unggulan */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Fokus Pengajaran & Praktik Baik
                  </p>
                  <p className="text-xs text-[#334155] leading-relaxed font-medium line-clamp-3">
                    &ldquo;{item.innovationFocus}&rdquo;
                  </p>
                </div>

                {/* Badges Keahlian */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Metrics Box */}
                <div className="mt-auto pt-4 border-t border-[#F1F5F9]">
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-sm font-extrabold text-[#1E293B] font-mono">{item.points.toLocaleString("id-ID")}</p>
                      <p className="text-[10px] text-[#64748B]">Skor Poin</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-sm font-extrabold text-[#2563EB] font-mono">{item.modulesCount}</p>
                      <p className="text-[10px] text-[#64748B]">Modul Ajar</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-sm font-extrabold text-[#F97316] font-mono">{item.kudosCount}+</p>
                      <p className="text-[10px] text-[#64748B]">Apresiasi</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTeacher(item)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold hover:bg-[#2563EB] hover:text-white transition-all duration-200 border border-blue-100 group-hover:border-transparent cursor-pointer"
                  >
                    <span>Lihat Portofolio Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

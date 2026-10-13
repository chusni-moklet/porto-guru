"use client";

import React, { useMemo } from "react";
import { Users, Award, Trophy, BookOpen, Sparkles, ShieldCheck } from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";

export default function StatsBar() {
  const { guruProfiles, approvedGuruProfiles, pendingGuruProfiles } = usePortoGuru();

  // Hitung data real langsung dari database profil guru SMK Telkom Malang
  const totalGuru = guruProfiles.length;
  const verifiedGuru = approvedGuruProfiles.length;
  const pendingGuru = pendingGuruProfiles.length;

  const totalSertifikasi = useMemo(() => {
    return guruProfiles.reduce(
      (acc, g) => acc + g.sertifikasiList.filter((s) => s.status === "approved").length,
      0
    );
  }, [guruProfiles]);

  const totalPrestasi = useMemo(() => {
    return guruProfiles.reduce(
      (acc, g) => acc + g.prestasiList.filter((p) => p.status === "approved").length,
      0
    );
  }, [guruProfiles]);

  const totalKarya = useMemo(() => {
    return guruProfiles.reduce(
      (acc, g) => acc + g.karyaList.filter((k) => k.status === "approved").length,
      0
    );
  }, [guruProfiles]);

  const rplCount = useMemo(
    () => guruProfiles.filter((g) => g.jurusan === "RPL").length,
    [guruProfiles]
  );
  const tkjCount = useMemo(
    () => guruProfiles.filter((g) => g.jurusan === "TKJ").length,
    [guruProfiles]
  );
  const pgCount = useMemo(
    () => guruProfiles.filter((g) => g.jurusan === "PG").length,
    [guruProfiles]
  );
  const normatifCount = useMemo(
    () => guruProfiles.filter((g) => g.jurusan === "Normatif").length,
    [guruProfiles]
  );
  const adaptifCount = useMemo(
    () => guruProfiles.filter((g) => g.jurusan === "Adaptif").length,
    [guruProfiles]
  );

  const stats = [
    {
      value: `${totalGuru} Pendidik`,
      label: "Portofolio Guru Terdata",
      sublabel: `${verifiedGuru} Terverifikasi (${pendingGuru} Menunggu)`,
      icon: <Users className="w-6 h-6 text-blue-200" />,
    },
    {
      value: `${totalSertifikasi} Lisensi`,
      label: "Sertifikasi Industri Resmi",
      sublabel: "BNSP, Oracle, Cisco, GCP, CEH",
      icon: <Award className="w-6 h-6 text-blue-200" />,
    },
    {
      value: `${totalPrestasi} Prestasi`,
      label: "Prestasi & Rekognisi Guru",
      sublabel: "Kejuaraan Nasional, LKS & Pembina",
      icon: <Trophy className="w-6 h-6 text-blue-200" />,
    },
    {
      value: `${totalKarya} Modul`,
      label: "Karya & Modul Ajar Terbit",
      sublabel: "Kejuruan, Normatif & Adaptif",
      icon: <BookOpen className="w-6 h-6 text-blue-200" />,
    },
  ];

  return (
    <section
      id="beranda"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] text-white overflow-hidden shadow-inner"
    >
      {/* Subtle decorative glow and grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-blue-100 uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Repositori Resmi Portofolio &bull; SMK Telkom Malang
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-3 text-white tracking-tight">
            Ekosistem Portofolio Guru Moklet
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Data riil rekam jejak profesional, sertifikasi kompetensi industri, prestasi kejuaraan, serta modul ajar terverifikasi penjamin mutu SMK Telkom Malang.
          </p>
        </div>

        {/* 4 Kartu Metrik Real-time */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-7 border border-white/15 text-center transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-between group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors flex items-center justify-center mb-4">
                {stat.icon}
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 font-mono">
                {stat.value}
              </div>

              <div className="text-sm sm:text-base font-semibold text-white">
                {stat.label}
              </div>

              <div className="text-xs text-blue-100/80 mt-1">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown Bidang & Konsentrasi Keahlian SMK Telkom Malang */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-blue-100">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kategori Bidang & Keahlian:</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
            RPL: <strong className="text-white">{rplCount} Guru</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
            TKJ: <strong className="text-white">{tkjCount} Guru</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
            PG: <strong className="text-white">{pgCount} Guru</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
            Normatif: <strong className="text-white">{normatifCount} Guru</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
            Adaptif: <strong className="text-white">{adaptifCount} Guru</strong>
          </span>
        </div>
      </div>
    </section>
  );
}

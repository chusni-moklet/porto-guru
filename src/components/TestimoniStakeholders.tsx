"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, MessageSquare, BadgeCheck } from "lucide-react";

interface TestimoniItem {
  id: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
  quote: string;
  rating: number;
  stakeholderType: string;
}

const testimonials: TestimoniItem[] = [
  {
    id: "test-1",
    name: "Rahmat Dwi Djatmiko, S.T., M.Kom.",
    role: "Kepala SMK Telkom Malang",
    institution: "SMK Telkom Malang • Telkom Schools",
    avatar: "/principal.jpg",
    quote:
      "PortoGuru mempermudah penjaminan mutu sekolah kami dalam memvalidasi kompetensi sertifikasi industri dewan guru RPL, TKJ, dan PG secara transparan serta berbasis bukti portofolio nyata.",
    rating: 5,
    stakeholderType: "Kepala Sekolah",
  },
  {
    id: "test-2",
    name: "Ir. Dian Pratama, M.Sc.",
    role: "Head of Talent & Engineering Partnership",
    institution: "Mitra Industri DUDI (Telkom Group)",
    avatar: "/colleague.jpg",
    quote:
      "Standarisasi modul praktikum dan lisensi sertifikasi industri guru SMK Telkom Malang sangat impresif. Kami melihat kesiapan kurikulum vokasi yang selaras dengan teknologi digital masa kini.",
    rating: 5,
    stakeholderType: "Mitra Industri (DUDI)",
  },
  {
    id: "test-3",
    name: "Drs. H. Mulyadi, M.T.",
    role: "Pengawas SMK Cabang Dinas Pendidikan",
    institution: "Dinas Pendidikan Wilayah Kota Malang & Batu",
    avatar: "/budi-santoso.jpg",
    quote:
      "Direktori portofolio digital terpadu SMK Telkom Malang menjadi benchmark bagi sekolah kejuruan lain dalam mengelola rekam jejak sertifikasi, karya ajar, dan prestasi dewan pendidik.",
    rating: 5,
    stakeholderType: "Pengawas Pendidikan",
  },
];

export default function TestimoniStakeholders() {
  return (
    <section id="testimoni" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Suara Komunitas Pendidikan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Apresiasi Pemangku Kepentingan Pendidikan
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Pandangan pimpinan sekolah, akademisi LPTK, dan penggerak komunitas mengenai dampak platform Porto Guru.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100 group-hover:text-blue-50 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] border border-slate-200">
                    <BadgeCheck className="w-3 h-3 text-[#2563EB]" />
                    {item.stakeholderType}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#334155] leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-5 border-t border-[#F1F5F9]">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover object-top"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B] leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#2563EB] mt-0.5">
                    {item.role}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                    {item.institution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

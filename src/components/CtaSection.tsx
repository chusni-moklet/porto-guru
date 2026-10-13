"use client";

import React from "react";
import { PlusCircle, FileText, Sparkles, CheckCircle2 } from "lucide-react";

interface CtaProps {
  onOpenDaftarModal: () => void;
}

export default function CtaSection({ onOpenDaftarModal }: CtaProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E3A8A] text-white relative overflow-hidden">
      {/* Decorative Blur and Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold text-blue-100 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mari Majukan Pendidikan Bersama</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          Pendidik SMK Telkom Malang? Kelola Portofolio Resmi Anda
        </h2>

        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Gunakan akun resmi <strong>@smktelkom-mlg.sch.id</strong> untuk masuk. Perbarui sertifikasi kompetensi industri, ajukan modul ajar kejuruan, dan pantau hasil verifikasi tim penjamin mutu secara real-time.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenDaftarModal}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#2563EB] text-sm sm:text-base font-bold hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-[#2563EB]" />
            <span>Masuk / Akses Portal Pendidik</span>
          </button>

          <a
            href="#tentang"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 text-sm sm:text-base font-semibold backdrop-blur-sm transition-all"
          >
            <FileText className="w-5 h-5 text-blue-200" />
            <span>Pelajari Alur Kurasi</span>
          </a>
        </div>

        {/* Benefits bar */}
        <div className="pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-blue-100/90 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            100% Gratis Selamanya
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            Lencana Verifikasi NIP
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            Jaringan 12.400+ Pendidik
          </span>
        </div>
      </div>
    </section>
  );
}

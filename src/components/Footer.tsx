"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowUp,
  Mail,
  BookOpen,
  ShieldCheck,
  Heart,
  FileText,
  Users,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E2E8F0]">
          {/* Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-[#1E293B]">
                    Porto<span className="text-[#2563EB]">Guru</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                    ID
                  </span>
                </div>
                <span className="text-xs text-[#64748B] font-medium">
                  Platform Showcase & Portofolio Pendidik Indonesia
                </span>
              </div>
            </div>

            <p className="text-sm text-[#64748B] leading-relaxed max-w-sm">
              Gerakan apresiasi dan keterbukaan modul ajar nusantara. Menghubungkan ribuan pendidik berdedikasi untuk saling menginspirasi dan memajukan mutu pembelajaran anak bangsa.
            </p>

            <div className="pt-2 text-xs text-[#64748B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Didukung Komunitas Guru Penggerak se-Indonesia</span>
            </div>
          </div>

          {/* Menu Navigasi (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <a href="#beranda" className="hover:text-[#2563EB] transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#leaderboard" className="hover:text-[#2563EB] transition-colors">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-[#2563EB] transition-colors">
                  Galeri Portofolio
                </a>
              </li>
              <li>
                <a href="#karya" className="hover:text-[#2563EB] transition-colors">
                  Karya Pendidik
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#2563EB] transition-colors">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Panduan & Sumber Daya (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Panduan Guru
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <a href="#tentang" className="hover:text-[#2563EB] transition-colors">
                  Alur Verifikasi NIP
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#2563EB] transition-colors">
                  Template Modul Ajar
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-[#2563EB] transition-colors">
                  Panduan Kurikulum Merdeka
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#2563EB] transition-colors">
                  Lisensi Konten Terbuka
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak & Dukungan (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Pusat Dukungan
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Butuh bantuan pendaftaran portofolio atau kurasi modul? Hubungi tim kurator Porto Guru:
            </p>
            <div className="space-y-1.5 text-xs text-[#1E293B] font-semibold">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                halo@portoguru.id
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                Komunitas Telegram: @portoguruid
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>
            &copy; 2026 Porto Guru Indonesia. Hak cipta materi ajar tetap milik guru penyusun.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

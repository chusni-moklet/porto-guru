"use client";

import React from "react";
import Image from "next/image";
import {
  Info,
  CheckCircle2,
  FileText,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  Globe2,
  Share2,
} from "lucide-react";

interface TentangAlurProps {
  onOpenDaftarModal: () => void;
}

export default function TentangAlurPendaftaran({ onOpenDaftarModal }: TentangAlurProps) {
  const steps = [
    {
      stepNumber: "01",
      icon: <FileText className="w-6 h-6 text-[#2563EB]" />,
      title: "Registrasi Data NIP & Identitas",
      description:
        "Isi data profil pendidik, asal sekolah, dan nomor NIP untuk memastikan keaslian serta validitas rekam jejak pengajaran Anda.",
      badge: "Waktu: 2 Menit",
    },
    {
      stepNumber: "02",
      icon: <UploadCloud className="w-6 h-6 text-[#F97316]" />,
      title: "Unggah Modul Ajar & Sertifikat",
      description:
        "Lampirkan tautan atau berkas modul ajar terbaik (PDF/Docs), sertifikat pelatihan ber-JP resmi, dan foto dokumentasi praktik baik kelas Anda.",
      badge: "Mendukung Google Drive & PDF",
    },
    {
      stepNumber: "03",
      icon: <ShieldCheck className="w-6 h-6 text-[#10B981]" />,
      title: "Verifikasi Tim Penjamin Mutu Sekolah",
      description:
        "Tim Penjamin Mutu Pendidikan SMK Telkom Malang memvalidasi keabsahan nomor sertifikat dan orisinalitas modul ajar. Setelah disahkan, portofolio resmi Anda langsung aktif di direktori sekolah.",
      badge: "Lencana Terverifikasi",
    },
  ];

  return (
    <section id="tentang" className="py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bagian 1: Visi & Misi Porto Guru */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Standarisasi Mutu &bull; SMK Telkom Malang</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
              Mewadahi Rekam Jejak Kompetensi & Praktik Baik Guru Moklet
            </h2>

            <p className="text-base text-[#64748B] leading-relaxed">
              Dewan guru SMK Telkom Malang secara konsisten berinovasi di kelas kejuruan: mengintegrasikan kurikulum berbasis industri, simulasi teknologi modern (RPL, TKJ, PG), serta membina siswa meraih prestasi nasional.
            </p>

            <p className="text-base text-[#64748B] leading-relaxed">
              <strong>PortoGuru Moklet</strong> hadir sebagai platform resmi penjaminan mutu dan repositori digital. Setiap data sertifikasi industri, modul ajar, dan rekam prestasi melalui alur verifikasi resmi oleh Tim Penjamin Mutu Sekolah.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">100% Bebas Biaya</h4>
                  <p className="text-xs text-[#64748B]">Platform nirlaba untuk pendidik Indonesia.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Lisensi Kreatif Terlindungi</h4>
                  <p className="text-xs text-[#64748B]">Hak cipta tetap sepenuhnya milik guru penyusun.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Visual Classroom / Kolaborasi */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
              <Image
                src="/stem-classroom.jpg"
                alt="Suasana kolaborasi guru dan siswa Indonesia"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#2563EB] text-white shadow-sm inline-block mb-2">
                  Gerakan Gotong Royong Pendidikan
                </span>
                <p className="text-base font-bold text-white leading-snug">
                  Mendokumentasikan Praktik Baik dari Guru, untuk Guru
                </p>
                <p className="text-xs text-slate-200 mt-1">
                  Mendukung transformasi Kurikulum Merdeka yang berpusat pada murid.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian 2: Alur Pendaftaran 3 Langkah */}
        <div className="pt-12 border-t border-[#F1F5F9]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
              Alur Pendaftaran Portofolio 3 Langkah Mudah
            </h3>
            <p className="mt-3 text-sm text-[#64748B]">
              Tampilkan portofolio profesional dan bagikan modul ajar Anda ke seluruh komunitas guru Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-7 flex flex-col justify-between hover:bg-white hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black font-mono text-[#CBD5E1] group-hover:text-[#2563EB] transition-colors">
                      {step.stepNumber}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[#1E293B] leading-snug mb-2">
                    {step.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]/60">
                  <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block">
                    {step.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner untuk Mendaftar */}
          <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-orange-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-lg font-bold text-[#1E293B]">
                Belum Mendaftarkan Portofolio Anda?
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Bergabunglah bersama 12.400+ pendidik Indonesia sekarang juga.
              </p>
            </div>

            <button
              onClick={onOpenDaftarModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow active:scale-98 shrink-0 cursor-pointer"
            >
              <span>Daftarkan Portofolio Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

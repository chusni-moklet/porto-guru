"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  CheckCircle2,
  BookOpen,
  Star,
  MapPin,
  ExternalLink,
  ChevronDown,
  Filter,
  Check,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";

export interface TeacherPortfolioCard {
  id: string;
  name: string;
  avatar: string;
  nuptk: string;
  school: string;
  city: string;
  province: string;
  subject: string;
  category: string;
  specialtyBadge: string;
  specialtyBadgeBg: string;
  modulesCount: number;
  experienceYears: number;
  rating: number;
  bioSnippet: string;
  topModuleTitle: string;
}

interface GaleriPortofolioProps {
  onSelectTeacher: (teacher: TeacherPortfolioCard) => void;
  activeSearchQuery?: string;
}

export default function GaleriPortofolio({
  onSelectTeacher,
  activeSearchQuery = "",
}: GaleriPortofolioProps) {
  const { guruProfiles } = usePortoGuru();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Transform data real profil guru SMK Telkom Malang
  const teachersGalleryList: TeacherPortfolioCard[] = useMemo(() => {
    return guruProfiles.map((guru) => {
      let specialtyBg = "bg-blue-50 text-[#2563EB] border-blue-100";
      if (guru.jurusan === "TKJ") {
        specialtyBg = "bg-emerald-50 text-emerald-700 border-emerald-100";
      } else if (guru.jurusan === "PG") {
        specialtyBg = "bg-purple-50 text-purple-700 border-purple-100";
      } else if (guru.jurusan === "Normatif") {
        specialtyBg = "bg-amber-50 text-amber-700 border-amber-100";
      } else if (guru.jurusan === "Adaptif") {
        specialtyBg = "bg-teal-50 text-teal-700 border-teal-100";
      }

      const verifiedPrestasi = guru.prestasiList.filter((p) => p.status === "approved").length;

      return {
        id: guru.id,
        name: guru.name,
        avatar: guru.avatarUrl || "/budi-santoso.jpg",
        nuptk: guru.nuptkOrNip,
        school: "SMK Telkom Malang",
        city: "Kota Malang",
        province: "Jawa Timur",
        subject: `${guru.mapel} (${guru.jurusan})`,
        category: guru.jurusan.toLowerCase(),
        specialtyBadge: guru.specializations[0] || `Konsentrasi ${guru.jurusan}`,
        specialtyBadgeBg: specialtyBg,
        modulesCount: guru.karyaList.length,
        experienceYears: 6 + verifiedPrestasi * 2,
        rating: Number((4.9 + Math.min(0.09, verifiedPrestasi * 0.03)).toFixed(2)),
        bioSnippet: guru.bio,
        topModuleTitle:
          guru.karyaList[0]?.title ||
          `Modul Kurikulum Industri & Praktikum ${guru.jurusan}`,
      };
    });
  }, [guruProfiles]);

  const filteredTeachers = useMemo(() => {
    return teachersGalleryList.filter((item) => {
      // Filter tab (all / rpl / tkj / pg / normatif / adaptif)
      const matchesTab = activeTab === "all" || item.category === activeTab;

      // Search query filter
      const q = activeSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.school.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q) ||
        item.nuptk.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [teachersGalleryList, activeTab, activeSearchQuery]);

  const rplCount = useMemo(
    () => teachersGalleryList.filter((t) => t.category === "rpl").length,
    [teachersGalleryList]
  );
  const tkjCount = useMemo(
    () => teachersGalleryList.filter((t) => t.category === "tkj").length,
    [teachersGalleryList]
  );
  const pgCount = useMemo(
    () => teachersGalleryList.filter((t) => t.category === "pg").length,
    [teachersGalleryList]
  );
  const normatifCount = useMemo(
    () => teachersGalleryList.filter((t) => t.category === "normatif").length,
    [teachersGalleryList]
  );
  const adaptifCount = useMemo(
    () => teachersGalleryList.filter((t) => t.category === "adaptif").length,
    [teachersGalleryList]
  );

  const categoryOptions = [
    {
      id: "all",
      label: "Semua Kategori",
      desc: "Seluruh Guru Moklet",
      count: teachersGalleryList.length,
    },
    {
      id: "rpl",
      label: "RPL",
      desc: "Rekayasa Perangkat Lunak",
      count: rplCount,
    },
    {
      id: "tkj",
      label: "TKJ",
      desc: "Teknik Komputer & Jaringan",
      count: tkjCount,
    },
    {
      id: "pg",
      label: "PG",
      desc: "Pengembangan Game",
      count: pgCount,
    },
    {
      id: "normatif",
      label: "Normatif",
      desc: "Pendidikan Agama, PPKn, Bhs. Indonesia, PJOK, Seni",
      count: normatifCount,
    },
    {
      id: "adaptif",
      label: "Adaptif",
      desc: "Matematika Terapan, Bhs. Inggris, Fisika, Kimia, IPAS",
      count: adaptifCount,
    },
  ];

  const currentOption =
    categoryOptions.find((opt) => opt.id === activeTab) || categoryOptions[0];

  return (
    <section id="galeri" className="py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Direktori Dewan Pendidik &bull; SMK Telkom Malang</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
              Galeri Portofolio Dewan Pendidik
            </h2>
            <p className="mt-3 text-base text-[#64748B] leading-relaxed">
              Jelajahi profil lengkap, modul ajar kurikulum kejuruan, normatif & adaptif, serta rekam jejak sertifikasi resmi dari dewan pendidik SMK Telkom Malang.
            </p>
          </div>

          {/* Dropdown Filter Kategori Pendidik */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="h-11 px-4 sm:px-5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#1E293B] text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] active:scale-[0.98]"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              <Filter className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[#64748B]">Kategori:</span>
              <span className="font-bold text-[#2563EB]">{currentOption.label}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
                {currentOption.count}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Pilih Kategori Guru
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {teachersGalleryList.length} Pendidik
                  </span>
                </div>
                <div className="space-y-1">
                  {categoryOptions.map((opt) => {
                    const isSelected = activeTab === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(opt.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-[#2563EB] font-bold border border-blue-200 shadow-2xs"
                            : "hover:bg-slate-50 text-[#1E293B]"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{opt.label}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500 block truncate mt-0.5">
                            {opt.desc}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            isSelected
                              ? "bg-[#2563EB] text-white border-[#2563EB]"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {opt.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-16 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0]">
            <p className="text-base font-bold text-[#1E293B]">
              Tidak ada profil pendidik yang cocok dengan filter.
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Pilih tab &quot;Semua&quot; untuk melihat seluruh dewan guru SMK Telkom Malang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-white rounded-2xl border border-[#E2E8F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(37,99,235,0.09)] hover:border-blue-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Nama, NIP Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100">
                        <Image
                          src={teacher.avatar}
                          alt={teacher.name}
                          fill
                          unoptimized={teacher.avatar.startsWith("http")}
                          className="object-cover object-top"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors leading-tight">
                            {teacher.name}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        </div>
                        <span className="font-mono text-[11px] text-[#64748B] block mt-0.5">
                          NIP: {teacher.nuptk}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{teacher.rating}</span>
                    </div>
                  </div>

                  {/* School & Subject */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[#2563EB]">
                      {teacher.subject}
                    </p>
                    <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#94A3B8]" />
                      {teacher.school}, {teacher.city}
                    </p>
                  </div>

                  {/* Specialty Badge */}
                  <div className="mb-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${teacher.specialtyBadgeBg}`}
                    >
                      {teacher.specialtyBadge}
                    </span>
                  </div>

                  {/* Bio Snippet */}
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                    {teacher.bioSnippet}
                  </p>

                  {/* Top Module Card Inside */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-0.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#2563EB]" />
                      Modul Unggulan:
                    </p>
                    <p className="text-xs font-bold text-[#1E293B] line-clamp-1">
                      {teacher.topModuleTitle}
                    </p>
                  </div>

                  {/* Compact Metrics Strip */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 border-t border-[#F1F5F9]">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-[#1E293B] font-mono">{teacher.modulesCount}</span>
                      <span className="text-[#64748B] ml-1 text-[11px]">Modul Ajar</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-[#1E293B] font-mono">{teacher.experienceYears} Th</span>
                      <span className="text-[#64748B] ml-1 text-[11px]">Pengalaman</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="mt-5 pt-3 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => onSelectTeacher(teacher)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold hover:bg-[#2563EB] hover:text-white transition-all duration-200 border border-blue-100 group-hover:border-transparent cursor-pointer"
                  >
                    <span>Lihat Portofolio Lengkap</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

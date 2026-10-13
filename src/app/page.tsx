"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DaftarGuruTable from "@/components/DaftarGuruTable";
import StatsBar from "@/components/StatsBar";
import LeaderboardSection, {
  LeaderboardTeacher,
} from "@/components/LeaderboardSection";
import GaleriPortofolio, {
  TeacherPortfolioCard,
} from "@/components/GaleriPortofolio";
import PilarTematik from "@/components/PilarTematik";
import TentangAlurPendaftaran from "@/components/TentangAlurPendaftaran";
import TestimoniStakeholders from "@/components/TestimoniStakeholders";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import DetailGuruModal, {
  TeacherDetailModalData,
} from "@/components/DetailGuruModal";
import DetailPortoGuruModal from "@/components/DetailPortoGuruModal";
import DaftarPortofolioModal from "@/components/DaftarPortofolioModal";
import LoginModal from "@/components/LoginModal";
import GuruDashboardModal from "@/components/GuruDashboardModal";
import AdminValidationModal from "@/components/AdminValidationModal";
import AdminDashboardView from "@/components/AdminDashboardView";
import GuruDashboardView from "@/components/GuruDashboardView";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { GuruProfile } from "@/types/porto-guru";
import { ArrowLeft, ShieldCheck, GraduationCap } from "lucide-react";

function HomeContent() {
  const { currentUser, isAdmin, guruProfiles } = usePortoGuru();

  // State untuk memastikan render identik saat hidrasi client & SSR
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // State untuk berpindah antara tampilan dashboard role dan mode peninjauan portal publik
  const [isPublicMode, setIsPublicMode] = useState(false);

  const [isDaftarOpen, setIsDaftarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGuruDashboardOpen, setIsGuruDashboardOpen] = useState(false);
  const [guruDashboardTab, setGuruDashboardTab] = useState<
    "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi"
  >("profil");
  const [isAdminValidationOpen, setIsAdminValidationOpen] = useState(false);

  const handleOpenGuruDashboard = (
    tab: "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi" = "profil"
  ) => {
    setGuruDashboardTab(tab);
    setIsGuruDashboardOpen(true);
  };

  // Selected teacher for modals
  const [selectedMokletGuru, setSelectedMokletGuru] = useState<GuruProfile | null>(null);
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherDetailModalData | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectFromLeaderboard = (teacher: LeaderboardTeacher) => {
    const matched = guruProfiles.find((g) => g.id === teacher.id || g.name === teacher.name);
    if (matched) {
      setSelectedMokletGuru(matched);
      return;
    }
    setSelectedTeacher({
      name: teacher.name,
      avatar: teacher.avatar,
      nuptk: teacher.nuptk,
      school: teacher.school,
      province: teacher.region,
      subject: teacher.subject,
      badges: teacher.badges,
      bio: teacher.innovationFocus,
      topModules: [
        {
          title: `Modul Pembelajaran Unggulan: ${teacher.subject}`,
          downloadUrl: "#",
          pages: "32 Halaman • PDF",
        },
      ],
    });
  };

  const handleSelectFromGallery = (teacher: TeacherPortfolioCard) => {
    const matched = guruProfiles.find((g) => g.id === teacher.id || g.name === teacher.name);
    if (matched) {
      setSelectedMokletGuru(matched);
      return;
    }
    setSelectedTeacher({
      name: teacher.name,
      avatar: teacher.avatar,
      nuptk: teacher.nuptk,
      school: teacher.school,
      province: teacher.province,
      subject: teacher.subject,
      rating: teacher.rating,
      badges: [teacher.specialtyBadge],
      bio: teacher.bioSnippet,
      topModules: [
        {
          title: teacher.topModuleTitle,
          downloadUrl: "#",
          pages: "30 Halaman • PDF Terverifikasi",
        },
      ],
    });
  };


  // Cegah hydration mismatch (SSR vs LocalStorage auth di client)
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 font-mono">
            Memuat PortoGuru SMK Telkom Malang...
          </p>
        </div>
      </div>
    );
  }

  // KETIKA PENGGUNA LOGIN: LANGSUNG TAMPILKAN DASHBOARD SESUAI ROLE (TANPA LANDING PAGE)
  if (currentUser && !isPublicMode) {
    if (isAdmin) {
      return (
        <>
          <AdminDashboardView
            onTogglePublicMode={() => setIsPublicMode(true)}
            onViewTeacherProfile={(guru) => setSelectedMokletGuru(guru)}
          />

          {/* Modal Preview Portofolio Guru jika Admin ingin melihat detail */}
          <DetailPortoGuruModal
            guru={selectedMokletGuru}
            onClose={() => setSelectedMokletGuru(null)}
          />
        </>
      );
    }

    // Role Guru (Pendidik)
    return (
      <>
        <GuruDashboardView
          onTogglePublicMode={() => setIsPublicMode(true)}
        />

        {/* Modal Preview Portofolio jika diperlukan */}
        <DetailPortoGuruModal
          guru={selectedMokletGuru}
          onClose={() => setSelectedMokletGuru(null)}
        />
      </>
    );
  }

  // JIKA BELUM LOGIN ATAU SEDANG DALAM MODE PENINJAUAN PORTAL PUBLIK: TAMPILKAN LANDING PAGE
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      {/* Bar Pemberitahuan Mode Publik Jika Sedang Login */}
      {currentUser && isPublicMode && (
        <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="flex items-center gap-1.5">
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <GraduationCap className="w-4 h-4 text-blue-400" />
              )}
              <span>
                Pratinjau Portal Publik &bull; Masuk sebagai{" "}
                <strong className="text-white">{currentUser.name}</strong>{" "}
                <span className="text-slate-400">
                  ({isAdmin ? "Admin Validator" : "Pendidik"})
                </span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPublicMode(false)}
            className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard {isAdmin ? "Admin" : "Portofolio"}</span>
          </button>
        </div>
      )}

      {/* 1. Header & Navigasi Platform */}
      <Navbar
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenGuruDashboard={(tab) => {
          setIsPublicMode(false);
          handleOpenGuruDashboard(tab);
        }}
        onOpenAdminPanel={() => {
          setIsPublicMode(false);
          setIsAdminValidationOpen(true);
        }}
      />

      <main className="flex-1">
        {/* Metrik Dampak Komunitas Nasional (Stats Bar - Menggantikan Hero) */}
        <StatsBar />

        {/* DAFTAR GURU (Sesuai Referensi Gambar User - Dilengkapi Autentikasi & Validasi) */}
        <DaftarGuruTable
          onSelectGuru={(guru) => setSelectedMokletGuru(guru)}
          onOpenAdminPanel={() => setIsPublicMode(false)}
          onOpenGuruDashboard={() => setIsPublicMode(false)}
        />

        {/* 5. Seksi Leaderboard Pendidik Pekan Ini */}
        <LeaderboardSection onSelectTeacher={handleSelectFromLeaderboard} />

        {/* 6. Seksi Galeri Portofolio Guru Unggulan */}
        <GaleriPortofolio
          onSelectTeacher={handleSelectFromGallery}
          activeSearchQuery={searchQuery}
        />

        {/* 7. Karya & Inovasi Pembelajaran */}
        <PilarTematik />

        {/* 8. Seksi Tentang Porto Guru & Alur Pendaftaran */}
        <TentangAlurPendaftaran
          onOpenDaftarModal={() => setIsLoginOpen(true)}
        />

        {/* 9. Testimoni Stakeholders */}
        <TestimoniStakeholders />

        {/* 10. Call-to-Action & Pendaftaran Akun @smktelkom-mlg.sch.id */}
        <CtaSection onOpenDaftarModal={() => setIsLoginOpen(true)} />
      </main>

      {/* 11. Footer Lengkap & Panduan */}
      <Footer />

      {/* MODAL 1: Detail Portofolio Guru Resmi SMK Telkom Malang */}
      <DetailPortoGuruModal
        guru={selectedMokletGuru}
        onClose={() => setSelectedMokletGuru(null)}
      />

      {/* MODAL 2: Login Autentikasi @smktelkom-mlg.sch.id */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccessLogin={() => {
          // Ketika login berhasil, otomatis beralih ke dashboard role
          setIsPublicMode(false);
        }}
      />

      {/* MODAL 3: Portal Pendidik (Fallback jika diakses dari menu publik) */}
      <GuruDashboardModal
        isOpen={isGuruDashboardOpen}
        onClose={() => setIsGuruDashboardOpen(false)}
        initialTab={guruDashboardTab}
      />

      {/* MODAL 4: Panel Validasi Admin (Fallback jika diakses dari menu publik) */}
      <AdminValidationModal
        isOpen={isAdminValidationOpen}
        onClose={() => setIsAdminValidationOpen(false)}
        onViewTeacherProfile={(guru) => setSelectedMokletGuru(guru)}
      />

      {/* Legacy Modals */}
      <DetailGuruModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />

      <DaftarPortofolioModal
        isOpen={isDaftarOpen}
        onClose={() => setIsDaftarOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Menu,
  X,
  Trophy,
  LayoutGrid,
  Compass,
  ChevronRight,
  Users,
  ShieldCheck,
  Award,
  LogOut,
  LogIn,
  Bell,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import NotificationDropdown from "@/components/NotificationDropdown";

interface NavbarProps {
  onOpenLoginModal: () => void;
  onOpenGuruDashboard: (tab?: "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi") => void;
  onOpenAdminPanel: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Navbar({
  onOpenLoginModal,
  onOpenGuruDashboard,
  onOpenAdminPanel,
}: NavbarProps) {
  const {
    currentUser,
    isAdmin,
    pendingGuruProfiles,
    logout,
    unreadNotificationCount,
  } = usePortoGuru();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY < 120) {
        setActiveSection("beranda");
        return;
      }

      const sections = [
        "beranda",
        "daftar-guru",
        "leaderboard",
        "galeri",
        "karya",
        "tematik",
      ];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section === "tematik" ? "karya" : section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#beranda", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Daftar Guru", href: "#daftar-guru", icon: <Users className="w-4 h-4" /> },
    { label: "Leaderboard", href: "#leaderboard", icon: <Trophy className="w-4 h-4" /> },
    {
      label: "Galeri Portofolio",
      shortLabel: "Galeri",
      href: "#galeri",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    { label: "Karya", href: "#karya", icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8F0]"
          : "bg-white/80 backdrop-blur-sm border-b border-[#E2E8F0]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* Logo Porto Guru */}
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="#"
              className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded-xl py-1 px-1.5"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
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
                <span className="text-xs text-[#64748B] font-medium hidden xl:inline-block">
                  Platform Showcase & Portofolio Pendidik
                </span>
              </div>
            </Link>
          </div>

          {/* Centered Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F1F5F9]/90 p-1.5 rounded-full border border-[#E2E8F0] shrink-0">
            {navLinks.map((link) => {
              const targetId = link.href.replace("#", "");
              const isActive = activeSection === targetId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`h-9 px-3.5 xl:px-4 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-white text-[#2563EB] shadow-xs"
                      : "text-[#64748B] hover:text-[#1E293B] hover:bg-white/70"
                  }`}
                >
                  {link.shortLabel ? (
                    <>
                      <span>{link.shortLabel}</span>
                      <span className="hidden xl:inline"> Portofolio</span>
                    </>
                  ) : (
                    link.label
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Masuk / Akun Profile, Notifikasi, & Tombol Portofolio */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Jika BELUM LOGIN: Tampilkan tombol Masuk Biru */}
              {!currentUser ? (
                <button
                  onClick={onOpenLoginModal}
                  className="h-10 px-6 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs xl:text-sm font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-98 cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Masuk</span>
                </button>
              ) : (
                /* Jika SUDAH LOGIN: Tampilkan Role, Notifikasi & Tombol Kelola */
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <button
                      onClick={onOpenAdminPanel}
                      className="h-9 px-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Panel Validasi</span>
                      {pendingGuruProfiles.length > 0 && (
                        <span className="w-5 h-5 rounded-full bg-white text-amber-700 text-[10px] font-black flex items-center justify-center shadow-2xs">
                          {pendingGuruProfiles.length}
                        </span>
                      )}
                    </button>
                  ) : (
                    <>
                      {/* Lonceng Notifikasi Guru untuk Status Pending, Verifikasi, Ditolak */}
                      <NotificationDropdown
                        onOpenDashboardTab={(tab) => onOpenGuruDashboard(tab)}
                      />

                      <button
                        onClick={() => onOpenGuruDashboard("profil")}
                        className="h-9 px-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Portofolio Saya</span>
                      </button>
                    </>
                  )}

                  {/* User Pill & Logout */}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <div className="flex flex-col text-right hidden xl:flex">
                      <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[130px]">
                        {isAdmin ? "Admin Validator" : "Pendidik Moklet"}
                      </span>
                    </div>

                    <button
                      onClick={logout}
                      title="Keluar / Logout"
                      className="w-8 h-8 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {!currentUser ? (
                <button
                  onClick={onOpenLoginModal}
                  className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Masuk
                </button>
              ) : isAdmin ? (
                <button
                  onClick={onOpenAdminPanel}
                  className="px-2.5 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{pendingGuruProfiles.length}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <NotificationDropdown
                    onOpenDashboardTab={(tab) => onOpenGuruDashboard(tab)}
                  />
                  <button
                    onClick={() => onOpenGuruDashboard("profil")}
                    className="px-2.5 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-bold"
                  >
                    Portofolio
                  </button>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-full bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#1E293B]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#1E293B]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#1E293B] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  {link.icon}
                  {link.label}
                </span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#2563EB] text-sm font-semibold text-white shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Masuk Akun @smktelkom-mlg.sch.id
              </button>
            ) : (
              <>
                {isAdmin ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminPanel();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-amber-600 text-sm font-bold text-white shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Buka Panel Validasi ({pendingGuruProfiles.length})
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenGuruDashboard("notifikasi");
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#2563EB]" />
                        <span>Notifikasi Pengajuan Portofolio</span>
                      </span>
                      {unreadNotificationCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                          {unreadNotificationCount} Baru
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenGuruDashboard("profil");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#2563EB] text-sm font-bold text-white shadow-sm"
                    >
                      <Award className="w-4 h-4" />
                      Kelola Portofolio Saya
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar ({currentUser.name})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

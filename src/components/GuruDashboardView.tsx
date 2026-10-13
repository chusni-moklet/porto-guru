"use client";

import React, { useState } from "react";
import {
  User,
  Award,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  FileBadge,
  Bell,
  RotateCcw,
  Eye,
  LogOut,
  ExternalLink,
  GraduationCap,
  Camera,
  Upload,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { PrestasiItem, SertifikasiItem, KaryaItem, NotificationType } from "@/types/porto-guru";
import Image from "next/image";

interface GuruDashboardViewProps {
  onTogglePublicMode: () => void;
  initialTab?: "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi";
}

export default function GuruDashboardView({
  onTogglePublicMode,
  initialTab = "profil",
}: GuruDashboardViewProps) {
  const {
    currentUser,
    logout,
    guruProfiles,
    updateMyProfile,
    addPrestasi,
    deletePrestasi,
    addSertifikasi,
    deleteSertifikasi,
    addKarya,
    deleteKarya,
    resubmitItem,
    submitPortfolioForReview,
    userNotifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = usePortoGuru();

  const [activeTab, setActiveTab] = useState<
    "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi"
  >(initialTab);

  const [notifFilter, setNotifFilter] = useState<"all" | NotificationType>("all");

  // Current guru profile
  const myProfile =
    guruProfiles.find((g) => g.id === currentUser?.guruId) ||
    guruProfiles.find((g) => g.email.toLowerCase() === currentUser?.email.toLowerCase()) ||
    guruProfiles[0];

  // Forms state
  const [newSpecialization, setNewSpecialization] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

  // Prestasi Form
  const [pTitle, setPTitle] = useState("");
  const [pLevel, setPLevel] = useState<"Sekolah" | "Kota/Kabupaten" | "Provinsi" | "Nasional" | "Internasional">("Nasional");
  const [pYear, setPYear] = useState("2026");
  const [pOrganizer, setPOrganizer] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pCertUrl, setPCertUrl] = useState("");

  // Sertifikasi Form
  const [sName, setSName] = useState("");
  const [sIssuer, setSIssuer] = useState("");
  const [sYear, setSYear] = useState("2026");
  const [sId, setSId] = useState("");
  const [sDesc, setSDesc] = useState("");
  const [sCertUrl, setSCertUrl] = useState("");

  // Karya Form
  const [kTitle, setKTitle] = useState("");
  const [kCategory, setKCategory] = useState<
    "Modul Ajar" | "Inovasi Pembelajaran" | "Aplikasi / Software" | "Media Interaktif" | "Publikasi / Jurnal"
  >("Modul Ajar");
  const [kYear, setKYear] = useState("2026");
  const [kDesc, setKDesc] = useState("");
  const [kLink, setKLink] = useState("");

  const [alertFeedback, setAlertFeedback] = useState<{
    type: "success" | "pending" | "warning";
    message: string;
  } | null>(null);

  if (!myProfile) return null;

  // Counts
  const allItems = [
    ...myProfile.prestasiList.map((p) => ({ ...p, itemType: "prestasi" as const })),
    ...myProfile.sertifikasiList.map((s) => ({ ...s, itemType: "sertifikasi" as const })),
    ...myProfile.karyaList.map((k) => ({ ...k, itemType: "karya" as const })),
  ];

  const pendingItemsCount = allItems.filter((i) => i.status === "pending").length;
  const approvedItemsCount = allItems.filter((i) => i.status === "approved").length;
  const rejectedItemsCount = allItems.filter((i) => i.status === "rejected").length;

  const handleAddSpec = () => {
    if (!newSpecialization.trim()) return;
    if (myProfile.specializations.includes(newSpecialization.trim())) return;
    updateMyProfile({
      specializations: [...myProfile.specializations, newSpecialization.trim()],
    });
    setNewSpecialization("");
  };

  const handleRemoveSpec = (specToRemove: string) => {
    updateMyProfile({
      specializations: myProfile.specializations.filter(
        (s) => s !== specToRemove
      ),
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAlertFeedback({
        type: "warning",
        message: "Ukuran file terlalu besar. Maksimal 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          updateMyProfile({ avatarUrl: compressedDataUrl });
          setAlertFeedback({
            type: "success",
            message: "Foto profil berhasil diperbarui!",
          });
          setTimeout(() => setAlertFeedback(null), 3500);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSavePrestasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !pTitle.trim() ||
      !pLevel ||
      !pYear.trim() ||
      !pOrganizer.trim() ||
      !pDesc.trim() ||
      !pCertUrl.trim()
    ) {
      setAlertFeedback({
        type: "warning",
        message: "Semua input formulir prestasi wajib diisi lengkap.",
      });
      setTimeout(() => setAlertFeedback(null), 4000);
      return;
    }
    addPrestasi({
      title: pTitle.trim(),
      level: pLevel,
      year: pYear.trim(),
      organizer: pOrganizer.trim(),
      description: pDesc.trim(),
      certificateUrl: pCertUrl.trim(),
    });
    setPTitle("");
    setPOrganizer("");
    setPDesc("");
    setPCertUrl("");
    setAlertFeedback({
      type: "pending",
      message: `Prestasi baru "${pTitle.trim()}" diajukan dengan status PENDING (Menunggu Verifikasi Admin).`,
    });
    setTimeout(() => setAlertFeedback(null), 4500);
  };

  const handleSaveSertifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !sName.trim() ||
      !sIssuer.trim() ||
      !sYear.trim() ||
      !sId.trim() ||
      !sDesc.trim() ||
      !sCertUrl.trim()
    ) {
      setAlertFeedback({
        type: "warning",
        message: "Semua input formulir sertifikasi wajib diisi lengkap.",
      });
      setTimeout(() => setAlertFeedback(null), 4000);
      return;
    }
    addSertifikasi({
      name: sName.trim(),
      issuer: sIssuer.trim(),
      year: sYear.trim(),
      credentialId: sId.trim(),
      description: sDesc.trim(),
      certificateUrl: sCertUrl.trim(),
    });
    setSName("");
    setSIssuer("");
    setSId("");
    setSDesc("");
    setSCertUrl("");
    setAlertFeedback({
      type: "pending",
      message: `Sertifikasi baru "${sName.trim()}" diajukan dengan status PENDING (Menunggu Verifikasi Admin).`,
    });
    setTimeout(() => setAlertFeedback(null), 4500);
  };

  const handleSaveKarya = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !kTitle.trim() ||
      !kCategory ||
      !kYear.trim() ||
      !kDesc.trim() ||
      !kLink.trim()
    ) {
      setAlertFeedback({
        type: "warning",
        message: "Semua input formulir karya/modul wajib diisi lengkap.",
      });
      setTimeout(() => setAlertFeedback(null), 4000);
      return;
    }
    addKarya({
      title: kTitle.trim(),
      category: kCategory,
      year: kYear.trim(),
      description: kDesc.trim(),
      linkUrl: kLink.trim(),
    });
    setKTitle("");
    setKDesc("");
    setKLink("");
    setAlertFeedback({
      type: "pending",
      message: `Karya inovasi "${kTitle.trim()}" diajukan dengan status PENDING (Menunggu Verifikasi Admin).`,
    });
    setTimeout(() => setAlertFeedback(null), 4500);
  };

  const handleResubmit = (
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    itemTitle: string
  ) => {
    resubmitItem(myProfile.id, itemType, itemId);
    setAlertFeedback({
      type: "pending",
      message: `Pengajuan ulang untuk "${itemTitle}" telah dikirim ke Admin Penjamin Mutu dengan status PENDING.`,
    });
    setTimeout(() => setAlertFeedback(null), 4500);
  };

  const filteredNotifs = userNotifications.filter((n) => {
    if (notifFilter === "all") return true;
    return n.type === notifFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar Khusus Guru */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  PortoGuru <span className="text-[#2563EB]">Pendidik</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {myProfile.jurusan || "SMK Telkom Malang"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser?.email}
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Tab Notifikasi Indicator */}
            <button
              onClick={() => setActiveTab("notifikasi")}
              className="relative h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Notifikasi</span>
              {unreadNotificationCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Tombol Lihat Tampilan Publik */}
            <button
              onClick={onTogglePublicMode}
              className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Lihat tampilan profil publik Anda di web"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Lihat Portal Publik</span>
            </button>

            {/* Tombol Logout */}
            <button
              onClick={logout}
              className="h-9 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Keluar dari akun pendidik"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl w-full mx-auto gap-5">
        {/* Banner Status Pengajuan Portofolio */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <Image
                src={myProfile.avatarUrl}
                alt={myProfile.name}
                fill
                className="object-cover"
                unoptimized
              />
              <label
                className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Ganti Foto Profil"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5">Ubah</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {myProfile.name}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {myProfile.jurusan}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                NIP: {myProfile.nuptkOrNip || "-"} • {myProfile.mapel}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {myProfile.validationStatus === "approved" ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span>Portofolio Tervalidasi</span>
                  <span className="text-[11px] block text-emerald-600 font-normal">
                    Ditampilkan pada direktori publik Moklet
                  </span>
                </div>
              </div>
            ) : myProfile.validationStatus === "pending" ? (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-xs font-bold">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
                <div>
                  <span>Menunggu Validasi</span>
                  <span className="text-[11px] block text-amber-600 font-normal">
                    Dalam antrean peninjauan Admin Penjamin Mutu
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-bold">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span>Perlu Revisi</span>
                  <span className="text-[11px] block text-rose-600 font-normal">
                    Cek catatan revisi di bawah ini
                  </span>
                </div>
              </div>
            )}

            {myProfile.validationStatus !== "approved" && (
              <button
                type="button"
                onClick={() => {
                  submitPortfolioForReview();
                  setAlertFeedback({
                    type: "pending",
                    message: "Portofolio berhasil diajukan untuk ditinjau oleh Admin Penjamin Mutu.",
                  });
                  setTimeout(() => setAlertFeedback(null), 4500);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ajukan Review</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {alertFeedback && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all animate-in fade-in duration-200 ${
              alertFeedback.type === "warning"
                ? "bg-rose-100 text-rose-900 border border-rose-200"
                : alertFeedback.type === "pending"
                ? "bg-amber-100 text-amber-900 border border-amber-200"
                : "bg-emerald-100 text-emerald-900 border border-emerald-200"
            }`}
          >
            {alertFeedback.type === "warning" ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : alertFeedback.type === "pending" ? (
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{alertFeedback.message}</span>
          </div>
        )}

        {/* Catatan Admin Jika Portofolio Ditolak */}
        {myProfile.validationStatus === "rejected" && myProfile.validationNote && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">
                Catatan Revisi dari Admin Penjamin Mutu (M. Chusni Agus, M. Pd.):
              </span>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-rose-100">
                {myProfile.validationNote}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex flex-wrap gap-1 shadow-2xs text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("profil")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "profil"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Saya</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("prestasi")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "prestasi"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <Award className="w-4 h-4" />
            <span>Prestasi ({myProfile.prestasiList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sertifikasi")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "sertifikasi"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <FileBadge className="w-4 h-4" />
            <span>Sertifikasi ({myProfile.sertifikasiList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("karya")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "karya"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Karya & Modul ({myProfile.karyaList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifikasi")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "notifikasi"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifikasi ({userNotifications.length})</span>
          </button>
        </div>

        {/* TAB 1: PROFIL PENDIDIK */}
        {activeTab === "profil" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2563EB]" />
              <span>Informasi Pokok & Biodata Pendidik</span>
            </h3>

            {/* Foto Profil Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200">
                  <Image
                    src={myProfile.avatarUrl}
                    alt={myProfile.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <label className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-0.5">Ubah</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Foto Profil Pendidik
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Format JPG, PNG, atau WebP (maksimal 5MB).
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto Baru</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Tautan URL Foto Alternatif */}
              <div className="sm:max-w-xs w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atau Masukkan Tautan URL Foto
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (avatarUrlInput.trim()) {
                        updateMyProfile({ avatarUrl: avatarUrlInput.trim() });
                        setAlertFeedback({
                          type: "success",
                          message: "Foto profil berhasil diperbarui!",
                        });
                        setAvatarUrlInput("");
                        setTimeout(() => setAlertFeedback(null), 3500);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  value={myProfile.name}
                  onChange={(e) => updateMyProfile({ name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NIP
                </label>
                <input
                  type="text"
                  value={myProfile.nuptkOrNip}
                  onChange={(e) => updateMyProfile({ nuptkOrNip: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kategori / Jurusan Pendidik
                </label>
                <select
                  value={myProfile.jurusan}
                  onChange={(e) =>
                    updateMyProfile({
                      jurusan: e.target.value as "RPL" | "TKJ" | "PG" | "Normatif" | "Adaptif",
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                  <option value="TKJ">TKJ (Teknik Komputer & Jaringan)</option>
                  <option value="PG">PG (Pengembangan Game)</option>
                  <option value="Normatif">Normatif (Pendidikan Agama, PPKn, Bahasa Indonesia, PJOK, Seni)</option>
                  <option value="Adaptif">Adaptif (Matematika, Bahasa Inggris, Fisika, Kimia, IPAS)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mata Pelajaran yang Diampu
                </label>
                <input
                  type="text"
                  value={myProfile.mapel}
                  onChange={(e) => updateMyProfile({ mapel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Bio / Dedikasi Pembelajaran
                </label>
                <textarea
                  rows={3}
                  value={myProfile.bio}
                  onChange={(e) => updateMyProfile({ bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="text"
                  value={myProfile.phone || ""}
                  onChange={(e) => updateMyProfile({ phone: e.target.value })}
                  placeholder="+62 812-xxxx-xxxx"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tautan Profil LinkedIn
                </label>
                <input
                  type="text"
                  value={myProfile.linkedinUrl || ""}
                  onChange={(e) => updateMyProfile({ linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Keahlian & Spesialisasi Tags */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block font-bold text-slate-700 text-xs mb-2">
                Keahlian & Spesialisasi
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {myProfile.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(spec)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Tambah spesialisasi baru..."
                  className="flex-1 p-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRESTASI & PENGHARGAAN */}
        {activeTab === "prestasi" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Tambah Prestasi */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2563EB]" />
                <span>Tambah Prestasi Baru</span>
              </h4>

              <form onSubmit={handleSavePrestasi} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Prestasi / Penghargaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    placeholder="Contoh: Juara 1 Guru Inovatif Nasional"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tingkat <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={pLevel}
                      onChange={(e) =>
                        setPLevel(
                          e.target.value as
                          | "Sekolah"
                          | "Kota/Kabupaten"
                          | "Provinsi"
                          | "Nasional"
                          | "Internasional"
                        )
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="Sekolah">Sekolah</option>
                      <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                      <option value="Provinsi">Provinsi</option>
                      <option value="Nasional">Nasional</option>
                      <option value="Internasional">Internasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tahun <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pYear}
                      onChange={(e) => setPYear(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Penyelenggara <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pOrganizer}
                    onChange={(e) => setPOrganizer(e.target.value)}
                    placeholder="Contoh: Kemendikbudristek"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deskripsi Ringkas <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Penjelasan capaian prestasi..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tautan File <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={pCertUrl}
                    onChange={(e) => setPCertUrl(e.target.value)}
                    placeholder="https://drive.google.com/... atau tautan berkas piagam"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Ajukan</span>
                </button>
              </form>
            </div>

            {/* Daftar Prestasi */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Daftar Prestasi ({myProfile.prestasiList.length})</span>
                </h4>
                <span className="text-xs text-slate-500">
                  {approvedItemsCount} Tervalidasi • {pendingItemsCount} Pending • {rejectedItemsCount} Ditolak
                </span>
              </div>

              {myProfile.prestasiList.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                  Belum ada prestasi yang ditambahkan. Gunakan formulir di sebelah kiri untuk mengajukan.
                </div>
              ) : (
                myProfile.prestasiList.map((item: PrestasiItem) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {item.level} • {item.year}
                        </span>
                      </div>
                      <p className="text-slate-600">{item.description}</p>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Penyelenggara: {item.organizer}
                      </span>
                      {item.certificateUrl && (
                        <a
                          href={item.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Tautan File: {item.certificateUrl}</span>
                        </a>
                      )}
                      {item.statusNote && (
                        <p className="text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                          Catatan peninjau: {item.statusNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "approved" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terverifikasi
                        </span>
                      ) : item.status === "rejected" ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Ditolak (Perlu Revisi)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}

                      {item.status === "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleResubmit("prestasi", item.id, item.title)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Ajukan Ulang</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deletePrestasi(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERTIFIKASI KOMPETENSI */}
        {activeTab === "sertifikasi" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2563EB]" />
                <span>Tambah Sertifikasi Baru</span>
              </h4>

              <form onSubmit={handleSaveSertifikasi} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Sertifikasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sName}
                    onChange={(e) => setSName(e.target.value)}
                    placeholder="Contoh: Asesor BNSP Rekayasa Perangkat Lunak"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lembaga Penerbit / Sertifikasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sIssuer}
                    onChange={(e) => setSIssuer(e.target.value)}
                    placeholder="Contoh: BNSP / Google Cloud / Cisco"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tahun Terbit <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sYear}
                      onChange={(e) => setSYear(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      No. Kredensial / Lisensi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sId}
                      onChange={(e) => setSId(e.target.value)}
                      placeholder="MET.000.xxxx"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deskripsi Ringkas <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={sDesc}
                    onChange={(e) => setSDesc(e.target.value)}
                    placeholder="Penjelasan kompetensi atau cakupan sertifikasi..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tautan File <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={sCertUrl}
                    onChange={(e) => setSCertUrl(e.target.value)}
                    placeholder="https://drive.google.com/... atau tautan berkas sertifikat"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Ajukan</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 px-1">
                <FileBadge className="w-4 h-4 text-blue-500" />
                <span>Daftar Sertifikasi Kompetensi ({myProfile.sertifikasiList.length})</span>
              </h4>

              {myProfile.sertifikasiList.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                  Belum ada sertifikasi kompetensi yang diajukan.
                </div>
              ) : (
                myProfile.sertifikasiList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 text-sm block">
                        {item.name}
                      </span>
                      <p className="text-slate-600">
                        Lembaga: {item.issuer} • Tahun: {item.year}
                      </p>
                      {item.credentialId && (
                        <span className="text-[11px] font-mono text-slate-500 block">
                          No. Lisensi: {item.credentialId}
                        </span>
                      )}
                      {item.description && (
                        <p className="text-slate-600 mt-0.5">{item.description}</p>
                      )}
                      {item.certificateUrl && (
                        <a
                          href={item.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Tautan File: {item.certificateUrl}</span>
                        </a>
                      )}
                      {item.statusNote && (
                        <p className="text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                          Catatan peninjau: {item.statusNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "approved" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terverifikasi
                        </span>
                      ) : item.status === "rejected" ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Ditolak
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}

                      {item.status === "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleResubmit("sertifikasi", item.id, item.name)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Ajukan Ulang</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteSertifikasi(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: KARYA & MODUL INOVASI */}
        {activeTab === "karya" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2563EB]" />
                <span>Tambah Karya / Modul</span>
              </h4>

              <form onSubmit={handleSaveKarya} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Karya Inovasi / Modul <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={kTitle}
                    onChange={(e) => setKTitle(e.target.value)}
                    placeholder="Contoh: Modul Ajar Next.js Fullstack Vokasi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Kategori <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={kCategory}
                      onChange={(e) =>
                        setKCategory(
                          e.target.value as
                          | "Modul Ajar"
                          | "Inovasi Pembelajaran"
                          | "Aplikasi / Software"
                          | "Media Interaktif"
                          | "Publikasi / Jurnal"
                        )
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="Modul Ajar">Modul Ajar</option>
                      <option value="Inovasi Pembelajaran">Inovasi Pembelajaran</option>
                      <option value="Aplikasi / Software">Aplikasi / Software</option>
                      <option value="Media Interaktif">Media Interaktif</option>
                      <option value="Publikasi / Jurnal">Publikasi / Jurnal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tahun <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={kYear}
                      onChange={(e) => setKYear(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deskripsi Ringkas <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={kDesc}
                    onChange={(e) => setKDesc(e.target.value)}
                    placeholder="Uraian manfaat dan implementasi..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tautan File <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={kLink}
                    onChange={(e) => setKLink(e.target.value)}
                    placeholder="https://drive.google.com/... atau tautan berkas / repositori"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Ajukan</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 px-1">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Daftar Karya & Modul Ajar ({myProfile.karyaList.length})</span>
              </h4>

              {myProfile.karyaList.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                  Belum ada karya inovasi atau modul ajar yang ditambahkan.
                </div>
              ) : (
                myProfile.karyaList.map((item: KaryaItem) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {item.category} • {item.year}
                        </span>
                      </div>
                      <p className="text-slate-600">{item.description}</p>
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Tautan File: {item.linkUrl}</span>
                        </a>
                      )}
                      {item.statusNote && (
                        <p className="text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                          Catatan peninjau: {item.statusNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "approved" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terverifikasi
                        </span>
                      ) : item.status === "rejected" ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Ditolak
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}

                      {item.status === "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleResubmit("karya", item.id, item.title)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Ajukan Ulang</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteKarya(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFIKASI */}
        {activeTab === "notifikasi" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#2563EB]" />
                  <span>Riwayat Notifikasi & Status Verifikasi</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pemberitahuan perubahan status pengajuan (Pending, Verifikasi, Ditolak) oleh Penjamin Mutu.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => markAllNotificationsAsRead(myProfile.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Tandai Semua Dibaca
                </button>
                <button
                  type="button"
                  onClick={() => clearNotifications(myProfile.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer"
                >
                  Hapus Riwayat
                </button>
              </div>
            </div>

            {/* Filter Pill */}
            <div className="flex gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setNotifFilter("all")}
                className={`px-3 py-1.5 rounded-xl cursor-pointer ${notifFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                Semua ({userNotifications.length})
              </button>
              <button
                type="button"
                onClick={() => setNotifFilter("pending")}
                className={`px-3 py-1.5 rounded-xl cursor-pointer ${notifFilter === "pending"
                    ? "bg-amber-500 text-white"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setNotifFilter("verified")}
                className={`px-3 py-1.5 rounded-xl cursor-pointer ${notifFilter === "verified"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  }`}
              >
                Verifikasi
              </button>
              <button
                type="button"
                onClick={() => setNotifFilter("rejected")}
                className={`px-3 py-1.5 rounded-xl cursor-pointer ${notifFilter === "rejected"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                  }`}
              >
                Ditolak
              </button>
            </div>

            {/* Notification List */}
            <div className="space-y-2.5 pt-2">
              {filteredNotifs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Tidak ada notifikasi dalam kategori ini.
                </div>
              ) : (
                filteredNotifs.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${notif.read
                        ? "bg-slate-50/60 border-slate-200/80"
                        : "bg-white border-blue-200 shadow-xs ring-1 ring-blue-500/10"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {notif.type === "verified" ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : notif.type === "rejected" ? (
                          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                          {notif.message}
                        </p>

                        {notif.adminNote && (
                          <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                            <span className="font-bold block mb-0.5">
                              Catatan Revisi Penjamin Mutu:
                            </span>
                            <p>{notif.adminNote}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  X,
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
  Check,
  ExternalLink,
  Camera,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { GuruProfile, PrestasiItem, SertifikasiItem, KaryaItem, NotificationType } from "@/types/porto-guru";

interface GuruDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi";
}

export default function GuruDashboardModal({
  isOpen,
  onClose,
  initialTab = "profil",
}: GuruDashboardModalProps) {
  const {
    currentUser,
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

  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen || initialTab !== prevInitialTab) {
    setPrevIsOpen(isOpen);
    setPrevInitialTab(initialTab);
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }

  // Local state for profile edits
  const myProfile = guruProfiles.find((g) => g.id === currentUser?.guruId);

  // Form states for adding items
  const [newSpecialization, setNewSpecialization] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

  // Prestasi Form
  const [pTitle, setPTitle] = useState("");
  const [pLevel, setPLevel] = useState<
    "Sekolah" | "Kota/Kabupaten" | "Provinsi" | "Nasional" | "Internasional"
  >("Nasional");
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

  if (!isOpen || !myProfile) return null;

  // Total stats for this guru's items
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
      message: `Pengajuan ulang untuk "${itemTitle}" berhasil dikirimkan ke Admin. Status kini kembali PENDING.`,
    });
    setTimeout(() => setAlertFeedback(null), 4000);
  };

  const handleSubmitForReview = () => {
    submitPortfolioForReview();
    setActiveTab("status");
    setAlertFeedback({
      type: "pending",
      message: "Portofolio lengkap berhasil diajukan! Notifikasi status pending telah dikirimkan ke Admin Penjamin Mutu.",
    });
    setTimeout(() => setAlertFeedback(null), 5000);
  };

  const filteredNotifications = userNotifications.filter((n) => {
    if (notifFilter === "all") return true;
    return n.type === notifFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative group w-14 h-14 shrink-0 rounded-2xl overflow-hidden border-2 border-white/30 shadow-sm bg-white/10">
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
                <Camera className="w-4 h-4" />
                <span className="text-[8px] font-bold mt-0.5">Ubah</span>
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
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-blue-100">
                  Portal Pendidik
                </span>
                <span className="text-xs font-medium text-blue-200 font-mono">
                  {myProfile.email}
                </span>
              </div>
              <h3 className="text-xl font-bold mt-1">
                Kelola Portofolio: {myProfile.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Item Status Summary Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Status Pengajuan:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Pending ({pendingItemsCount})</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Terverifikasi ({approvedItemsCount})</span>
              </span>

              {rejectedItemsCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold animate-pulse">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span>Ditolak ({rejectedItemsCount})</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Validator Resmi:</span>
            <span className="font-mono font-semibold text-slate-700">chusni@smktelkom-mlg.sch.id</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("profil")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profil"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            1. Profil Guru
          </button>

          <button
            onClick={() => setActiveTab("prestasi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "prestasi"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="w-4 h-4" />
            2. Prestasi ({myProfile.prestasiList.length})
          </button>

          <button
            onClick={() => setActiveTab("sertifikasi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "sertifikasi"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileBadge className="w-4 h-4" />
            3. Sertifikasi ({myProfile.sertifikasiList.length})
          </button>

          <button
            onClick={() => setActiveTab("karya")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "karya"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            4. Karya ({myProfile.karyaList.length})
          </button>

          <button
            onClick={() => setActiveTab("status")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "status"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {myProfile.validationStatus === "approved" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : myProfile.validationStatus === "pending" ? (
              <Clock className="w-4 h-4 text-amber-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            5. Status Validasi
          </button>

          <button
            onClick={() => setActiveTab("notifikasi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === "notifikasi"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>6. Notifikasi</span>
            {unreadNotificationCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                {unreadNotificationCount}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-normal">
                ({userNotifications.length})
              </span>
            )}
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Dynamic Alert Feedback */}
          {alertFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
                alertFeedback.type === "pending"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : alertFeedback.type === "warning"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {alertFeedback.type === "pending" ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                ) : alertFeedback.type === "warning" ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{alertFeedback.message}</span>
              </div>
              <button
                onClick={() => setAlertFeedback(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Warning Banner if there are rejected items */}
          {rejectedItemsCount > 0 && activeTab !== "status" && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Perhatian:</strong> Terdapat {rejectedItemsCount} pengajuan yang ditolak validator dan perlu revisi.
                </span>
              </div>
              <button
                onClick={() => setActiveTab("notifikasi")}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Lihat Catatan Validator
              </button>
            </div>
          )}

          {/* TAB 1: PROFIL */}
          {activeTab === "profil" && (
            <div className="space-y-5">
              {/* Foto Profil Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative group w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200">
                    <Image
                      src={myProfile.avatarUrl}
                      alt={myProfile.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <label className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-4 h-4" />
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
                    <h4 className="text-xs font-bold text-slate-900">
                      Foto Profil Pendidik
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG, atau WebP (maks. 5MB).
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3 h-3" />
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

                <div className="sm:max-w-xs w-full">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
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
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    type="text"
                    value={myProfile.name}
                    onChange={(e) => updateMyProfile({ name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={myProfile.nuptkOrNip}
                    onChange={(e) =>
                      updateMyProfile({ nuptkOrNip: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori / Jurusan Pendidik
                  </label>
                  <select
                    value={myProfile.jurusan}
                    onChange={(e) =>
                      updateMyProfile({
                        jurusan: e.target.value as GuruProfile["jurusan"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                    <option value="TKJ">TKJ (Teknik Komputer & Jaringan)</option>
                    <option value="PG">PG (Pengembangan Game)</option>
                    <option value="Normatif">Normatif (Pendidikan Agama, PPKn, Bahasa Indonesia, PJOK, Seni)</option>
                    <option value="Adaptif">Adaptif (Matematika, Bahasa Inggris, Fisika, Kimia, IPAS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran Diampu
                  </label>
                  <input
                    type="text"
                    value={myProfile.mapel}
                    onChange={(e) => updateMyProfile({ mapel: e.target.value })}
                    placeholder="Contoh: Pemrograman Web & Bergerak"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Spesialisasi Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keahlian & Spesialisasi (Muncul di tabel Daftar Guru)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {myProfile.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(spec)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="Tambah keahlian baru (e.g. Cyber Security, Next.js, IoT)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSpec();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Bio Singkat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bio / Ringkasan Pendidik
                </label>
                <textarea
                  rows={3}
                  value={myProfile.bio}
                  onChange={(e) => updateMyProfile({ bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Action */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("prestasi")}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                >
                  Simpan & Lanjut ke Prestasi →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRESTASI */}
          {activeTab === "prestasi" && (
            <div className="space-y-6">
              {/* Form Tambah Prestasi */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Tambah Prestasi / Penghargaan Baru
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Otomatis Berstatus Pending
                  </span>
                </div>

                <form onSubmit={handleSavePrestasi} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Judul Prestasi / Kejuaraan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pTitle}
                        onChange={(e) => setPTitle(e.target.value)}
                        placeholder="Contoh: Juara 1 Guru Inovatif Vokasi Nasional"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tingkat <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={pLevel}
                        onChange={(e) =>
                          setPLevel(
                            e.target.value as PrestasiItem["level"]
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      >
                        <option value="Sekolah">Sekolah</option>
                        <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Penyelenggara <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pOrganizer}
                        onChange={(e) => setPOrganizer(e.target.value)}
                        placeholder="Contoh: Kemendikbudristek / Telkom"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tahun <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pYear}
                        onChange={(e) => setPYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Deskripsi Ringkas <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      placeholder="Ringkasan dampak atau kejuaraan..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tautan File <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={pCertUrl}
                      onChange={(e) => setPCertUrl(e.target.value)}
                      placeholder="https://drive.google.com/... atau tautan berkas piagam"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajukan Prestasi Baru</span>
                  </button>
                </form>
              </div>

              {/* Daftar Prestasi yang Sudah Ada */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Daftar Prestasi Terunggah ({myProfile.prestasiList.length})
                </h4>
                {myProfile.prestasiList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Belum ada prestasi yang ditambahkan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myProfile.prestasiList.map((p) => {
                      const isPending = p.status === "pending";
                      const isApproved = p.status === "approved";
                      const isRejected = p.status === "rejected";

                      return (
                        <div
                          key={p.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isPending
                              ? "bg-amber-50/40 border-amber-200"
                              : isApproved
                              ? "bg-white border-slate-200"
                              : "bg-rose-50/50 border-rose-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">
                                  {p.title}
                                </span>

                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                  {p.level} • {p.year}
                                </span>

                                {/* Status Badge */}
                                {isPending && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Menunggu Verifikasi (Pending)</span>
                                  </span>
                                )}

                                {isApproved && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Terverifikasi</span>
                                  </span>
                                )}

                                {isRejected && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-rose-600" />
                                    <span>Ditolak (Perlu Revisi)</span>
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 mt-1">
                                Penyelenggara: {p.organizer} {p.description && `• ${p.description}`}
                              </p>
                              {p.certificateUrl && (
                                <a
                                  href={p.certificateUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Tautan File: {p.certificateUrl}</span>
                                </a>
                              )}
                            </div>

                            <button
                              onClick={() => deletePrestasi(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Detail Penolakan & Tombol Ajukan Ulang jika Ditolak */}
                          {isRejected && (
                            <div className="mt-3 p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="font-bold block text-rose-800">
                                  Catatan Penolakan Admin Chusni:
                                </span>
                                <p className="text-[11px] mt-0.5 italic">
                                  &ldquo;{p.statusNote || "Lengkapi berkas pendukung."}&rdquo;
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResubmit("prestasi", p.id, p.title)}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Ajukan Ulang ke Admin</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SERTIFIKASI */}
          {activeTab === "sertifikasi" && (
            <div className="space-y-6">
              {/* Form Tambah Sertifikasi */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileBadge className="w-4 h-4 text-blue-600" />
                    Tambah Sertifikasi Kompetensi / Profesi
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Otomatis Berstatus Pending
                  </span>
                </div>

                <form onSubmit={handleSaveSertifikasi} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Nama Sertifikasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={sName}
                        onChange={(e) => setSName(e.target.value)}
                        placeholder="Contoh: Asesor BNSP / Cisco CCNA / Google Cloud"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Lembaga Penerbit <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={sIssuer}
                        onChange={(e) => setSIssuer(e.target.value)}
                        placeholder="Contoh: BNSP / Cisco / Oracle / Google"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Nomor Kredensial / Lisensi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={sId}
                        onChange={(e) => setSId(e.target.value)}
                        placeholder="Contoh: BNSP-2024-9981"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tahun Terbit <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={sYear}
                        onChange={(e) => setSYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Deskripsi Ringkas <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={sDesc}
                      onChange={(e) => setSDesc(e.target.value)}
                      placeholder="Penjelasan kompetensi atau cakupan sertifikasi..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tautan File <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={sCertUrl}
                      onChange={(e) => setSCertUrl(e.target.value)}
                      placeholder="https://drive.google.com/... atau tautan berkas sertifikat"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajukan Sertifikasi Baru</span>
                  </button>
                </form>
              </div>

              {/* List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Daftar Sertifikasi Terunggah ({myProfile.sertifikasiList.length})
                </h4>
                {myProfile.sertifikasiList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Belum ada sertifikasi yang ditambahkan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myProfile.sertifikasiList.map((s) => {
                      const isPending = s.status === "pending";
                      const isApproved = s.status === "approved";
                      const isRejected = s.status === "rejected";

                      return (
                        <div
                          key={s.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isPending
                              ? "bg-amber-50/40 border-amber-200"
                              : isApproved
                              ? "bg-white border-slate-200"
                              : "bg-rose-50/50 border-rose-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">
                                  {s.name}
                                </span>

                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                  Tahun {s.year}
                                </span>

                                {isPending && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Menunggu Verifikasi (Pending)</span>
                                  </span>
                                )}

                                {isApproved && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Terverifikasi</span>
                                  </span>
                                )}

                                {isRejected && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-rose-600" />
                                    <span>Ditolak (Perlu Revisi)</span>
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 mt-1">
                                Penerbit: {s.issuer} {s.credentialId && `• ID: ${s.credentialId}`}
                              </p>
                              {s.description && (
                                <p className="text-[11px] text-slate-600 mt-0.5">{s.description}</p>
                              )}
                              {s.certificateUrl && (
                                <a
                                  href={s.certificateUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Tautan File: {s.certificateUrl}</span>
                                </a>
                              )}
                            </div>

                            <button
                              onClick={() => deleteSertifikasi(s.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Rejection Note & Resubmit Button */}
                          {isRejected && (
                            <div className="mt-3 p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="font-bold block text-rose-800">
                                  Catatan Penolakan Admin:
                                </span>
                                <p className="text-[11px] mt-0.5 italic">
                                  &ldquo;{s.statusNote || "Lengkapi nomor lisensi sertifikasi."}&rdquo;
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResubmit("sertifikasi", s.id, s.name)}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Ajukan Ulang ke Admin</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: KARYA */}
          {activeTab === "karya" && (
            <div className="space-y-6">
              {/* Form Tambah Karya */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Tambah Karya / Modul Ajar / Inovasi
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Otomatis Berstatus Pending
                  </span>
                </div>

                <form onSubmit={handleSaveKarya} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Judul Karya / Modul / Inovasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={kTitle}
                        onChange={(e) => setKTitle(e.target.value)}
                        placeholder="Contoh: Modul Ajar Fullstack Next.js atau Sistem Lab IoT"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Kategori Karya <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={kCategory}
                        onChange={(e) =>
                          setKCategory(
                            e.target.value as KaryaItem["category"]
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      >
                        <option value="Modul Ajar">Modul Ajar</option>
                        <option value="Inovasi Pembelajaran">Inovasi Pembelajaran</option>
                        <option value="Aplikasi / Software">Aplikasi / Software</option>
                        <option value="Media Interaktif">Media Interaktif</option>
                        <option value="Publikasi / Jurnal">Publikasi / Jurnal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tahun Terbit / Pelaksanaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={kYear}
                      onChange={(e) => setKYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Deskripsi Ringkas <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={kDesc}
                      onChange={(e) => setKDesc(e.target.value)}
                      placeholder="Jelaskan tujuan dan penerapan karya inovasi ini..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tautan File <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={kLink}
                      onChange={(e) => setKLink(e.target.value)}
                      placeholder="https://drive.google.com/... atau tautan modul / repositori"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajukan Karya Baru</span>
                  </button>
                </form>
              </div>

              {/* List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Daftar Karya Terunggah ({myProfile.karyaList.length})
                </h4>
                {myProfile.karyaList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Belum ada karya yang ditambahkan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myProfile.karyaList.map((k) => {
                      const isPending = k.status === "pending";
                      const isApproved = k.status === "approved";
                      const isRejected = k.status === "rejected";

                      return (
                        <div
                          key={k.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isPending
                              ? "bg-amber-50/40 border-amber-200"
                              : isApproved
                              ? "bg-white border-slate-200"
                              : "bg-rose-50/50 border-rose-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">
                                  {k.title}
                                </span>

                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {k.category} • {k.year}
                                </span>

                                {isPending && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Menunggu Verifikasi (Pending)</span>
                                  </span>
                                )}

                                {isApproved && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Terverifikasi</span>
                                  </span>
                                )}

                                {isRejected && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-rose-600" />
                                    <span>Ditolak (Perlu Revisi)</span>
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 mt-1">
                                {k.description}
                              </p>

                              {k.linkUrl && (
                                <a
                                  href={k.linkUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Tautan File: {k.linkUrl}</span>
                                </a>
                              )}
                            </div>

                            <button
                              onClick={() => deleteKarya(k.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Rejection Note & Resubmit Button */}
                          {isRejected && (
                            <div className="mt-3 p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="font-bold block text-rose-800">
                                  Catatan Penolakan Admin:
                                </span>
                                <p className="text-[11px] mt-0.5 italic">
                                  &ldquo;{k.statusNote || "Perbaiki tautan akses berkas modul."}&rdquo;
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResubmit("karya", k.id, k.title)}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Ajukan Ulang ke Admin</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: STATUS VALIDASI */}
          {activeTab === "status" && (
            <div className="space-y-6">
              {/* Status Box */}
              <div
                className={`p-6 rounded-3xl border ${
                  myProfile.validationStatus === "approved"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : myProfile.validationStatus === "pending"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      myProfile.validationStatus === "approved"
                        ? "bg-emerald-500 text-white"
                        : myProfile.validationStatus === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {myProfile.validationStatus === "approved" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : myProfile.validationStatus === "pending" ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Status Validasi Akun Guru
                    </span>
                    <h3 className="text-xl font-extrabold mt-0.5">
                      {myProfile.validationStatus === "approved"
                        ? "Tervalidasi & Tampil di Menu Daftar Guru"
                        : myProfile.validationStatus === "pending"
                        ? "Sedang Menunggu Validasi oleh Admin"
                        : "Perlu Revisi Dokumen Portofolio"}
                    </h3>

                    <p className="text-xs mt-2 leading-relaxed opacity-90">
                      {myProfile.validationStatus === "approved" ? (
                        <>
                          Selamat! Portofolio Anda telah disahkan oleh Admin Penjamin Mutu (
                          <span className="font-semibold underline">
                            {myProfile.validatedBy || "chusni@smktelkom-mlg.sch.id"}
                          </span>
                          ) dan telah aktif secara resmi di tabel publik{" "}
                          <strong>Daftar Guru</strong>.
                        </>
                      ) : myProfile.validationStatus === "pending" ? (
                        <>
                          Pengajuan portofolio Anda telah dikirimkan dan menunggu verifikasi dari Admin Penjamin Mutu (
                          <span className="font-semibold">chusni@smktelkom-mlg.sch.id</span>). Begitu disetujui, nama dan portofolio Anda akan langsung muncul di halaman <strong>Daftar Guru</strong>.
                        </>
                      ) : (
                        <>
                          Pengajuan Anda belum dapat diterbitkan. Catatan dari Admin:{" "}
                          <span className="font-bold underline">
                            {myProfile.validationNote || "Lengkapi berkas pendukung sertifikasi dan karya."}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Breakdown Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Prestasi ({myProfile.prestasiList.length})
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Terverifikasi:</span>
                      <strong className="text-emerald-700">
                        {myProfile.prestasiList.filter((p) => p.status === "approved").length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Pending:</span>
                      <strong className="text-amber-700">
                        {myProfile.prestasiList.filter((p) => p.status === "pending").length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Ditolak:</span>
                      <strong className="text-rose-700">
                        {myProfile.prestasiList.filter((p) => p.status === "rejected").length}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileBadge className="w-4 h-4 text-blue-600" />
                      Sertifikasi ({myProfile.sertifikasiList.length})
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Terverifikasi:</span>
                      <strong className="text-emerald-700">
                        {myProfile.sertifikasiList.filter((s) => s.status === "approved").length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Pending:</span>
                      <strong className="text-amber-700">
                        {myProfile.sertifikasiList.filter((s) => s.status === "pending").length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Ditolak:</span>
                      <strong className="text-rose-700">
                        {myProfile.sertifikasiList.filter((s) => s.status === "rejected").length}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Karya ({myProfile.karyaList.length})
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Terverifikasi:</span>
                      <strong className="text-emerald-700">
                        {myProfile.karyaList.filter((k) => k.status === "approved").length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Pending:</span>
                      <strong className="text-amber-700">
                        {myProfile.karyaList.filter((k) => k.status === "pending").length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Ditolak:</span>
                      <strong className="text-rose-700">
                        {myProfile.karyaList.filter((k) => k.status === "rejected").length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Ajukan Ulang / Ajukan Validasi */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  className="w-full py-3 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirimkan / Perbarui Portofolio ke Admin Chusni</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Notifikasi pengajuan pending akan otomatis masuk ke akun chusni@smktelkom-mlg.sch.id
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFIKASI & RIWAYAT */}
          {activeTab === "notifikasi" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#2563EB]" />
                    <span>Riwayat Notifikasi Pengajuan Portofolio</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Notifikasi otomatis saat pengajuan berstatus Pending, Terverifikasi, atau Ditolak
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead(myProfile.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Tandai Semua Dibaca</span>
                    </button>
                  )}
                  {userNotifications.length > 0 && (
                    <button
                      onClick={() => clearNotifications(myProfile.id)}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Bersihkan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setNotifFilter("all")}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    notifFilter === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Semua ({userNotifications.length})
                </button>
                <button
                  onClick={() => setNotifFilter("pending")}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                    notifFilter === "pending"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending ({userNotifications.filter((n) => n.type === "pending").length})</span>
                </button>
                <button
                  onClick={() => setNotifFilter("verified")}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                    notifFilter === "verified"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terverifikasi ({userNotifications.filter((n) => n.type === "verified").length})</span>
                </button>
                <button
                  onClick={() => setNotifFilter("rejected")}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                    notifFilter === "rejected"
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Ditolak ({userNotifications.filter((n) => n.type === "rejected").length})</span>
                </button>
              </div>

              {/* Notification List */}
              <div className="space-y-3 pt-2">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-600">
                      Tidak ada riwayat notifikasi untuk filter ini.
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const isPending = notif.type === "pending";
                    const isVerified = notif.type === "verified";
                    const isRejected = notif.type === "rejected";

                    return (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-4 rounded-2xl border transition-all ${
                          !notif.read ? "bg-blue-50/40 border-blue-200 shadow-2xs" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isPending
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : isVerified
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {isPending ? (
                              <Clock className="w-5 h-5" />
                            ) : isVerified ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isPending
                                    ? "bg-amber-100 text-amber-800"
                                    : isVerified
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {isPending ? "PENDING" : isVerified ? "TERVERIFIKASI" : "DITOLAK"}
                              </span>

                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                                {notif.itemType}
                              </span>

                              <span className="text-[10px] text-slate-400 font-mono ml-auto">
                                {new Date(notif.createdAt).toLocaleString("id-ID", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>

                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                              {notif.title}
                            </h5>

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {notif.message}
                            </p>

                            {isRejected && notif.adminNote && (
                              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                                <span className="font-bold block text-rose-800">
                                  Catatan Validator:
                                </span>
                                <p className="mt-0.5 italic">
                                  &ldquo;{notif.adminNote}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Quick navigate to tab button */}
                            <div className="mt-3 flex items-center gap-2">
                              {notif.itemType === "prestasi" && (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab("prestasi")}
                                  className="text-[11px] font-bold text-[#2563EB] hover:underline"
                                >
                                  Buka Tab Prestasi →
                                </button>
                              )}
                              {notif.itemType === "sertifikasi" && (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab("sertifikasi")}
                                  className="text-[11px] font-bold text-[#2563EB] hover:underline"
                                >
                                  Buka Tab Sertifikasi →
                                </button>
                              )}
                              {notif.itemType === "karya" && (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab("karya")}
                                  className="text-[11px] font-bold text-[#2563EB] hover:underline"
                                >
                                  Buka Tab Karya →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  FileBadge,
  AlertCircle,
  Check,
  Send,
  LogOut,
  Eye,
  Search,
  Users,
  RefreshCw,
  ExternalLink,
  Lock,
  UserPlus,
  Trash2,
  Plus,
  ChevronDown,
  Shield,
  X,
  ShieldAlert,
  Filter,
  GraduationCap,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import {
  GuruProfile,
  AdminVerificationScope,
} from "@/types/porto-guru";
import Image from "next/image";

interface AdminDashboardViewProps {
  onTogglePublicMode: () => void;
  onViewTeacherProfile?: (guru: GuruProfile) => void;
}

export default function AdminDashboardView({
  onTogglePublicMode,
}: AdminDashboardViewProps) {
  const {
    currentUser,
    logout,
    guruProfiles,
    validatePortfolio,
    validateItem,
    adminValidators,
    addAdminValidator,
    removeAdminValidator,
    toggleAdminValidatorStatus,
    isSuperAdmin,
    currentAdminScope,
    canVerifyItem,
    login,
  } = usePortoGuru();

  // Active side menu: "prestasi" | "sertifikasi" | "karya" | "guru"
  const [activeSideMenu, setActiveSideMenu] = useState<
    "prestasi" | "sertifikasi" | "karya" | "guru"
  >(() => {
    if (currentAdminScope === "prestasi") return "prestasi";
    if (currentAdminScope === "sertifikasi") return "sertifikasi";
    if (currentAdminScope === "karya") return "karya";
    return "prestasi";
  });

  const [selectedGuruId, setSelectedGuruId] = useState<string>(() => {
    const pending = guruProfiles.find((g) => g.validationStatus === "pending");
    return pending?.id || guruProfiles[0]?.id || "";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [jurusanFilter, setJurusanFilter] = useState<string>("all");
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Sync active side menu when scope changes
  useEffect(() => {
    if (currentAdminScope === "prestasi") setActiveSideMenu("prestasi");
    else if (currentAdminScope === "sertifikasi") setActiveSideMenu("sertifikasi");
    else if (currentAdminScope === "karya") setActiveSideMenu("karya");
  }, [currentAdminScope]);

  // Verifikator team management modal state
  const [showVerifikatorModal, setShowVerifikatorModal] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState<"list" | "add">("list");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminNup, setNewAdminNup] = useState("");
  const [newAdminRoleTitle, setNewAdminRoleTitle] = useState("");
  const [newAdminScope, setNewAdminScope] = useState<AdminVerificationScope>("prestasi");
  const [adminFormError, setAdminFormError] = useState("");
  const [adminFormSuccess, setAdminFormSuccess] = useState("");
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Item rejection modal state
  const [rejectItemTarget, setRejectItemTarget] = useState<{
    guruId: string;
    guruName: string;
    itemType: "prestasi" | "sertifikasi" | "karya";
    itemId: string;
    itemTitle: string;
  } | null>(null);
  const [itemRejectNote, setItemRejectNote] = useState("");

  const selectedGuru =
    guruProfiles.find((g) => g.id === selectedGuruId) || guruProfiles[0];

  // Helper for scope styling and metadata
  const getScopeMeta = (scope: AdminVerificationScope) => {
    switch (scope) {
      case "prestasi":
        return {
          label: "Verifikator Prestasi",
          fullTitle: "Admin Verifikator Prestasi & Penghargaan",
          shortLabel: "Prestasi",
          color: "bg-amber-50 text-amber-800 border-amber-200",
          badgeLight: "bg-amber-100 text-amber-900 border-amber-200",
          badgeCard: "border-amber-200 bg-amber-50/70 text-amber-900",
          icon: Award,
          accentColor: "text-amber-600",
          description: "Memverifikasi sertifikat juara lomba, kompetisi & penghargaan guru/siswa.",
        };
      case "sertifikasi":
        return {
          label: "Verifikator Sertifikasi",
          fullTitle: "Admin Verifikator Sertifikasi Profesi & BNSP",
          shortLabel: "Sertifikasi",
          color: "bg-blue-50 text-[#2563EB] border-blue-200",
          badgeLight: "bg-blue-100 text-blue-900 border-blue-200",
          badgeCard: "border-blue-200 bg-blue-50/70 text-blue-900",
          icon: FileBadge,
          accentColor: "text-[#2563EB]",
          description: "Memverifikasi lisensi profesi, sertifikat kompetensi BNSP, & sertifikasi vendor industri.",
        };
      case "karya":
        return {
          label: "Verifikator Karya & Modul",
          fullTitle: "Admin Verifikator Karya Inovasi & Modul Ajar",
          shortLabel: "Karya & Modul",
          color: "bg-emerald-50 text-emerald-800 border-emerald-200",
          badgeLight: "bg-emerald-100 text-emerald-900 border-emerald-200",
          badgeCard: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
          icon: BookOpen,
          accentColor: "text-emerald-600",
          description: "Memverifikasi modul ajar, inovasi pembelajaran, software & media interaktif.",
        };
      case "all":
      default:
        return {
          label: "Super Admin",
          fullTitle: "Super Admin Penjamin Mutu Sekolah",
          shortLabel: "Semua Bidang",
          color: "bg-purple-50 text-purple-800 border-purple-200",
          badgeLight: "bg-purple-100 text-purple-900 border-purple-200",
          badgeCard: "border-purple-200 bg-purple-50/70 text-purple-900",
          icon: ShieldCheck,
          accentColor: "text-purple-600",
          description: "Akses penuh memverifikasi seluruh bidang (Prestasi, Sertifikasi, Karya) dan mengesahkan portofolio.",
        };
    }
  };

  const currentScopeMeta = getScopeMeta(currentAdminScope);
  const canVerifyPrestasi = canVerifyItem("prestasi");
  const canVerifySertifikasi = canVerifyItem("sertifikasi");
  const canVerifyKarya = canVerifyItem("karya");

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError("");
    setAdminFormSuccess("");

    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      setAdminFormError("Nama lengkap dan email Google Workspace wajib diisi.");
      return;
    }

    const defaultTitle =
      newAdminScope === "prestasi"
        ? "Admin Verifikator Prestasi"
        : newAdminScope === "sertifikasi"
        ? "Admin Verifikator Sertifikasi"
        : newAdminScope === "karya"
        ? "Admin Verifikator Karya & Modul"
        : "Super Admin Penjamin Mutu";

    const res = addAdminValidator({
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      nuptkOrNip: newAdminNup.trim() || undefined,
      roleTitle: newAdminRoleTitle.trim() || defaultTitle,
      scope: newAdminScope,
    });

    if (!res.success) {
      setAdminFormError(res.message);
    } else {
      setAdminFormSuccess(res.message);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminNup("");
      setNewAdminRoleTitle("");
      setNewAdminScope("prestasi");
      setTimeout(() => {
        setAdminFormSuccess("");
        setAdminModalTab("list");
      }, 1200);
    }
  };

  // Flattened items across all guru for each category with metadata
  const allPrestasiItems = useMemo(() => {
    return guruProfiles.flatMap((guru) =>
      guru.prestasiList.map((item) => ({
        ...item,
        guruId: guru.id,
        guruName: guru.name,
        guruEmail: guru.email,
        guruJurusan: guru.jurusan,
        guruAvatar: guru.avatarUrl,
        guruNip: guru.nuptkOrNip,
      }))
    );
  }, [guruProfiles]);

  const allSertifikasiItems = useMemo(() => {
    return guruProfiles.flatMap((guru) =>
      guru.sertifikasiList.map((item) => ({
        ...item,
        guruId: guru.id,
        guruName: guru.name,
        guruEmail: guru.email,
        guruJurusan: guru.jurusan,
        guruAvatar: guru.avatarUrl,
        guruNip: guru.nuptkOrNip,
      }))
    );
  }, [guruProfiles]);

  const allKaryaItems = useMemo(() => {
    return guruProfiles.flatMap((guru) =>
      guru.karyaList.map((item) => ({
        ...item,
        guruId: guru.id,
        guruName: guru.name,
        guruEmail: guru.email,
        guruJurusan: guru.jurusan,
        guruAvatar: guru.avatarUrl,
        guruNip: guru.nuptkOrNip,
      }))
    );
  }, [guruProfiles]);

  // Counts for each category
  const totalPrestasiCount = allPrestasiItems.length;
  const pendingPrestasiCount = allPrestasiItems.filter((i) => i.status === "pending").length;
  const approvedPrestasiCount = allPrestasiItems.filter((i) => i.status === "approved").length;
  const rejectedPrestasiCount = allPrestasiItems.filter((i) => i.status === "rejected").length;

  const totalSertifikasiCount = allSertifikasiItems.length;
  const pendingSertifikasiCount = allSertifikasiItems.filter((i) => i.status === "pending").length;
  const approvedSertifikasiCount = allSertifikasiItems.filter((i) => i.status === "approved").length;
  const rejectedSertifikasiCount = allSertifikasiItems.filter((i) => i.status === "rejected").length;

  const totalKaryaCount = allKaryaItems.length;
  const pendingKaryaCount = allKaryaItems.filter((i) => i.status === "pending").length;
  const approvedKaryaCount = allKaryaItems.filter((i) => i.status === "approved").length;
  const rejectedKaryaCount = allKaryaItems.filter((i) => i.status === "rejected").length;

  // Total guru counts
  const totalGuruCount = guruProfiles.length;
  const pendingGuruCount = guruProfiles.filter(
    (g) =>
      g.validationStatus === "pending" ||
      [...g.prestasiList, ...g.sertifikasiList, ...g.karyaList].some(
        (i) => i.status === "pending"
      )
  ).length;
  const approvedGuruCount = guruProfiles.filter(
    (g) => g.validationStatus === "approved"
  ).length;
  const rejectedGuruCount = guruProfiles.filter(
    (g) => g.validationStatus === "rejected"
  ).length;

  // Filtered lists for Category Views
  const filteredPrestasiItems = allPrestasiItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guruName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guruJurusan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (jurusanFilter !== "all" && item.guruJurusan !== jurusanFilter) return false;
    if (filterTab === "pending") return item.status === "pending";
    if (filterTab === "approved") return item.status === "approved";
    if (filterTab === "rejected") return item.status === "rejected";
    return true;
  });

  const filteredSertifikasiItems = allSertifikasiItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.credentialId ? item.credentialId.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      item.guruName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guruJurusan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (jurusanFilter !== "all" && item.guruJurusan !== jurusanFilter) return false;
    if (filterTab === "pending") return item.status === "pending";
    if (filterTab === "approved") return item.status === "approved";
    if (filterTab === "rejected") return item.status === "rejected";
    return true;
  });

  const filteredKaryaItems = allKaryaItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guruName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guruJurusan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (jurusanFilter !== "all" && item.guruJurusan !== jurusanFilter) return false;
    if (filterTab === "pending") return item.status === "pending";
    if (filterTab === "approved") return item.status === "approved";
    if (filterTab === "rejected") return item.status === "rejected";
    return true;
  });

  // Filtered teachers for Guru View
  const filteredGurus = guruProfiles.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.jurusan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (jurusanFilter !== "all" && g.jurusan !== jurusanFilter) return false;

    if (filterTab === "pending") {
      return (
        g.validationStatus === "pending" ||
        [...g.prestasiList, ...g.sertifikasiList, ...g.karyaList].some(
          (i) => i.status === "pending"
        )
      );
    }
    if (filterTab === "approved") {
      return g.validationStatus === "approved";
    }
    if (filterTab === "rejected") {
      return g.validationStatus === "rejected";
    }
    return true;
  });

  // List of distinct jurusans for dropdown filter
  const jurusanOptions = useMemo(() => {
    const set = new Set<string>();
    guruProfiles.forEach((g) => {
      if (g.jurusan) set.add(g.jurusan);
    });
    return Array.from(set);
  }, [guruProfiles]);

  const handleApprovePortfolio = (guruId: string) => {
    if (!isSuperAdmin && currentAdminScope !== "all") {
      setSuccessToast(
        `Catatan: Portofolio ${selectedGuru?.name} telah disetujui untuk bidang ${currentScopeMeta.shortLabel}. Pengesahan portofolio sekolah menyeluruh tetap dapat difinalisasi Super Admin.`
      );
    } else {
      setSuccessToast(
        `Portofolio ${selectedGuru?.name} BERHASIL diverifikasi! Notifikasi disahkan telah dikirim ke akun guru.`
      );
    }
    validatePortfolio(guruId, "approved");
    setShowRejectInput(false);
    setTimeout(() => setSuccessToast(""), 4500);
  };

  const handleRejectPortfolioSubmit = (guruId: string) => {
    if (!rejectNote.trim()) {
      alert("Mohon isi catatan alasan penolakan / revisi portofolio.");
      return;
    }
    validatePortfolio(guruId, "rejected", rejectNote.trim());
    setShowRejectInput(false);
    setRejectNote("");
    setSuccessToast(
      `Permintaan revisi portofolio berhasil dikirim ke akun ${selectedGuru?.email}`
    );
    setTimeout(() => setSuccessToast(""), 4500);
  };

  const handleResetPortfolioToPending = (guruId: string) => {
    validatePortfolio(guruId, "pending");
    setSuccessToast(`Status ${selectedGuru?.name} dikembalikan ke antrean Pending.`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleItemApprove = (
    guruId: string,
    guruName: string,
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    itemTitle: string
  ) => {
    if (!canVerifyItem(itemType)) {
      alert(`Anda tidak memiliki wewenang untuk memverifikasi kategori ${itemType}.`);
      return;
    }
    validateItem(guruId, itemType, itemId, "approved");
    setSuccessToast(
      `Pengajuan "${itemTitle}" milik ${guruName} BERHASIL diverifikasi!`
    );
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const handleItemRejectSubmit = () => {
    if (!rejectItemTarget) return;
    if (!canVerifyItem(rejectItemTarget.itemType)) {
      alert(`Anda tidak memiliki wewenang untuk menolak kategori ${rejectItemTarget.itemType}.`);
      return;
    }
    if (!itemRejectNote.trim()) {
      alert("Mohon isi alasan penolakan / catatan revisi untuk guru.");
      return;
    }
    validateItem(
      rejectItemTarget.guruId,
      rejectItemTarget.itemType,
      rejectItemTarget.itemId,
      "rejected",
      itemRejectNote.trim()
    );
    setSuccessToast(
      `Pengajuan "${rejectItemTarget.itemTitle}" DITOLAK. Catatan revisi telah dikirim ke akun ${rejectItemTarget.guruName}.`
    );
    setRejectItemTarget(null);
    setItemRejectNote("");
    setTimeout(() => setSuccessToast(""), 4500);
  };

  const handleItemResetPending = (
    guruId: string,
    guruName: string,
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    itemTitle: string
  ) => {
    if (!canVerifyItem(itemType)) {
      alert(`Anda tidak memiliki wewenang untuk mengubah status kategori ${itemType}.`);
      return;
    }
    validateItem(guruId, itemType, itemId, "pending");
    setSuccessToast(`Status "${itemTitle}" (${guruName}) dikembalikan ke PENDING.`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleBatchApproveCategory = (category: "prestasi" | "sertifikasi" | "karya") => {
    if (!canVerifyItem(category)) {
      alert(`Anda tidak memiliki wewenang untuk memvalidasi kategori ${category}.`);
      return;
    }
    let count = 0;
    guruProfiles.forEach((guru) => {
      if (category === "prestasi") {
        guru.prestasiList.forEach((p) => {
          if (p.status !== "approved") {
            validateItem(guru.id, "prestasi", p.id, "approved");
            count++;
          }
        });
      } else if (category === "sertifikasi") {
        guru.sertifikasiList.forEach((s) => {
          if (s.status !== "approved") {
            validateItem(guru.id, "sertifikasi", s.id, "approved");
            count++;
          }
        });
      } else if (category === "karya") {
        guru.karyaList.forEach((k) => {
          if (k.status !== "approved") {
            validateItem(guru.id, "karya", k.id, "approved");
            count++;
          }
        });
      }
    });
    setSuccessToast(`Berhasil memverifikasi ${count} pengajuan ${category} sekaligus!`);
    setTimeout(() => setSuccessToast(""), 4500);
  };

  const handleApproveAllItems = () => {
    let count = 0;
    if (canVerifyPrestasi) {
      selectedGuru.prestasiList.forEach((p) => {
        if (p.status !== "approved") {
          validateItem(selectedGuru.id, "prestasi", p.id, "approved");
          count++;
        }
      });
    }
    if (canVerifySertifikasi) {
      selectedGuru.sertifikasiList.forEach((s) => {
        if (s.status !== "approved") {
          validateItem(selectedGuru.id, "sertifikasi", s.id, "approved");
          count++;
        }
      });
    }
    if (canVerifyKarya) {
      selectedGuru.karyaList.forEach((k) => {
        if (k.status !== "approved") {
          validateItem(selectedGuru.id, "karya", k.id, "approved");
          count++;
        }
      });
    }
    setSuccessToast(
      `Berhasil memverifikasi ${count} pengajuan (${currentScopeMeta.shortLabel}) milik ${selectedGuru.name}!`
    );
    setTimeout(() => setSuccessToast(""), 4500);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Top Navigation Bar Khusus Admin */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shrink-0 shadow-2xs">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  Porto<span className="text-[#2563EB]">Guru</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                  ID
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                  Admin
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${currentScopeMeta.color}`}
                >
                  <currentScopeMeta.icon className="w-3 h-3" />
                  <span>{currentScopeMeta.label}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-800 font-semibold">{currentUser?.name || "M. Chusni Agus, M. Pd."}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{currentUser?.email || "chusni@smktelkom-mlg.sch.id"}</span>
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Quick Admin Role Switcher (Untuk Kemudahan Testing Akses Per Bidang) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="h-9 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-2xs"
                title="Ganti peran admin penguji verifikasi"
              >
                <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="hidden md:inline">Ganti Peran:</span>
                <span className="font-bold text-[#2563EB]">{currentScopeMeta.shortLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Pilih Akun Verifikator
                    </span>
                  </div>
                  <div className="space-y-1">
                    {adminValidators.map((admin) => {
                      const meta = getScopeMeta(admin.scope);
                      const isCurrent = currentUser?.email.toLowerCase() === admin.email.toLowerCase();
                      return (
                        <button
                          key={admin.id}
                          type="button"
                          onClick={() => {
                            login(admin.email);
                            setShowRoleSwitcher(false);
                            setSuccessToast(`Beralih ke akun: ${admin.name} (${meta.label})`);
                            setTimeout(() => setSuccessToast(""), 3500);
                          }}
                          className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? "bg-blue-50 text-[#2563EB] font-bold border border-blue-200"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs truncate">{admin.name}</span>
                              {isCurrent && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate font-mono">
                              {admin.email}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${meta.color}`}
                          >
                            {meta.shortLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Kelola Tim Verifikator */}
            <button
              type="button"
              onClick={() => setShowVerifikatorModal(true)}
              className="h-9 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Kelola Tim Verifikator Prestasi, Sertifikasi & Karya"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Kelola Tim Verifikator</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono border border-amber-200">
                {adminValidators.length}
              </span>
            </button>

            {/* Tombol Lihat Tampilan Publik */}
            <button
              onClick={onTogglePublicMode}
              className="h-9 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#2563EB] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200 shadow-2xs"
              title="Lihat tampilan landing page publik"
            >
              <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">Portal Publik</span>
            </button>

            {/* Tombol Logout */}
            <button
              onClick={logout}
              className="h-9 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Keluar dari akun admin"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {successToast && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-6 flex items-center justify-between shrink-0 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mx-auto">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-4 lg:p-5 max-w-7xl w-full mx-auto gap-3 sm:gap-4 lg:overflow-hidden">
        {/* Statistics Bar Dinamis Sesuai Menu yang Aktif */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all">
            <div>
              <span className="text-xs text-slate-500 font-medium">
                {activeSideMenu === "prestasi"
                  ? "Total Prestasi"
                  : activeSideMenu === "sertifikasi"
                  ? "Total Sertifikat"
                  : activeSideMenu === "karya"
                  ? "Total Karya"
                  : "Total Guru"}
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-0.5">
                {activeSideMenu === "prestasi"
                  ? totalPrestasiCount
                  : activeSideMenu === "sertifikasi"
                  ? totalSertifikasiCount
                  : activeSideMenu === "karya"
                  ? totalKaryaCount
                  : totalGuruCount}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center shrink-0">
              {activeSideMenu === "prestasi" ? (
                <Award className="w-5 h-5" />
              ) : activeSideMenu === "sertifikasi" ? (
                <FileBadge className="w-5 h-5" />
              ) : activeSideMenu === "karya" ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </div>
          </div>

          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all">
            <div>
              <span className="text-xs text-amber-700 font-medium">Menunggu Validasi</span>
              <h4 className="text-2xl font-black text-amber-600 mt-0.5">
                {activeSideMenu === "prestasi"
                  ? pendingPrestasiCount
                  : activeSideMenu === "sertifikasi"
                  ? pendingSertifikasiCount
                  : activeSideMenu === "karya"
                  ? pendingKaryaCount
                  : pendingGuruCount}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all">
            <div>
              <span className="text-xs text-emerald-700 font-medium">Tervalidasi (Tayang)</span>
              <h4 className="text-2xl font-black text-emerald-600 mt-0.5">
                {activeSideMenu === "prestasi"
                  ? approvedPrestasiCount
                  : activeSideMenu === "sertifikasi"
                  ? approvedSertifikasiCount
                  : activeSideMenu === "karya"
                  ? approvedKaryaCount
                  : approvedGuruCount}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md transition-all">
            <div>
              <span className="text-xs text-rose-700 font-medium">Perlu Revisi</span>
              <h4 className="text-2xl font-black text-rose-600 mt-0.5">
                {activeSideMenu === "prestasi"
                  ? rejectedPrestasiCount
                  : activeSideMenu === "sertifikasi"
                  ? rejectedSertifikasiCount
                  : activeSideMenu === "karya"
                  ? rejectedKaryaCount
                  : rejectedGuruCount}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Studio Workspace: Split Grid (Daftar Guru di kiri, Studio Validasi di kanan) */}
        <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-800 flex flex-col lg:flex-row overflow-hidden">
          {/* Kolom Kiri: Side Menu Kategori (Prestasi, Sertifikat, Karya, Guru) */}
          <div className="w-full lg:w-72 xl:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 lg:h-full lg:overflow-hidden">
            {/* Side Menu Header */}
            <div className="p-4 border-b border-slate-200 bg-white shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Navigasi Validasi
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                  Studio Admin
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-1">
                <Filter className="w-4 h-4 text-[#2563EB]" />
                <span>Menu Portofolio</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Pilih kategori untuk memvalidasi berkas pengajuan guru SMK Telkom Malang.
              </p>
            </div>

            {/* Side Menu Buttons List */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              {/* 1. Menu Prestasi */}
              <button
                type="button"
                onClick={() => {
                  setActiveSideMenu("prestasi");
                  setFilterTab("all");
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex items-start gap-3 ${
                  activeSideMenu === "prestasi"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-500/30"
                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeSideMenu === "prestasi"
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold truncate">Prestasi</span>
                    {pendingPrestasiCount > 0 ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                        {pendingPrestasiCount} Pending
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">
                        {totalPrestasiCount} item
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Juara lomba & piagam
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      {totalPrestasiCount} Pengajuan
                    </span>
                    {canVerifyPrestasi && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        Wewenang Anda
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* 2. Menu Sertifikat */}
              <button
                type="button"
                onClick={() => {
                  setActiveSideMenu("sertifikasi");
                  setFilterTab("all");
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex items-start gap-3 ${
                  activeSideMenu === "sertifikasi"
                    ? "bg-blue-500/10 border-[#2563EB] text-slate-900 shadow-xs ring-1 ring-[#2563EB]/30"
                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeSideMenu === "sertifikasi"
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/30"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <FileBadge className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold truncate">Sertifikat</span>
                    {pendingSertifikasiCount > 0 ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                        {pendingSertifikasiCount} Pending
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">
                        {totalSertifikasiCount} item
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    BNSP & lisensi profesi
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {totalSertifikasiCount} Pengajuan
                    </span>
                    {canVerifySertifikasi && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        Wewenang Anda
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* 3. Menu Karya */}
              <button
                type="button"
                onClick={() => {
                  setActiveSideMenu("karya");
                  setFilterTab("all");
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex items-start gap-3 ${
                  activeSideMenu === "karya"
                    ? "bg-emerald-500/10 border-emerald-600 text-slate-900 shadow-xs ring-1 ring-emerald-600/30"
                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeSideMenu === "karya"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold truncate">Karya</span>
                    {pendingKaryaCount > 0 ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                        {pendingKaryaCount} Pending
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">
                        {totalKaryaCount} item
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Modul ajar & inovasi
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {totalKaryaCount} Pengajuan
                    </span>
                    {canVerifyKarya && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        Wewenang Anda
                      </span>
                    )}
                  </div>
                </div>
              </button>

              <div className="pt-2 pb-1">
                <div className="border-t border-slate-200/80 my-1"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Tinjauan Tambahan
                </span>
              </div>

              {/* 4. Menu Profil Pendidik */}
              <button
                type="button"
                onClick={() => {
                  setActiveSideMenu("guru");
                  setFilterTab("all");
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-3 ${
                  activeSideMenu === "guru"
                    ? "bg-purple-500/10 border-purple-600 text-slate-900 shadow-xs ring-1 ring-purple-600/30"
                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeSideMenu === "guru"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">Profil Pendidik</span>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      {totalGuruCount} guru
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    Tinjau per portofolio guru
                  </p>
                </div>
              </button>
            </div>

            {/* Verifikator Quick Info Footer */}
            <div className="p-3 border-t border-slate-200 bg-white shrink-0">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Akun Verifikator
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="font-bold text-slate-900 truncate mt-1">
                  {currentUser?.name || "Admin Verifikator"}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${currentScopeMeta.badgeLight}`}>
                    {currentScopeMeta.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail & Studio Tindakan Validasi Berdasarkan Menu Kategori */}
          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto h-full">
            {/* 1. VIEW PRESTASI */}
            {activeSideMenu === "prestasi" && (
              <div className="p-6 lg:p-8 space-y-6">
                {/* Header Banner Prestasi */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          Desk Verifikasi Prestasi & Piagam
                        </h2>
                        {canVerifyPrestasi ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Wewenang Aktif
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Wewenang Terbatas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Tinjau keaslian sertifikat, piagam kejuaraan, dan capaian kompetisi pendidik SMK Telkom Malang.
                      </p>
                    </div>
                  </div>

                  {canVerifyPrestasi && pendingPrestasiCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleBatchApproveCategory("prestasi")}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 self-start md:self-auto"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Semua Pending ({pendingPrestasiCount})</span>
                    </button>
                  )}
                </div>

                {/* Filter & Toolbar Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setFilterTab("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "all"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Semua ({totalPrestasiCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("pending")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        filterTab === "pending"
                          ? "bg-amber-100 text-amber-900 shadow-xs border border-amber-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Menunggu ({pendingPrestasiCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("approved")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "approved"
                          ? "bg-emerald-100 text-emerald-900 shadow-xs border border-emerald-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Tervalidasi ({approvedPrestasiCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("rejected")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "rejected"
                          ? "bg-rose-100 text-rose-900 shadow-xs border border-rose-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Perlu Revisi ({rejectedPrestasiCount})
                    </button>
                  </div>

                  {/* Jurusan Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={jurusanFilter}
                      onChange={(e) => setJurusanFilter(e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="all">Semua Jurusan</option>
                      {jurusanOptions.map((j) => (
                        <option key={j} value={j}>
                          Jurusan {j}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submissions List */}
                {filteredPrestasiItems.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
                    <Award className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">
                      Tidak ada pengajuan prestasi yang sesuai kriteria filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterTab("all");
                        setJurusanFilter("all");
                        setSearchQuery("");
                      }}
                      className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                    >
                      Reset Filter & Pencarian
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPrestasiItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-md transition-all space-y-4"
                      >
                        {/* Top: Guru Info & Status Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                              <Image
                                src={item.guruAvatar}
                                alt={item.guruName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {item.guruName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                  {item.guruJurusan}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                NIP: {item.guruNip} • {item.guruEmail}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.status === "approved" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Tervalidasi
                              </span>
                            ) : item.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                Perlu Revisi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Menunggu Validasi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mid: Achievement Details */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {item.title}
                            </h3>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                              Tingkat {item.level}
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              Tahun {item.year}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-1">
                            <span>
                              <strong>Penyelenggara:</strong> {item.organizer}
                            </span>
                            {item.certificateUrl && (
                              <a
                                href={item.certificateUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-amber-600 hover:text-amber-700 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Lihat Berkas Piagam / Sertifikat</span>
                              </a>
                            )}
                          </div>

                          {item.status === "rejected" && item.statusNote && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mt-2">
                              <span className="font-bold block mb-0.5">Catatan Revisi dari Admin:</span>
                              <p>{item.statusNote}</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom: Verifier Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGuruId(item.guruId);
                              setActiveSideMenu("guru");
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Buka Portofolio Lengkap Pendidik</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {canVerifyPrestasi ? (
                              <>
                                {item.status !== "approved" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemApprove(
                                        item.guruId,
                                        item.guruName,
                                        "prestasi",
                                        item.id,
                                        item.title
                                      )
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Setujui</span>
                                  </button>
                                )}

                                {item.status !== "rejected" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRejectItemTarget({
                                        guruId: item.guruId,
                                        guruName: item.guruName,
                                        itemType: "prestasi",
                                        itemId: item.id,
                                        itemTitle: item.title,
                                      })
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Minta Revisi</span>
                                  </button>
                                )}

                                {item.status !== "pending" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemResetPending(
                                        item.guruId,
                                        item.guruName,
                                        "prestasi",
                                        item.id,
                                        item.title
                                      )
                                    }
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Kembalikan status ke Pending"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Reset Pending</span>
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium flex items-center gap-1.5 border border-slate-200">
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>Khusus Verifikator Prestasi</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. VIEW SERTIFIKASI */}
            {activeSideMenu === "sertifikasi" && (
              <div className="p-6 lg:p-8 space-y-6">
                {/* Header Banner Sertifikasi */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <FileBadge className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          Desk Verifikasi Sertifikasi Profesi & Lisensi
                        </h2>
                        {canVerifySertifikasi ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Wewenang Aktif
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Wewenang Terbatas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Verifikasi lisensi BNSP, sertifikasi keahlian industri, Kemendikbudristek, dan nomor kredensial resmi.
                      </p>
                    </div>
                  </div>

                  {canVerifySertifikasi && pendingSertifikasiCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleBatchApproveCategory("sertifikasi")}
                      className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 self-start md:self-auto"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Semua Pending ({pendingSertifikasiCount})</span>
                    </button>
                  )}
                </div>

                {/* Filter & Toolbar Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setFilterTab("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "all"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Semua ({totalSertifikasiCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("pending")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        filterTab === "pending"
                          ? "bg-amber-100 text-amber-900 shadow-xs border border-amber-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Menunggu ({pendingSertifikasiCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("approved")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "approved"
                          ? "bg-emerald-100 text-emerald-900 shadow-xs border border-emerald-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Tervalidasi ({approvedSertifikasiCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("rejected")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "rejected"
                          ? "bg-rose-100 text-rose-900 shadow-xs border border-rose-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Perlu Revisi ({rejectedSertifikasiCount})
                    </button>
                  </div>

                  {/* Jurusan Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={jurusanFilter}
                      onChange={(e) => setJurusanFilter(e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="all">Semua Jurusan</option>
                      {jurusanOptions.map((j) => (
                        <option key={j} value={j}>
                          Jurusan {j}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submissions List */}
                {filteredSertifikasiItems.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
                    <FileBadge className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">
                      Tidak ada pengajuan sertifikasi yang sesuai kriteria filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterTab("all");
                        setJurusanFilter("all");
                        setSearchQuery("");
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Reset Filter & Pencarian
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSertifikasiItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all space-y-4"
                      >
                        {/* Top: Guru Info & Status Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                              <Image
                                src={item.guruAvatar}
                                alt={item.guruName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {item.guruName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                  {item.guruJurusan}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                NIP: {item.guruNip} • {item.guruEmail}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.status === "approved" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Tervalidasi
                              </span>
                            ) : item.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                Perlu Revisi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Menunggu Validasi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mid: Certificate Details */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {item.name}
                            </h3>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900">
                              {item.issuer}
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              Tahun {item.year}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            {item.credentialId && (
                              <p className="text-slate-700">
                                <strong>Nomor Kredensial / ID:</strong>{" "}
                                <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-900">
                                  {item.credentialId}
                                </code>
                              </p>
                            )}
                            {item.validUntil && (
                              <p className="text-slate-600">
                                <strong>Masa Berlaku Hingga:</strong> {item.validUntil}
                              </p>
                            )}
                          </div>

                          {item.certificateUrl && (
                            <div className="pt-1">
                              <a
                                href={item.certificateUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Buka Dokumen Kredensial Resmi</span>
                              </a>
                            </div>
                          )}

                          {item.status === "rejected" && item.statusNote && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mt-2">
                              <span className="font-bold block mb-0.5">Catatan Revisi dari Admin:</span>
                              <p>{item.statusNote}</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom: Verifier Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGuruId(item.guruId);
                              setActiveSideMenu("guru");
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Buka Portofolio Lengkap Pendidik</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {canVerifySertifikasi ? (
                              <>
                                {item.status !== "approved" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemApprove(
                                        item.guruId,
                                        item.guruName,
                                        "sertifikasi",
                                        item.id,
                                        item.name
                                      )
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Setujui</span>
                                  </button>
                                )}

                                {item.status !== "rejected" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRejectItemTarget({
                                        guruId: item.guruId,
                                        guruName: item.guruName,
                                        itemType: "sertifikasi",
                                        itemId: item.id,
                                        itemTitle: item.name,
                                      })
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Minta Revisi</span>
                                  </button>
                                )}

                                {item.status !== "pending" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemResetPending(
                                        item.guruId,
                                        item.guruName,
                                        "sertifikasi",
                                        item.id,
                                        item.name
                                      )
                                    }
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Kembalikan status ke Pending"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Reset Pending</span>
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium flex items-center gap-1.5 border border-slate-200">
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>Khusus Verifikator Sertifikasi</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. VIEW KARYA */}
            {activeSideMenu === "karya" && (
              <div className="p-6 lg:p-8 space-y-6">
                {/* Header Banner Karya */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          Desk Verifikasi Karya Inovasi & Modul Ajar
                        </h2>
                        {canVerifyKarya ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Wewenang Aktif
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Wewenang Terbatas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Tinjau perangkat modul ajar, inovasi pembelajaran, buku teks, alat peraga, dan publikasi karya pendidik.
                      </p>
                    </div>
                  </div>

                  {canVerifyKarya && pendingKaryaCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleBatchApproveCategory("karya")}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 self-start md:self-auto"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Semua Pending ({pendingKaryaCount})</span>
                    </button>
                  )}
                </div>

                {/* Filter & Toolbar Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setFilterTab("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "all"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Semua ({totalKaryaCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("pending")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        filterTab === "pending"
                          ? "bg-amber-100 text-amber-900 shadow-xs border border-amber-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Menunggu ({pendingKaryaCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("approved")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "approved"
                          ? "bg-emerald-100 text-emerald-900 shadow-xs border border-emerald-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Tervalidasi ({approvedKaryaCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("rejected")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        filterTab === "rejected"
                          ? "bg-rose-100 text-rose-900 shadow-xs border border-rose-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      Perlu Revisi ({rejectedKaryaCount})
                    </button>
                  </div>

                  {/* Jurusan Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={jurusanFilter}
                      onChange={(e) => setJurusanFilter(e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="all">Semua Jurusan</option>
                      {jurusanOptions.map((j) => (
                        <option key={j} value={j}>
                          Jurusan {j}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submissions List */}
                {filteredKaryaItems.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">
                      Tidak ada pengajuan karya inovasi yang sesuai kriteria filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterTab("all");
                        setJurusanFilter("all");
                        setSearchQuery("");
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Reset Filter & Pencarian
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredKaryaItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all space-y-4"
                      >
                        {/* Top: Guru Info & Status Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                              <Image
                                src={item.guruAvatar}
                                alt={item.guruName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {item.guruName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                  {item.guruJurusan}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                NIP: {item.guruNip} • {item.guruEmail}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.status === "approved" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Tervalidasi
                              </span>
                            ) : item.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                Perlu Revisi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Menunggu Validasi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mid: Karya Details */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {item.title}
                            </h3>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                              {item.category}
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              Tahun {item.year}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>

                          {item.linkUrl && (
                            <div className="pt-1">
                              <a
                                href={item.linkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Akses Dokumen / Tautan Karya</span>
                              </a>
                            </div>
                          )}

                          {item.status === "rejected" && item.statusNote && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mt-2">
                              <span className="font-bold block mb-0.5">Catatan Revisi dari Admin:</span>
                              <p>{item.statusNote}</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom: Verifier Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGuruId(item.guruId);
                              setActiveSideMenu("guru");
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Buka Portofolio Lengkap Pendidik</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {canVerifyKarya ? (
                              <>
                                {item.status !== "approved" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemApprove(
                                        item.guruId,
                                        item.guruName,
                                        "karya",
                                        item.id,
                                        item.title
                                      )
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Setujui</span>
                                  </button>
                                )}

                                {item.status !== "rejected" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRejectItemTarget({
                                        guruId: item.guruId,
                                        guruName: item.guruName,
                                        itemType: "karya",
                                        itemId: item.id,
                                        itemTitle: item.title,
                                      })
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Minta Revisi</span>
                                  </button>
                                )}

                                {item.status !== "pending" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleItemResetPending(
                                        item.guruId,
                                        item.guruName,
                                        "karya",
                                        item.id,
                                        item.title
                                      )
                                    }
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Kembalikan status ke Pending"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Reset Pending</span>
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium flex items-center gap-1.5 border border-slate-200">
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>Khusus Verifikator Karya</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. VIEW PROFIL PENDIDIK */}
            {activeSideMenu === "guru" && (
              <div className="p-6 lg:p-8 space-y-6">
                {/* Header Pemilih Pendidik */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Pilih Pendidik yang Ditinjau:</span>
                    <select
                      value={selectedGuruId}
                      onChange={(e) => setSelectedGuruId(e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {filteredGurus.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g.jurusan}) — {g.validationStatus === "approved" ? "✓ Tervalidasi" : g.validationStatus === "rejected" ? "✗ Revisi" : "⏳ Pending"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Menampilkan <strong>{filteredGurus.length}</strong> dari {guruProfiles.length} guru</span>
                  </div>
                </div>

                {selectedGuru ? (
                  <div className="space-y-6">
                    {/* Header Kartu Profil Guru */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <Image
                      src={selectedGuru.avatarUrl}
                      alt={selectedGuru.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {selectedGuru.name}
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-[#2563EB]">
                        {selectedGuru.jurusan}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      {selectedGuru.email} • NIP: {selectedGuru.nuptkOrNip}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedGuru.mapel}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Status Portofolio
                  </span>
                  {selectedGuru.validationStatus === "approved" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tervalidasi (Tayang di Web)
                    </span>
                  ) : selectedGuru.validationStatus === "pending" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      Menunggu Validasi Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Perlu Revisi
                    </span>
                  )}
                </div>
              </div>

              {/* Bio & Catatan Validasi Terakhir Jika Ada */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Bio & Dedikasi
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedGuru.bio}
                </p>

                {selectedGuru.validationNote && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="font-bold block mb-0.5">Catatan Revisi Terakhir:</span>
                    <p>{selectedGuru.validationNote}</p>
                  </div>
                )}
              </div>

              {/* Notifikasi Scope Verifikator Jika Bukan Super Admin */}
              {currentAdminScope !== "all" && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">
                      Wewenang Verifikasi: {currentScopeMeta.label}
                    </span>
                    <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                      Anda berwenang memvalidasi pengajuan pada kategori <strong>{currentScopeMeta.shortLabel}</strong>. Kategori lainnya berstatus terkunci dan hanya dapat diproses oleh Verifikator bidang terkait atau Super Admin Penjamin Mutu.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Bar Portofolio Keseluruhan */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Tombol Setujui Portofolio */}
                  <button
                    type="button"
                    onClick={() => handleApprovePortfolio(selectedGuru.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title={
                      isSuperAdmin || currentAdminScope === "all"
                        ? "Sahkan portofolio guru ke status Approved"
                        : "Sahkan portofolio bidang " + currentScopeMeta.shortLabel
                    }
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isSuperAdmin || currentAdminScope === "all"
                        ? "Sahkan Portofolio (Approved)"
                        : `Sahkan Bidang ${currentScopeMeta.shortLabel}`}
                    </span>
                  </button>

                  {/* Tombol Tolak / Revisi */}
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(!showRejectInput)}
                    className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Minta Revisi</span>
                  </button>

                  {/* Reset Pending */}
                  <button
                    type="button"
                    onClick={() => handleResetPortfolioToPending(selectedGuru.id)}
                    className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Kembalikan ke status Pending"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Set Pending</span>
                  </button>
                </div>

                {/* Batch Approve Items Sesuai Scope Wewenang */}
                <button
                  type="button"
                  onClick={handleApproveAllItems}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title={`Verifikasi semua item ${currentScopeMeta.shortLabel}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {currentAdminScope === "all"
                      ? "Verifikasi Semua Item (Seluruh Bidang)"
                      : `Verifikasi Semua ${currentScopeMeta.shortLabel}`}
                  </span>
                </button>
              </div>

              {/* Form Input Alasan Penolakan Keseluruhan Portofolio */}
              {showRejectInput && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Catatan Revisi untuk Guru ({selectedGuru.name})</span>
                  </div>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Tuliskan perbaikan yang harus dilengkapi guru (contoh: 'Mohon upload bukti scan sertifikat resmi BNSP')..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-rose-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectPortfolioSubmit(selectedGuru.id)}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Permintaan Revisi</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Detail 3 Tab/Seksi Item: Prestasi, Sertifikasi, Karya */}
              <div className="space-y-6">
                {/* 1. Seksi Prestasi */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Prestasi & Penghargaan ({selectedGuru.prestasiList.length})</span>
                    </h4>
                    {canVerifyPrestasi ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Wewenang Anda
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Khusus Verifikator Prestasi
                      </span>
                    )}
                  </div>

                  {selectedGuru.prestasiList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Guru belum menambahkan data prestasi.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedGuru.prestasiList.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
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
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Tautan File: {item.certificateUrl}</span>
                              </a>
                            )}
                            {item.statusNote && (
                              <p className="text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                                Catatan revisi: {item.statusNote}
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

                            {/* Tombol Aksi Item Sesuai Wewenang */}
                            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                              {canVerifyPrestasi ? (
                                <>
                                  {item.status !== "approved" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleItemApprove(
                                          selectedGuru.id,
                                          selectedGuru.name,
                                          "prestasi",
                                          item.id,
                                          item.title
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                                      title="Verifikasi Prestasi Ini"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {item.status !== "rejected" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRejectItemTarget({
                                          guruId: selectedGuru.id,
                                          guruName: selectedGuru.name,
                                          itemType: "prestasi",
                                          itemId: item.id,
                                          itemTitle: item.title,
                                        })
                                      }
                                      className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                                      title="Tolak / Minta Revisi Prestasi Ini"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {item.status !== "pending" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleItemResetPending(
                                          selectedGuru.id,
                                          selectedGuru.name,
                                          "prestasi",
                                          item.id,
                                          item.title
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                                      title="Kembalikan ke Pending"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span
                                  className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium flex items-center gap-1 border border-slate-200"
                                  title="Khusus Admin Verifikator Prestasi atau Super Admin"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Khusus Prestasi</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Seksi Sertifikasi */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <FileBadge className="w-4 h-4 text-blue-500" />
                      <span>Sertifikasi Kompetensi ({selectedGuru.sertifikasiList.length})</span>
                    </h4>
                    {canVerifySertifikasi ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Wewenang Anda
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Khusus Verifikator Sertifikasi
                      </span>
                    )}
                  </div>

                  {selectedGuru.sertifikasiList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Guru belum menambahkan data sertifikasi.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedGuru.sertifikasiList.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
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
                                No. Registrasi/Lisensi: {item.credentialId}
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
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Tautan File: {item.certificateUrl}</span>
                              </a>
                            )}
                            {item.statusNote && (
                              <p className="text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                                Catatan revisi: {item.statusNote}
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

                            {/* Tombol Aksi Item Sesuai Wewenang */}
                            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                              {canVerifySertifikasi ? (
                                <>
                                  {item.status !== "approved" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleItemApprove(
                                          selectedGuru.id,
                                          selectedGuru.name,
                                          "sertifikasi",
                                          item.id,
                                          item.name
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                                      title="Verifikasi Sertifikasi Ini"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {item.status !== "rejected" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRejectItemTarget({
                                          guruId: selectedGuru.id,
                                          guruName: selectedGuru.name,
                                          itemType: "sertifikasi",
                                          itemId: item.id,
                                          itemTitle: item.name,
                                        })
                                      }
                                      className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                                      title="Tolak / Minta Revisi Sertifikasi Ini"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {item.status !== "pending" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleItemResetPending(
                                          selectedGuru.id,
                                          selectedGuru.name,
                                          "sertifikasi",
                                          item.id,
                                          item.name
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                                      title="Kembalikan ke Pending"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span
                                  className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium flex items-center gap-1 border border-slate-200"
                                  title="Khusus Admin Verifikator Sertifikasi atau Super Admin"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Khusus Sertifikasi</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Seksi Karya & Inovasi */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>Karya Inovasi & Modul ({selectedGuru.karyaList.length})</span>
                    </h4>
                    {canVerifyKarya ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Wewenang Anda
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Khusus Verifikator Karya
                      </span>
                    )}
                  </div>

                  {selectedGuru.karyaList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Guru belum menambahkan data karya pembelajaran.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedGuru.karyaList.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
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
                                className="text-[#2563EB] hover:underline flex items-center gap-1 text-[11px] font-semibold mt-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Tautan File: {item.linkUrl}</span>
                              </a>
                            )}
                            {item.statusNote && (
                              <p className="text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                                Catatan revisi: {item.statusNote}
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

                            {/* Tombol Aksi Item Sesuai Wewenang */}
                            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                              {canVerifyKarya ? (
                                <>
                                  {item.status !== "approved" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleItemApprove(
                                          selectedGuru.id,
                                          selectedGuru.name,
                                          "karya",
                                          item.id,
                                          item.title
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                                      title="Verifikasi Karya Ini"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {item.status !== "rejected" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRejectItemTarget({
                                          guruId: selectedGuru.id,
                                          guruName: selectedGuru.name,
                                          itemType: "karya",
                                          itemId: item.id,
                                          itemTitle: item.title,
                                        })
                                      }
                                      className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                                      title="Tolak / Minta Revisi Karya Ini"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {item.status !== "pending" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleItemResetPending(
                                          selectedGuru.id,
                                          selectedGuru.name,
                                          "karya",
                                          item.id,
                                          item.title
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                                      title="Kembalikan ke Pending"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span
                                  className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium flex items-center gap-1 border border-slate-200"
                                  title="Khusus Admin Verifikator Karya atau Super Admin"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Khusus Karya</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
                  <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <Users className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm font-semibold">Pilih salah satu guru untuk memulai peninjauan profil.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog Input Alasan Penolakan Satuan Item */}
      {rejectItemTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-800">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">
                Tolak / Minta Revisi {rejectItemTarget.itemType.toUpperCase()}
              </h4>
            </div>

            <p className="text-xs text-slate-600">
              Pengajuan: <strong>&ldquo;{rejectItemTarget.itemTitle}&rdquo;</strong> milik {rejectItemTarget.guruName || selectedGuru?.name || "Guru"}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Revisi untuk Guru (Wajib diisi):
              </label>
              <textarea
                value={itemRejectNote}
                onChange={(e) => setItemRejectNote(e.target.value)}
                placeholder="Contoh: 'Tolong cantumkan scan sertifikat resmi berstempel basah'..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectItemTarget(null);
                  setItemRejectNote("");
                }}
                className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleItemRejectSubmit}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Catatan & Tolak</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola Tim Verifikator (Prestasi, Sertifikasi, Karya) */}
      {showVerifikatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Kelola Tim Verifikator Portofolio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur pembagian tugas admin untuk verifikasi Prestasi, Sertifikasi, dan Karya Guru.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowVerifikatorModal(false);
                  setAdminFormError("");
                  setAdminFormSuccess("");
                }}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 bg-white">
              <button
                type="button"
                onClick={() => {
                  setAdminModalTab("list");
                  setAdminFormError("");
                  setAdminFormSuccess("");
                }}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminModalTab === "list"
                    ? "border-amber-500 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Daftar Tim ({adminValidators.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminModalTab("add");
                  setAdminFormError("");
                  setAdminFormSuccess("");
                }}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminModalTab === "add"
                    ? "border-amber-500 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Tambah Verifikator Baru</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
              {adminModalTab === "list" ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Verifikator login menggunakan akun Google Workspace sekolah (<strong>@smktelkom-mlg.sch.id</strong>) dan hanya dapat memvalidasi item sesuai bidang yang ditetapkan.
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {adminValidators.map((admin) => {
                      const meta = getScopeMeta(admin.scope);
                      const isSuperAdminUser = admin.email.toLowerCase() === "chusni@smktelkom-mlg.sch.id";
                      const isCurrentlyActiveUser = currentUser?.email.toLowerCase() === admin.email.toLowerCase();

                      return (
                        <div
                          key={admin.id}
                          className={`p-4 rounded-2xl border bg-white shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isCurrentlyActiveUser
                              ? "border-amber-400 ring-2 ring-amber-400/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900">
                                {admin.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${meta.badgeLight}`}
                              >
                                <meta.icon className="w-3 h-3" />
                                <span>{meta.label}</span>
                              </span>
                              {isCurrentlyActiveUser && (
                                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                  Akun Anda Saat Ini
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 font-mono">
                              {admin.email}
                              {admin.nuptkOrNip && ` • NIP: ${admin.nuptkOrNip}`}
                            </p>

                            <p className="text-[11px] text-slate-600">
                              <span className="font-medium text-slate-700">{admin.roleTitle}</span>
                              <span className="text-slate-400"> — {meta.description}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {/* Tombol Coba Masuk / Beralih */}
                            <button
                              type="button"
                              onClick={() => {
                                login(admin.email);
                                setSuccessToast(`Beralih ke akun ${admin.name} (${meta.label})`);
                                setTimeout(() => setSuccessToast(""), 3500);
                              }}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isCurrentlyActiveUser
                                  ? "bg-amber-100 text-amber-800 border border-amber-300 cursor-default"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                            >
                              {isCurrentlyActiveUser ? "Aktif Saat Ini" : "Coba Akun Ini"}
                            </button>

                            {/* Status Toggle Aktif/Nonaktif */}
                            <button
                              type="button"
                              disabled={isSuperAdminUser}
                              onClick={() => toggleAdminValidatorStatus(admin.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isSuperAdminUser
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : admin.isActive
                                  ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 cursor-pointer"
                                  : "bg-slate-200 hover:bg-slate-300 text-slate-600 cursor-pointer"
                              }`}
                              title={
                                isSuperAdminUser
                                  ? "Super Admin Utama tidak dapat dinonaktifkan"
                                  : "Klik untuk ubah status aktif/nonaktif"
                              }
                            >
                              {admin.isActive ? "Aktif" : "Nonaktif"}
                            </button>

                            {/* Tombol Hapus (Dilindungi untuk Chusni) */}
                            {!isSuperAdminUser && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Apakah Anda yakin ingin menghapus hak admin verifikator untuk ${admin.name}?`
                                    )
                                  ) {
                                    const res = removeAdminValidator(admin.id);
                                    if (res.success) {
                                      setSuccessToast(res.message);
                                      setTimeout(() => setSuccessToast(""), 3500);
                                    }
                                  }
                                }}
                                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Hapus Admin Ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Tab Form Tambah Verifikator Baru */
                <form onSubmit={handleAddAdminSubmit} className="space-y-4">
                  {adminFormError && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{adminFormError}</span>
                    </div>
                  )}

                  {adminFormSuccess && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{adminFormSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Contoh: Dra. Siti Aminah, M.Pd"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Google Workspace (@smktelkom-mlg.sch.id) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="contoh_guru@smktelkom-mlg.sch.id"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Wajib domain resmi sekolah: @smktelkom-mlg.sch.id
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIP (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newAdminNup}
                        onChange={(e) => setNewAdminNup(e.target.value)}
                        placeholder="198204152008011005"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jabatan / Posisi Penugasan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newAdminRoleTitle}
                        onChange={(e) => setNewAdminRoleTitle(e.target.value)}
                        placeholder="Contoh: Tim Penilai Prestasi Siswa & Guru"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Pilihan Scope Verifikasi (Radio Cards Interaktif) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Pilih Hak Akses & Kategori Verifikasi <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 1. Scope Prestasi */}
                      <button
                        type="button"
                        onClick={() => setNewAdminScope("prestasi")}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          newAdminScope === "prestasi"
                            ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Verifikator Prestasi
                            </span>
                            <span className="text-[10px] text-amber-700 font-semibold">
                              Kategori: Prestasi & Penghargaan
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Memvalidasi kejuaraan, medali lomba, penghargaan kedinasan & pembimbingan lomba.
                        </p>
                      </button>

                      {/* 2. Scope Sertifikasi */}
                      <button
                        type="button"
                        onClick={() => setNewAdminScope("sertifikasi")}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          newAdminScope === "sertifikasi"
                            ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                            <FileBadge className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Verifikator Sertifikasi
                            </span>
                            <span className="text-[10px] text-blue-700 font-semibold">
                              Kategori: Sertifikasi Profesi & BNSP
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Memvalidasi sertifikat kompetensi LSP/BNSP, lisensi industri (Cisco, Google, AWS, dll).
                        </p>
                      </button>

                      {/* 3. Scope Karya */}
                      <button
                        type="button"
                        onClick={() => setNewAdminScope("karya")}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          newAdminScope === "karya"
                            ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Verifikator Karya & Modul
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              Kategori: Karya Inovasi & Modul Ajar
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Memvalidasi modul ajar, inovasi media pembelajaran, aplikasi perangkat lunak, & jurnal.
                        </p>
                      </button>

                      {/* 4. Scope All (Super Admin) */}
                      <button
                        type="button"
                        onClick={() => setNewAdminScope("all")}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          newAdminScope === "all"
                            ? "border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Super Admin Penjamin Mutu
                            </span>
                            <span className="text-[10px] text-purple-700 font-semibold">
                              Semua Bidang & Pengesahan Sekolah
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Wewenang penuh semua bidang dan mengesahkan status portofolio guru sekolah.
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminModalTab("list");
                        setAdminFormError("");
                        setAdminFormSuccess("");
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Simpan & Daftarkan Verifikator</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

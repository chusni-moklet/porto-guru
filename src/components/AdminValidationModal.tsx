"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  FileBadge,
  AlertCircle,
  Check,
  RotateCcw,
  Send,
  ExternalLink,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { GuruProfile } from "@/types/porto-guru";

interface AdminValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTeacherProfile?: (guru: GuruProfile) => void;
}

export default function AdminValidationModal({
  isOpen,
  onClose,
}: AdminValidationModalProps) {
  const { guruProfiles, validatePortfolio, validateItem } = usePortoGuru();

  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    guruProfiles.find((g) => g.validationStatus === "pending")?.id ||
      guruProfiles[0]?.id ||
      ""
  );

  const [rejectNote, setRejectNote] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Item rejection modal state
  const [rejectItemTarget, setRejectItemTarget] = useState<{
    itemType: "prestasi" | "sertifikasi" | "karya";
    itemId: string;
    itemTitle: string;
  } | null>(null);
  const [itemRejectNote, setItemRejectNote] = useState("");

  if (!isOpen) return null;

  const selectedGuru =
    guruProfiles.find((g) => g.id === selectedGuruId) || guruProfiles[0];

  const handleApprovePortfolio = (guruId: string) => {
    validatePortfolio(guruId, "approved");
    setShowRejectInput(false);
    setSuccessToast(
      `Portofolio ${selectedGuru?.name} BERHASIL diverifikasi! Notifikasi terverifikasi telah dikirim ke akun guru.`
    );
    setTimeout(() => setSuccessToast(""), 4500);
  };

  const handleRejectPortfolio = (guruId: string) => {
    if (!rejectNote.trim()) {
      alert("Mohon masukkan catatan revisi untuk guru yang bersangkutan.");
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

  // Individual item actions
  const handleItemApprove = (
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    itemTitle: string
  ) => {
    validateItem(selectedGuru.id, itemType, itemId, "approved");
    setSuccessToast(
      `Pengajuan "${itemTitle}" BERHASIL diverifikasi! Notifikasi telah dikirim ke ${selectedGuru.name}.`
    );
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const handleItemRejectSubmit = () => {
    if (!rejectItemTarget) return;
    if (!itemRejectNote.trim()) {
      alert("Mohon isi alasan penolakan / catatan revisi untuk guru.");
      return;
    }
    validateItem(
      selectedGuru.id,
      rejectItemTarget.itemType,
      rejectItemTarget.itemId,
      "rejected",
      itemRejectNote.trim()
    );
    setSuccessToast(
      `Pengajuan "${rejectItemTarget.itemTitle}" DITOLAK. Catatan revisi telah dikirim ke akun ${selectedGuru.name}.`
    );
    setRejectItemTarget(null);
    setItemRejectNote("");
    setTimeout(() => setSuccessToast(""), 4500);
  };

  const handleItemResetPending = (
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    itemTitle: string
  ) => {
    validateItem(selectedGuru.id, itemType, itemId, "pending");
    setSuccessToast(`Status "${itemTitle}" dikembalikan ke PENDING.`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleApproveAllItems = () => {
    selectedGuru.prestasiList.forEach((p) => {
      if (p.status !== "approved") {
        validateItem(selectedGuru.id, "prestasi", p.id, "approved");
      }
    });
    selectedGuru.sertifikasiList.forEach((s) => {
      if (s.status !== "approved") {
        validateItem(selectedGuru.id, "sertifikasi", s.id, "approved");
      }
    });
    selectedGuru.karyaList.forEach((k) => {
      if (k.status !== "approved") {
        validateItem(selectedGuru.id, "karya", k.id, "approved");
      }
    });
    setSuccessToast(`Seluruh prestasi, sertifikasi, dan karya ${selectedGuru.name} berhasil diverifikasi!`);
    setTimeout(() => setSuccessToast(""), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-amber-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Panel Admin Penjamin Mutu
              </span>
              <span className="text-xs font-medium text-amber-200 font-mono">
                chusni@smktelkom-mlg.sch.id
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1">
              Verifikasi & Validasi Portofolio Pendidik
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              Kelola status <strong>Pending</strong>, <strong>Terverifikasi</strong>, atau <strong>Ditolak</strong> untuk setiap prestasi, sertifikasi, dan karya guru.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="p-3.5 bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 px-6 shrink-0 transition-all">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Main Content (Split view: Left list, Right preview & action) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Teacher List */}
          <div className="w-full lg:w-80 border-r border-slate-200 bg-slate-50/80 p-4 overflow-y-auto space-y-2 shrink-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center justify-between">
              <span>Daftar Guru Terdaftar</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {guruProfiles.length}
              </span>
            </div>

            {guruProfiles.map((guru) => {
              const isSelected = guru.id === selectedGuruId;
              const hasPendingItems = [
                ...guru.prestasiList,
                ...guru.sertifikasiList,
                ...guru.karyaList,
              ].some((i) => i.status === "pending");

              return (
                <button
                  key={guru.id}
                  onClick={() => {
                    setSelectedGuruId(guru.id);
                    setShowRejectInput(false);
                    setRejectItemTarget(null);
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]/20"
                      : "bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={guru.avatarUrl}
                      alt={guru.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {guru.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate font-mono">
                        {guru.email}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">
                      {guru.jurusan} • {guru.prestasiList.length} Pr / {guru.karyaList.length} Kr
                    </span>
                    {hasPendingItems ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        Ada Pending
                      </span>
                    ) : guru.validationStatus === "approved" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Tervalidasi
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        Revisi
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Inspection & Actions */}
          {selectedGuru ? (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Profile Card Summary */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedGuru.avatarUrl}
                    alt={selectedGuru.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900">
                        {selectedGuru.name}
                      </h4>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-[#2563EB]">
                        {selectedGuru.jurusan}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-mono">
                      {selectedGuru.email} • NIP: {selectedGuru.nuptkOrNip}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedGuru.mapel}
                    </p>
                  </div>
                </div>

                <div className="text-right">
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

              {/* Quick Batch Action */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-blue-900 block">
                    Aksi Verifikasi Cepat
                  </span>
                  <span className="text-blue-700 text-[11px]">
                    Verifikasi seluruh pengajuan item yang berstatus pending milik guru ini sekaligus.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApproveAllItems}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verifikasi Semua Item</span>
                </button>
              </div>

              {/* 3 Sections: Prestasi, Sertifikasi, Karya with Individual Action Controls */}
              <div className="space-y-5">
                {/* 1. Prestasi List */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Prestasi & Penghargaan ({selectedGuru.prestasiList.length})
                    </h5>
                  </div>

                  {selectedGuru.prestasiList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Guru belum menambahkan prestasi.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedGuru.prestasiList.map((p) => {
                        const isPending = p.status === "pending";
                        const isApproved = p.status === "approved";
                        const isRejected = p.status === "rejected";

                        return (
                          <div
                            key={p.id}
                            className={`p-3.5 rounded-xl border text-xs transition-all ${
                              isPending
                                ? "bg-amber-50/50 border-amber-200"
                                : isApproved
                                ? "bg-slate-50 border-slate-200"
                                : "bg-rose-50/50 border-rose-200"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {p.title}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                                    {p.level} • {p.year}
                                  </span>

                                  {isPending && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      Pending
                                    </span>
                                  )}

                                  {isApproved && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Terverifikasi
                                    </span>
                                  )}

                                  {isRejected && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      Ditolak
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-600 mt-1 text-[11px]">
                                  Penyelenggara: {p.organizer} {p.description && `• ${p.description}`}
                                </p>
                                {p.certificateUrl && (
                                  <a
                                    href={p.certificateUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-0.5"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Tautan File: {p.certificateUrl}</span>
                                  </a>
                                )}
                                {isRejected && p.statusNote && (
                                  <p className="text-rose-700 text-[11px] mt-1 font-semibold italic">
                                    Catatan: &ldquo;{p.statusNote}&rdquo;
                                  </p>
                                )}
                              </div>

                              {/* Action Buttons for this Prestasi */}
                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                {!isApproved && (
                                  <button
                                    type="button"
                                    onClick={() => handleItemApprove("prestasi", p.id, p.title)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Verifikasi Prestasi ini"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Verifikasi</span>
                                  </button>
                                )}

                                {!isRejected && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectItemTarget({
                                        itemType: "prestasi",
                                        itemId: p.id,
                                        itemTitle: p.title,
                                      });
                                      setItemRejectNote(
                                        "Mohon lampirkan scan sertifikat kejuaraan resmi berstempel panitia."
                                      );
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Tolak & Minta Revisi"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Tolak</span>
                                  </button>
                                )}

                                {!isPending && (
                                  <button
                                    type="button"
                                    onClick={() => handleItemResetPending("prestasi", p.id, p.title)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                                    title="Kembalikan ke antrean Pending"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Sertifikasi List */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <FileBadge className="w-4 h-4 text-blue-600" />
                      Sertifikasi Kompetensi ({selectedGuru.sertifikasiList.length})
                    </h5>
                  </div>

                  {selectedGuru.sertifikasiList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Guru belum menambahkan sertifikasi.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedGuru.sertifikasiList.map((s) => {
                        const isPending = s.status === "pending";
                        const isApproved = s.status === "approved";
                        const isRejected = s.status === "rejected";

                        return (
                          <div
                            key={s.id}
                            className={`p-3.5 rounded-xl border text-xs transition-all ${
                              isPending
                                ? "bg-amber-50/50 border-amber-200"
                                : isApproved
                                ? "bg-slate-50 border-slate-200"
                                : "bg-rose-50/50 border-rose-200"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {s.name}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                                    Tahun {s.year}
                                  </span>

                                  {isPending && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      Pending
                                    </span>
                                  )}

                                  {isApproved && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Terverifikasi
                                    </span>
                                  )}

                                  {isRejected && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      Ditolak
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-600 mt-1 text-[11px]">
                                  Penerbit: {s.issuer} {s.credentialId && `• ID: ${s.credentialId}`}
                                </p>
                                {s.description && (
                                  <p className="text-slate-600 mt-0.5 text-[11px]">{s.description}</p>
                                )}
                                {s.certificateUrl && (
                                  <a
                                    href={s.certificateUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:underline mt-0.5"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Tautan File: {s.certificateUrl}</span>
                                  </a>
                                )}
                                {isRejected && s.statusNote && (
                                  <p className="text-rose-700 text-[11px] mt-1 font-semibold italic">
                                    Catatan: &ldquo;{s.statusNote}&rdquo;
                                  </p>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                {!isApproved && (
                                  <button
                                    type="button"
                                    onClick={() => handleItemApprove("sertifikasi", s.id, s.name)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Verifikasi</span>
                                  </button>
                                )}

                                {!isRejected && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectItemTarget({
                                        itemType: "sertifikasi",
                                        itemId: s.id,
                                        itemTitle: s.name,
                                      });
                                      setItemRejectNote(
                                        "Mohon cantumkan nomor lisensi kredensial resmi dan masa berlaku."
                                      );
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Tolak</span>
                                  </button>
                                )}

                                {!isPending && (
                                  <button
                                    type="button"
                                    onClick={() => handleItemResetPending("sertifikasi", s.id, s.name)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Karya List */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Karya & Inovasi Pembelajaran ({selectedGuru.karyaList.length})
                    </h5>
                  </div>

                  {selectedGuru.karyaList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Guru belum menambahkan karya inovasi.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedGuru.karyaList.map((k) => {
                        const isPending = k.status === "pending";
                        const isApproved = k.status === "approved";
                        const isRejected = k.status === "rejected";

                        return (
                          <div
                            key={k.id}
                            className={`p-3.5 rounded-xl border text-xs transition-all ${
                              isPending
                                ? "bg-amber-50/50 border-amber-200"
                                : isApproved
                                ? "bg-slate-50 border-slate-200"
                                : "bg-rose-50/50 border-rose-200"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {k.title}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                                    {k.category} • {k.year}
                                  </span>

                                  {isPending && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      Pending
                                    </span>
                                  )}

                                  {isApproved && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Terverifikasi
                                    </span>
                                  )}

                                  {isRejected && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      Ditolak
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-600 mt-1 text-[11px]">
                                  {k.description}
                                </p>
                                {k.linkUrl && (
                                  <a
                                    href={k.linkUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#2563EB] hover:underline text-[11px] mt-0.5 inline-flex items-center gap-1 font-semibold"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Tautan File: {k.linkUrl}</span>
                                  </a>
                                )}
                                {isRejected && k.statusNote && (
                                  <p className="text-rose-700 text-[11px] mt-1 font-semibold italic">
                                    Catatan: &ldquo;{k.statusNote}&rdquo;
                                  </p>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                {!isApproved && (
                                  <button
                                    type="button"
                                    onClick={() => handleItemApprove("karya", k.id, k.title)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Verifikasi</span>
                                  </button>
                                )}

                                {!isRejected && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectItemTarget({
                                        itemType: "karya",
                                        itemId: k.id,
                                        itemTitle: k.title,
                                      });
                                      setItemRejectNote(
                                        "Tautan dokumen karya belum dapat diakses secara publik."
                                      );
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Tolak</span>
                                  </button>
                                )}

                                {!isPending && (
                                  <button
                                    type="button"
                                    onClick={() => handleItemResetPending("karya", k.id, k.title)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BAR VALIDASI KESELURUHAN OLEH ADMIN CHUSNI */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Validasi Keseluruhan Status Portofolio Pendidik
                </span>

                {showRejectInput ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                    <label className="block text-xs font-bold text-rose-900">
                      Tuliskan Catatan Revisi Menyeluruh untuk {selectedGuru.name}:
                    </label>
                    <textarea
                      rows={2}
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Contoh: Mohon lengkapi bukti scan sertifikat BNSP dan perbaiki tautan berkas modul inovasi..."
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectPortfolio(selectedGuru.id)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Permintaan Revisi Portofolio</span>
                      </button>
                      <button
                        onClick={() => setShowRejectInput(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-300"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Tombol Validasi / Terima */}
                    <button
                      onClick={() => handleApprovePortfolio(selectedGuru.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Validasi & Terbitkan ke Daftar Guru</span>
                    </button>

                    {/* Tombol Minta Revisi */}
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Minta Revisi Portofolio</span>
                    </button>

                    {/* Tombol Reset to Pending */}
                    {selectedGuru.validationStatus === "approved" && (
                      <button
                        onClick={() => handleResetPortfolioToPending(selectedGuru.id)}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Tarik kembali dari publik untuk ditinjau ulang"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Tarik Validasi (Set Pending)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 p-8">
              Pilih guru dari daftar di sebelah kiri untuk meninjau.
            </div>
          )}
        </div>

        {/* Modal Dialog for Rejecting Specific Item */}
        {rejectItemTarget && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <XCircle className="w-5 h-5" />
                  <span>Tolak Pengajuan & Beri Catatan Revisi</span>
                </div>
                <button
                  onClick={() => setRejectItemTarget(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Target Pengajuan:
                </span>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  &ldquo;{rejectItemTarget.itemTitle}&rdquo;
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  Kategori: {rejectItemTarget.itemType} • Akun: {selectedGuru.name}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Alasan Penolakan untuk Guru:
                </label>
                <textarea
                  rows={3}
                  value={itemRejectNote}
                  onChange={(e) => setItemRejectNote(e.target.value)}
                  placeholder="Jelaskan alasan penolakan atau dokumen yang harus diperbaiki..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Quick note suggestion chips */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Saran Catatan Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setItemRejectNote(
                        "Scan dokumen sertifikat belum jelas/buram, mohon unggah ulang versi jelas."
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md cursor-pointer"
                  >
                    Scan buram
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setItemRejectNote(
                        "Mohon sertakan surat tugas resmi dan tanda tangan kepala sekolah/panitia."
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md cursor-pointer"
                  >
                    Perlu stempel/tanda tangan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setItemRejectNote(
                        "Tautan modul ajar/karya belum disetel ke publik sehingga tidak dapat ditinjau."
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md cursor-pointer"
                  >
                    Tautan berkas privat
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectItemTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleItemRejectSubmit}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Penolakan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

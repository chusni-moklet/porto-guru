"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Award,
  FileBadge,
  BookOpen,
  FolderKanban,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { usePortoGuru } from "@/context/PortoGuruContext";
import { NotificationType, GuruNotification } from "@/types/porto-guru";

interface NotificationDropdownProps {
  onOpenDashboardTab?: (tab: "profil" | "prestasi" | "sertifikasi" | "karya" | "status" | "notifikasi") => void;
}

export default function NotificationDropdown({
  onOpenDashboardTab,
}: NotificationDropdownProps) {
  const {
    currentUser,
    userNotifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = usePortoGuru();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | NotificationType>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!currentUser || currentUser.role !== "guru") {
    return null;
  }

  const filteredNotifications = userNotifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const countPending = userNotifications.filter((n) => n.type === "pending").length;
  const countVerified = userNotifications.filter((n) => n.type === "verified").length;
  const countRejected = userNotifications.filter((n) => n.type === "rejected").length;

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 2) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Baru saja";
    }
  };

  const handleItemClick = (notif: GuruNotification) => {
    markNotificationAsRead(notif.id);
    if (onOpenDashboardTab) {
      if (notif.itemType === "prestasi") onOpenDashboardTab("prestasi");
      else if (notif.itemType === "sertifikasi") onOpenDashboardTab("sertifikasi");
      else if (notif.itemType === "karya") onOpenDashboardTab("karya");
      else onOpenDashboardTab("status");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
          isOpen
            ? "bg-blue-50 border-blue-300 text-[#2563EB]"
            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
        }`}
        title="Notifikasi Pengajuan Portofolio"
        aria-label="Buka Notifikasi Portofolio"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge Counter */}
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 min-w-[20px] h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center shadow-md animate-pulse border-2 border-white">
            {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">
                  Notifikasi Pengajuan
                </h4>
                <p className="text-[11px] text-slate-300">
                  {unreadNotificationCount > 0
                    ? `${unreadNotificationCount} pengajuan belum dibaca`
                    : "Semua status telah dibaca"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {currentUser.guruId && unreadNotificationCount > 0 && (
                <button
                  onClick={() => markAllNotificationsAsRead(currentUser.guruId!)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Tandai semua sudah dibaca"
                >
                  <Check className="w-3 h-3" />
                  <span>Baca Semua</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                filter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Semua ({userNotifications.length})
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                filter === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending ({countPending})</span>
            </button>

            <button
              onClick={() => setFilter("verified")}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                filter === "verified"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Terverifikasi ({countVerified})</span>
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                filter === "rejected"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Ditolak ({countRejected})</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-600">
                  Tidak ada notifikasi dalam filter ini.
                </p>
                <p className="text-[11px] text-slate-400">
                  Pengajuan prestasi, sertifikasi, atau karya baru akan muncul di sini.
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
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
                      !notif.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* Unread Dot */}
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-3.5 right-3.5" />
                    )}

                    {/* Icon Status */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isPending
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : isVerified
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-rose-100 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isPending ? (
                        <Clock className="w-4 h-4" />
                      ) : isVerified ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isPending
                              ? "bg-amber-100 text-amber-800"
                              : isVerified
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isPending
                            ? "PENDING"
                            : isVerified
                            ? "TERVERIFIKASI"
                            : "DITOLAK"}
                        </span>

                        {/* Item Type Pill */}
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          {notif.itemType === "prestasi" && (
                            <Award className="w-3 h-3 text-amber-500" />
                          )}
                          {notif.itemType === "sertifikasi" && (
                            <FileBadge className="w-3 h-3 text-blue-500" />
                          )}
                          {notif.itemType === "karya" && (
                            <BookOpen className="w-3 h-3 text-emerald-500" />
                          )}
                          {notif.itemType === "portfolio" && (
                            <FolderKanban className="w-3 h-3 text-purple-500" />
                          )}
                          <span className="capitalize">{notif.itemType}</span>
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono ml-auto">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {notif.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                        {notif.message}
                      </p>

                      {/* Catatan Khusus Penolakan dari Admin */}
                      {isRejected && notif.adminNote && (
                        <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-medium">
                          <span className="font-bold block text-rose-800">
                            Catatan Validator:
                          </span>
                          &ldquo;{notif.adminNote}&rdquo;
                        </div>
                      )}

                      <div className="mt-2 flex items-center text-[10px] text-[#2563EB] font-bold">
                        <span>Buka & periksa di Portofolio</span>
                        <ChevronRight className="w-3 h-3 ml-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                if (onOpenDashboardTab) onOpenDashboardTab("notifikasi");
                setIsOpen(false);
              }}
              className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Rekap Seluruh Riwayat Validasi</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {currentUser.guruId && userNotifications.length > 0 && (
              <button
                onClick={() => clearNotifications(currentUser.guruId!)}
                className="text-slate-400 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Hapus riwayat notifikasi"
              >
                <Trash2 className="w-3 h-3" />
                <span>Bersihkan</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

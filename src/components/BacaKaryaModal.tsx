"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Share2,
  Trophy,
  Clock,
  Calendar,
  User,
  Heart,
  MessageSquare,
  ShieldCheck,
  Star,
  Sparkles,
  Check,
  ExternalLink,
} from "lucide-react";
import { KaryaShowcaseItem, KaryaReview, GoogleVisitorUser } from "@/types/karya";
import { GoogleLogo } from "./GoogleVisitorModal";

interface BacaKaryaModalProps {
  isOpen: boolean;
  item: KaryaShowcaseItem | null;
  onClose: () => void;
  likesCount: number;
  isLiked: boolean;
  onLikeClick: () => void;
  reviews: KaryaReview[];
  onAddReview: (review: {
    authorName: string;
    authorEmail: string;
    authorAvatar: string;
    rating: number;
    content: string;
  }) => void;
  googleVisitor: GoogleVisitorUser | null;
  onPromptGoogleLogin: (context: "like" | "comment") => void;
  initialTargetSection?: "content" | "ulasan";
  allItems?: KaryaShowcaseItem[];
  onSelectKarya?: (item: KaryaShowcaseItem) => void;
}

export default function BacaKaryaModal({
  isOpen,
  item,
  onClose,
  likesCount,
  isLiked,
  onLikeClick,
  reviews,
  onAddReview,
  googleVisitor,
  onPromptGoogleLogin,
  initialTargetSection = "content",
  allItems,
  onSelectKarya,
}: BacaKaryaModalProps) {
  // Typography controls
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(1); // 0: A-, 1: A, 2: A+, 3: A++

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentText, setCommentText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const ulasanSectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to ulasan if triggered with ulasan target
  useEffect(() => {
    if (isOpen && initialTargetSection === "ulasan") {
      setTimeout(() => {
        ulasanSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  }, [isOpen, initialTargetSection]);

  if (!isOpen || !item) return null;

  const fontSizes = ["text-sm leading-relaxed", "text-base leading-relaxed", "text-lg leading-loose", "text-xl leading-loose"];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareData = {
        title: item.title,
        text: `${item.title} oleh ${item.author} di PortoGuru SMK Telkom Malang`,
        url: window.location.href,
      };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2000);
      }
    }
  };

  const handleScrollToUlasan = () => {
    ulasanSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    if (!commentText.trim()) {
      setReviewError("Silakan tulis ulasan Anda terlebih dahulu.");
      return;
    }

    // Jika belum login via Google, minta login terlebih dahulu
    if (!googleVisitor) {
      onPromptGoogleLogin("comment");
      return;
    }

    // Kirim ulasan
    onAddReview({
      authorName: googleVisitor.name,
      authorEmail: googleVisitor.email,
      authorAvatar: googleVisitor.avatar,
      rating,
      content: commentText.trim(),
    });

    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* 1. Header dengan Gradient (Sesuai Gambar 3) */}
        <div
          className={`bg-gradient-to-r ${item.headerGradient} p-6 sm:p-8 text-white relative flex-shrink-0`}
        >
          {/* Top Row: Badges & Action Buttons */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Badge 1: Kategori Puisi */}
              <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{item.modalCategoryTag}</span>
              </span>

              {/* Badge 2: Juara / Prestasi */}
              {item.awardFullTag && (
                <span className="bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{item.awardFullTag}</span>
                </span>
              )}
            </div>

            {/* Action Buttons (ExternalLink, Share & Close) */}
            <div className="flex items-center gap-2">
              <Link
                href={`/karya/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black/20 hover:bg-black/35 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="Buka di Halaman Penuh ↗"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full bg-black/20 hover:bg-black/35 text-white backdrop-blur-xs transition-colors cursor-pointer relative"
                title="Bagikan Karya"
              >
                <Share2 className="w-4 h-4" />
                {copiedNotification && (
                  <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                    Tautan disalin!
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-black/20 hover:bg-black/35 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Judul Karya (Serif Elegan Sesuai Gambar 3) */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mt-2 mb-3">
            {item.title}
          </h2>

          {/* Metadata Row: Penulis, Tanggal, Durasi Baca */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-white/80" />
              <span>{item.author.replace(/^Oleh:\s*/i, "")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-white/80" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white/80" />
              <span>{item.modalReadTime}</span>
            </div>
          </div>
        </div>

        {/* 2. Sub-Toolbar: Font Settings & Likes/Comments (Sesuai Gambar 3) */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          {/* Typography Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-slate-500 font-medium">Font:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setFontFamily("serif")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  fontFamily === "serif"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Serif (Klasik)
              </button>
              <button
                type="button"
                onClick={() => setFontFamily("sans")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  fontFamily === "sans"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sans (Modern)
              </button>
            </div>

            <span className="text-slate-300">|</span>

            {/* Font Size A- A A+ A++ */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-serif mr-0.5 font-bold">T</span>
              {(["A-", "A", "A+", "A++"] as const).map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFontSizeIndex(idx)}
                  className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    fontSizeIndex === idx
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Suka & Ulasan Buttons */}
          <div className="flex items-center gap-2">
            {/* Tombol 42 Suka */}
            <button
              type="button"
              onClick={onLikeClick}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiked
                  ? "border-rose-200 bg-rose-50 text-rose-600 shadow-2xs"
                  : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isLiked ? "fill-rose-600 text-rose-600" : ""
                }`}
              />
              <span>{likesCount} Suka</span>
            </button>

            {/* Tombol 1 Ulasan */}
            <button
              type="button"
              onClick={handleScrollToUlasan}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>{reviews.length} Ulasan</span>
            </button>
          </div>
        </div>

        {/* 3. Modal Body (Scrollable): Pembacaan Karya & Bagian Ulasan */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6"
        >
          {/* Quick Pillar Switcher */}
          {allItems && allItems.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex-shrink-0">
                Pilar Lain:
              </span>
              {allItems.map((other) => (
                <button
                  key={other.id}
                  type="button"
                  onClick={() => onSelectKarya && onSelectKarya(other)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    other.id === item.id
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {other.categoryTag}: {other.title.substring(0, 24)}
                  {other.title.length > 24 ? "..." : ""}
                </button>
              ))}
            </div>
          )}

          {/* Teks Karya / Puisi Literasi */}
          <div
            className={`space-y-6 ${
              fontFamily === "serif" ? "font-serif" : "font-sans"
            } ${fontSizes[fontSizeIndex]} text-slate-800 leading-relaxed`}
          >
            {item.stanzas.map((stanza, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-amber-50/30 border border-amber-100/60 shadow-2xs"
              >
                {stanza.split("\n").map((line, lineIdx) => (
                  <p key={lineIdx} className="mb-1 text-slate-800">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Kotak Verifikasi Guru Literasi */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  {item.verifierRole}
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  {item.verifierName} &bull; SMK Telkom Malang
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              Tervalidasi Resmi
            </span>
          </div>

          {/* 4. SEKSI ULASAN (Sesuai Referensi Gambar 3) */}
          <div ref={ulasanSectionRef} className="pt-4 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-4">Ulasan</h3>

            {/* Kotak Form Ulasan (Border biru muda seperti Gambar 3) */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/20 p-5 sm:p-6 mb-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Field 1: Nama Pengguna (akan diganti identitas Google) */}
                <div>
                  {googleVisitor ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-blue-200 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={googleVisitor.avatar}
                          alt={googleVisitor.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">
                              {googleVisitor.name}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              <GoogleLogo className="w-2.5 h-2.5" />
                              <span>Terverifikasi Google</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {googleVisitor.email}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPromptGoogleLogin("comment")}
                        className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Ganti Akun
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      placeholder="Nama Anda (akan diganti identitas Google)"
                      onClick={() => onPromptGoogleLogin("comment")}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
                    />
                  )}
                </div>

                {/* Field 2: Pilihan Rating 5 Bintang (Sesuai Gambar 3) */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= (hoverRating || rating);
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 text-amber-400 hover:scale-115 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-semibold text-slate-500 ml-2">
                    {rating} dari 5 Bintang
                  </span>
                </div>

                {/* Field 3: Textarea Ulasan */}
                <div>
                  <textarea
                    rows={3}
                    placeholder="Tulis ulasan Anda..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none"
                  />
                  {reviewError && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">
                      {reviewError}
                    </p>
                  )}
                </div>

                {/* Field 4: Tombol Verifikasi Google & Kirim (Sesuai Gambar 3) */}
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-2xs">
                      <GoogleLogo className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      {googleVisitor
                        ? "Kirim Ulasan Terverifikasi"
                        : "Verifikasi Google & Kirim"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* List Ulasan yang sudah ada (Sesuai Gambar 3) */}
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {rev.authorName}
                          </span>
                          {rev.isGoogleVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              <GoogleLogo className="w-2.5 h-2.5" />
                              <span>Terverifikasi Google</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block">
                          {rev.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Bintang Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Isi Komentar / Ulasan */}
                  <p className="text-sm text-slate-700 leading-relaxed pl-13">
                    {rev.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Footer Modal (Sesuai Gambar 3) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span className="font-medium">
            Perpustakaan Book Literasi &bull; Galeri Karya Kreatif Siswa
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

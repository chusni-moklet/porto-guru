"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Clock,
  ShieldCheck,
  Heart,
  MessageSquare,
  ExternalLink,
  Star,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import { KaryaShowcaseItem, KaryaReview, GoogleVisitorUser } from "@/types/karya";
import { GoogleLogo } from "./GoogleVisitorModal";

interface KaryaCardProps {
  item: KaryaShowcaseItem;
  likesCount: number;
  isLiked: boolean;
  reviews: KaryaReview[];
  onLikeClick: () => void;
  onAddReview: (review: {
    authorName: string;
    authorEmail: string;
    authorAvatar: string;
    rating: number;
    content: string;
  }) => void;
  googleVisitor: GoogleVisitorUser | null;
  onPromptGoogleLogin: (context: "like" | "comment") => void;
}

export default function KaryaCard({
  item,
  likesCount,
  isLiked,
  reviews,
  onLikeClick,
  onAddReview,
  googleVisitor,
  onPromptGoogleLogin,
}: KaryaCardProps) {
  const safeReviews = reviews || [];
  // State inline ulasan / command di kartu
  const [showInlineComments, setShowInlineComments] = useState(false);
  const [inlineRating, setInlineRating] = useState(5);
  const [inlineCommentText, setInlineCommentText] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInlineComment = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError("");

    if (!inlineCommentText.trim()) {
      setInlineError("Silakan ketik ulasan/komentar terlebih dahulu.");
      return;
    }

    if (!googleVisitor) {
      onPromptGoogleLogin("comment");
      return;
    }

    setIsSubmitting(true);
    onAddReview({
      authorName: googleVisitor.name,
      authorEmail: googleVisitor.email,
      authorAvatar: googleVisitor.avatar,
      rating: inlineRating,
      content: inlineCommentText.trim(),
    });

    setInlineCommentText("");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* 1. Header Gradient Khas (Sesuai Referensi Gambar 2) */}
      <Link
        href={`/karya/${item.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-gradient-to-r ${item.headerGradient} p-6 sm:p-7 text-white relative block cursor-pointer group/header`}
      >
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Pill Kategori */}
            <span className="bg-white/20 backdrop-blur-xs text-white font-bold text-[11px] px-3 py-1 rounded-full border border-white/30 uppercase tracking-wide">
              {item.categoryTag}
            </span>

            {/* Pill Juara / Penghargaan */}
            {item.awardTag && (
              <span className="bg-amber-400 text-amber-950 font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>{item.awardTag}</span>
              </span>
            )}
          </div>

          {/* Durasi Baca */}
          <div className="flex items-center gap-1 text-white/90 text-xs font-medium ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.readTime}</span>
          </div>
        </div>

        {/* Judul Karya (Serif Font Elegan Sesuai Gambar) */}
        <h3 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug mt-5 mb-2 group-hover/header:underline flex items-start justify-between gap-2">
          <span>{item.title}</span>
          <ExternalLink className="w-4 h-4 text-white/70 group-hover/header:text-white flex-shrink-0 mt-1" />
        </h3>

        {/* Penulis */}
        <p className="text-white/90 text-xs font-normal">
          {item.author.startsWith("Oleh:") ? item.author : `Oleh: ${item.author}`}
        </p>
      </Link>

      {/* 2. Body Card Putih */}
      <div className="p-6 space-y-4 flex flex-col justify-between flex-1 bg-white">
        {/* Kutipan / Refleksi Ringkas */}
        <p className="italic text-slate-600 text-xs leading-relaxed">
          {item.excerpt}
        </p>

        {/* Kotak Diverifikasi Guru Literasi */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-emerald-900 leading-tight">
              {item.verifierRole}
            </div>
            <div className="text-xs text-emerald-700 font-medium">
              {item.verifierName}
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 3. Footer Bar: Langsung Like & Command (Ulasan) di Sini + Buka Page Baru */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {/* Tombol Langsung Suka (Like) di Sini */}
            <button
              type="button"
              onClick={onLikeClick}
              className={`flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                isLiked
                  ? "text-rose-600 hover:text-rose-700 font-bold"
                  : "text-slate-600 hover:text-rose-600"
              }`}
              title={isLiked ? "Batalkan Suka" : "Beri Suka dengan Login Google"}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isLiked ? "fill-rose-600 text-rose-600 scale-110" : ""
                }`}
              />
              <span>{likesCount} Suka</span>
            </button>

            {/* Tombol Langsung Command / Ulasan di Sini */}
            <button
              type="button"
              onClick={() => setShowInlineComments(!showInlineComments)}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                showInlineComments
                  ? "text-[#2563EB] font-bold"
                  : "text-slate-600 hover:text-[#2563EB]"
              }`}
              title="Tulis atau lihat ulasan langsung di kartu ini"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{safeReviews.length} Ulasan</span>
              {showInlineComments ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Tombol Buka Page Baru */}
          <Link
            href={`/karya/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl border border-blue-100 transition-all cursor-pointer group/btn shadow-2xs"
            title="Buka karya lengkap di halaman/tab baru"
          >
            <span>Baca Karya</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4. DRAWER / ACCORDION: LANGSUNG COMMAND (ULASAN) DI SINI */}
        {showInlineComments && (
          <div className="mt-4 pt-4 border-t border-blue-100 bg-blue-50/30 -mx-6 -mb-6 p-5 rounded-b-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Ulasan & Komentar Langsung</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {safeReviews.length} komentar
              </span>
            </div>

            {/* Form Input Komentar Langsung di Kartu */}
            <form onSubmit={handleSubmitInlineComment} className="space-y-3">
              {/* Info Pengguna Google */}
              {googleVisitor ? (
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-blue-200 shadow-2xs">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={googleVisitor.avatar}
                      alt={googleVisitor.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                      {googleVisitor.name}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                      <GoogleLogo className="w-2 h-2" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPromptGoogleLogin("comment")}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Ganti
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => onPromptGoogleLogin("comment")}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 cursor-pointer hover:border-blue-400"
                >
                  <div className="flex items-center gap-2">
                    <GoogleLogo className="w-3.5 h-3.5" />
                    <span>Masuk dengan Google untuk memberi ulasan</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-semibold underline">
                    Masuk
                  </span>
                </div>
              )}

              {/* Pemilih Bintang 1-5 */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium text-slate-600 mr-1">
                  Rating:
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setInlineRating(star)}
                    className="text-amber-400 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= inlineRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Textarea Komentar Langsung */}
              <div>
                <textarea
                  rows={2}
                  placeholder="Tulis ulasan/komentar Anda langsung di sini..."
                  value={inlineCommentText}
                  onChange={(e) => setInlineCommentText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none"
                />
                {inlineError && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{inlineError}</p>
                )}
              </div>

              {/* Tombol Kirim */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>
                  {googleVisitor ? "Kirim Ulasan Sekarang" : "Verifikasi Google & Kirim"}
                </span>
              </button>
            </form>

            {/* Daftar Ulasan yang sudah ada di kartu ini */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80 max-h-48 overflow-y-auto pr-1">
              {safeReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-800 text-[11px]">
                        {rev.authorName}
                      </span>
                      {rev.isGoogleVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-semibold text-blue-700 bg-blue-50 px-1 py-0.2 rounded-full border border-blue-200">
                          <GoogleLogo className="w-1.5 h-1.5" />
                          <span>Google</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s <= rev.rating ? "fill-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-[11px] pl-6 leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

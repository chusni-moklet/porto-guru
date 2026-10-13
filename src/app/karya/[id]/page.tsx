"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
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
  ExternalLink,
  GraduationCap,
  Home,
  Check,
} from "lucide-react";
import { INITIAL_KARYA_SHOWCASES } from "@/lib/karyaData";
import {
  getSavedGoogleVisitor,
  getLikedKaryaIds,
  getKaryaLikeCounts,
  toggleKaryaLike,
  getAllKaryaReviews,
  addKaryaReview,
} from "@/lib/karyaStorage";
import { GoogleVisitorUser, KaryaReview } from "@/types/karya";
import GoogleVisitorModal, { GoogleLogo } from "@/components/GoogleVisitorModal";

function KaryaDetailContent() {
  const params = useParams();
  const router = useRouter();
  const karyaId = (params?.id as string) || "menatap-pagi";

  const karyaItem =
    INITIAL_KARYA_SHOWCASES.find((k) => k.id === karyaId) ||
    INITIAL_KARYA_SHOWCASES[0];

  // State Tipografi
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(1);

  // State Likes & Reviews
  const [googleVisitor, setGoogleVisitor] = useState<GoogleVisitorUser | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(karyaItem.initialLikes);
  const [reviews, setReviews] = useState<KaryaReview[]>(karyaItem.initialReviews);

  // Review Form
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentText, setCommentText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Google Modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleModalContext, setGoogleModalContext] = useState<"like" | "comment" | "general">("general");

  const ulasanSectionRef = useRef<HTMLDivElement>(null);

  // Sync state dari storage
  useEffect(() => {
    setGoogleVisitor(getSavedGoogleVisitor());

    const likedMap = getLikedKaryaIds();
    setIsLiked(Boolean(likedMap[karyaItem.id]));

    const counts = getKaryaLikeCounts();
    setLikesCount(counts[karyaItem.id] ?? karyaItem.initialLikes);

    const allRev = getAllKaryaReviews();
    setReviews(allRev[karyaItem.id] || karyaItem.initialReviews);
  }, [karyaItem.id, karyaItem.initialLikes, karyaItem.initialReviews]);

  const handleLike = () => {
    if (!googleVisitor) {
      setGoogleModalContext("like");
      setIsGoogleModalOpen(true);
      return;
    }
    const res = toggleKaryaLike(karyaItem.id);
    setIsLiked(res.isLiked);
    setLikesCount(res.newCount);
  };

  const handleGoogleSuccess = (user: GoogleVisitorUser) => {
    setGoogleVisitor(user);
    if (googleModalContext === "like") {
      const res = toggleKaryaLike(karyaItem.id);
      setIsLiked(res.isLiked);
      setLikesCount(res.newCount);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: karyaItem.title,
          text: `${karyaItem.title} di PortoGuru SMK Telkom Malang`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    if (!commentText.trim()) {
      setReviewError("Silakan tulis ulasan atau komentar Anda.");
      return;
    }

    if (!googleVisitor) {
      setGoogleModalContext("comment");
      setIsGoogleModalOpen(true);
      return;
    }

    const added = addKaryaReview(karyaItem.id, {
      authorName: googleVisitor.name,
      authorEmail: googleVisitor.email,
      authorAvatar: googleVisitor.avatar,
      rating,
      content: commentText.trim(),
    });

    setReviews((prev) => [added, ...prev]);
    setCommentText("");
  };

  const fontSizes = [
    "text-base leading-relaxed sm:text-lg sm:leading-loose",
    "text-lg leading-loose sm:text-xl sm:leading-loose",
    "text-xl leading-loose sm:text-2xl sm:leading-loose",
    "text-2xl leading-loose sm:text-3xl sm:leading-loose",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/#karya"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Galeri</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-[#1E293B] hidden sm:inline">
                PortoGuru <span className="text-[#2563EB]">ID</span>
              </span>
            </Link>
          </div>

          {/* Status Google Visitor */}
          <div className="flex items-center gap-2">
            {googleVisitor ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-blue-200 text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={googleVisitor.avatar}
                  alt={googleVisitor.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-800 text-xs truncate max-w-[120px] sm:max-w-none">
                  {googleVisitor.name}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-full">
                  <GoogleLogo className="w-2 h-2" />
                  <span>Google</span>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setGoogleModalContext("general");
                  setIsGoogleModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>Masuk dengan Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <article className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* 1. Header Banner Gradient (Sesuai Referensi Gambar 3) */}
          <div
            className={`bg-gradient-to-r ${karyaItem.headerGradient} p-8 sm:p-12 text-white relative`}
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{karyaItem.modalCategoryTag}</span>
                </span>

                {karyaItem.awardFullTag && (
                  <span className="bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{karyaItem.awardFullTag}</span>
                  </span>
                )}
              </div>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-xs transition-colors cursor-pointer relative"
                title="Bagikan Tautan Karya"
              >
                <Share2 className="w-4 h-4" />
                {isCopied && (
                  <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                    Tautan berhasil disalin!
                  </span>
                )}
              </button>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mt-4 mb-4">
              {karyaItem.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-white/80" />
                <span>{karyaItem.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-white/80" />
                <span>{karyaItem.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-white/80" />
                <span>{karyaItem.modalReadTime}</span>
              </div>
            </div>
          </div>

          {/* 2. Toolbar Tipografi, Like, & Ulasan */}
          <div className="bg-slate-50/80 border-b border-slate-200 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Font Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-slate-500 font-medium">Font:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFontFamily("serif")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    fontFamily === "serif"
                      ? "bg-blue-50 text-[#2563EB] font-bold border border-blue-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Serif (Klasik)
                </button>
                <button
                  type="button"
                  onClick={() => setFontFamily("sans")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    fontFamily === "sans"
                      ? "bg-blue-50 text-[#2563EB] font-bold border border-blue-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sans (Modern)
                </button>
              </div>

              <span className="text-slate-300">|</span>

              {/* Ukuran Teks A- A A+ A++ */}
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
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrik Like & Ulasan Interaktif */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isLiked
                    ? "border-rose-200 bg-rose-50 text-rose-600 font-bold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "fill-rose-600 text-rose-600" : ""
                  }`}
                />
                <span>{likesCount} Suka</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  ulasanSectionRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>{reviews.length} Ulasan</span>
              </button>
            </div>
          </div>

          {/* 3. Teks Karya / Bait Puisi Lengkap */}
          <div className="p-8 sm:p-12 space-y-8">
            <div
              className={`space-y-8 ${
                fontFamily === "serif" ? "font-serif" : "font-sans"
              } ${fontSizes[fontSizeIndex]} text-slate-800`}
            >
              {karyaItem.stanzas.map((stanza, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-amber-50/25 border border-amber-100/70 shadow-2xs"
                >
                  {stanza.split("\n").map((line, lIdx) => (
                    <p key={lIdx} className="mb-2 text-slate-800">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Box Diverifikasi Guru Literasi */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-950">
                    {karyaItem.verifierRole}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium">
                    {karyaItem.verifierName} &bull; SMK Telkom Malang
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full">
                Tervalidasi Resmi
              </span>
            </div>

            {/* 4. SEKSI ULASAN & KOMENTAR DENGAN LOGIN GOOGLE (Sesuai Gambar 3) */}
            <section ref={ulasanSectionRef} className="pt-8 border-t border-slate-200">
              <h2 className="text-3xl font-bold text-[#1E293B] mb-5">Ulasan</h2>

              {/* Form Input Ulasan */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/20 p-6 sm:p-7 mb-8 shadow-xs">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Field 1: Nama Pengguna Google */}
                  <div>
                    {googleVisitor ? (
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={googleVisitor.avatar}
                            alt={googleVisitor.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">
                                {googleVisitor.name}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                <GoogleLogo className="w-2.5 h-2.5" />
                                <span>Terverifikasi Google</span>
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 block">
                              {googleVisitor.email}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setGoogleModalContext("comment");
                            setIsGoogleModalOpen(true);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          Ganti Akun
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        readOnly
                        placeholder="Nama Anda (akan diganti identitas Google)"
                        onClick={() => {
                          setGoogleModalContext("comment");
                          setIsGoogleModalOpen(true);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
                      />
                    )}
                  </div>

                  {/* Field 2: Rating 5 Bintang */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const isFilled = s <= (hoverRating || rating);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-amber-400 hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              isFilled
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {rating} dari 5 Bintang
                    </span>
                  </div>

                  {/* Field 3: Textarea */}
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

                  {/* Field 4: Tombol Kirim */}
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold shadow-xs transition-all cursor-pointer"
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

              {/* Daftar Ulasan yang sudah ada */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rev.authorAvatar}
                          alt={rev.authorName}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
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
                            className={`w-4 h-4 ${
                              s <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed sm:pl-14">
                      {rev.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-8 py-5 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">
              Perpustakaan Book Literasi &bull; Galeri Karya Kreatif Siswa SMK Telkom Malang
            </span>
            <Link
              href="/#karya"
              className="text-[#2563EB] hover:underline font-bold"
            >
              Lihat Karya Lainnya &rarr;
            </Link>
          </div>
        </article>
      </main>

      {/* Modal Login Google */}
      <GoogleVisitorModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        actionContext={googleModalContext}
      />
    </div>
  );
}

export default function KaryaDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <KaryaDetailContent />
    </React.Suspense>
  );
}


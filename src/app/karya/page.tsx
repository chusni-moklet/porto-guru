"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Award,
  Search,
  GraduationCap,
  Heart,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Trophy,
  Clock,
} from "lucide-react";
import { INITIAL_KARYA_SHOWCASES } from "@/lib/karyaData";
import {
  getSavedGoogleVisitor,
  getLikedKaryaIds,
  getKaryaLikeCounts,
  toggleKaryaLike,
  getAllKaryaReviews,
  addKaryaReview,
  clearGoogleVisitor,
} from "@/lib/karyaStorage";
import { GoogleVisitorUser, KaryaReview } from "@/types/karya";
import KaryaCard from "@/components/KaryaCard";
import GoogleVisitorModal, { GoogleLogo } from "@/components/GoogleVisitorModal";

export default function KaryaCatalogPage() {
  const [googleVisitor, setGoogleVisitor] = useState<GoogleVisitorUser | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [reviewsMap, setReviewsMap] = useState<Record<string, KaryaReview[]>>({});

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleModalContext, setGoogleModalContext] = useState<"like" | "comment" | "general">("general");
  const [pendingAction, setPendingAction] = useState<
    | { type: "like"; karyaId: string }
    | { type: "comment"; karyaId: string }
    | null
  >(null);

  useEffect(() => {
    setGoogleVisitor(getSavedGoogleVisitor());
    setLikedMap(getLikedKaryaIds());
    setLikeCounts(getKaryaLikeCounts());
    setReviewsMap(getAllKaryaReviews());
  }, []);

  const handleLikeClick = (karyaId: string) => {
    if (!googleVisitor) {
      setPendingAction({ type: "like", karyaId });
      setGoogleModalContext("like");
      setIsGoogleModalOpen(true);
      return;
    }
    const res = toggleKaryaLike(karyaId);
    setLikedMap((prev) => ({ ...prev, [karyaId]: res.isLiked }));
    setLikeCounts((prev) => ({ ...prev, [karyaId]: res.newCount }));
  };

  const handleGoogleSuccess = (user: GoogleVisitorUser) => {
    setGoogleVisitor(user);
    if (pendingAction) {
      if (pendingAction.type === "like") {
        const res = toggleKaryaLike(pendingAction.karyaId);
        setLikedMap((prev) => ({ ...prev, [pendingAction.karyaId]: res.isLiked }));
        setLikeCounts((prev) => ({ ...prev, [pendingAction.karyaId]: res.newCount }));
      }
      setPendingAction(null);
    }
  };

  const handleAddReview = (karyaId: string, review: {
    authorName: string;
    authorEmail: string;
    authorAvatar: string;
    rating: number;
    content: string;
  }) => {
    const added = addKaryaReview(karyaId, review);
    setReviewsMap((prev) => ({
      ...prev,
      [karyaId]: [added, ...(prev[karyaId] || [])],
    }));
  };

  const filteredKarya = INITIAL_KARYA_SHOWCASES.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.pillarId === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-[#1E293B]">
                PortoGuru <span className="text-[#2563EB]">ID</span>
              </span>
            </Link>
          </div>

          {/* Google Visitor Status */}
          <div className="flex items-center gap-3">
            {googleVisitor ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-blue-200 text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={googleVisitor.avatar}
                  alt={googleVisitor.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-800 text-xs">
                  {googleVisitor.name}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-full">
                  <GoogleLogo className="w-2 h-2" />
                  <span>Google</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearGoogleVisitor();
                    setGoogleVisitor(null);
                  }}
                  className="ml-1 text-[10px] text-slate-400 hover:text-rose-600"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setGoogleModalContext("general");
                  setIsGoogleModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>Masuk Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Resmi Karya & Modul Pendidik Moklet</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight">
            Eksplorasi Karya & Praktik Baik
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
            Berikan apresiasi langsung (Suka) dan kirim komentar/ulasan dengan akun Google terverifikasi Anda.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-lg mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari judul karya, modul ajar, atau nama pendidik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: "all", label: "Semua Karya" },
            { id: "literasi-numerasi", label: "Puisi & Literasi Siswa" },
            { id: "kurikulum-merdeka", label: "Modul Ajar Kurikulum Merdeka" },
            { id: "edtech-ai", label: "Media Interaktif & EdTech AI" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredKarya.map((item) => (
            <KaryaCard
              key={item.id}
              item={item}
              likesCount={likeCounts[item.id] ?? item.initialLikes}
              isLiked={Boolean(likedMap[item.id])}
              reviews={reviewsMap[item.id] || item.initialReviews}
              onLikeClick={() => handleLikeClick(item.id)}
              onAddReview={(review) => handleAddReview(item.id, review)}
              googleVisitor={googleVisitor}
              onPromptGoogleLogin={(ctx) => {
                setGoogleModalContext(ctx);
                setPendingAction({ type: ctx, karyaId: item.id });
                setIsGoogleModalOpen(true);
              }}
            />
          ))}
        </div>
      </main>

      {/* Google Modal */}
      <GoogleVisitorModal
        isOpen={isGoogleModalOpen}
        onClose={() => {
          setIsGoogleModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleGoogleSuccess}
        actionContext={googleModalContext}
      />
    </div>
  );
}

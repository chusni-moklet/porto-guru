"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  BookMarked,
  HeartHandshake,
  Compass,
  Lightbulb,
  Users2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { KaryaShowcaseItem, KaryaReview, GoogleVisitorUser } from "@/types/karya";
import { INITIAL_KARYA_SHOWCASES } from "@/lib/karyaData";
import {
  getSavedGoogleVisitor,
  getLikedKaryaIds,
  getKaryaLikeCounts,
  toggleKaryaLike,
  getAllKaryaReviews,
  addKaryaReview,
} from "@/lib/karyaStorage";
import BacaKaryaModal from "@/components/BacaKaryaModal";
import GoogleVisitorModal from "@/components/GoogleVisitorModal";

interface PillarItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  sampleTopics: string[];
  totalPortfolios: string;
  accentBg: string;
  badge: string;
}

const pillars: PillarItem[] = [
  {
    id: "edtech-ai",
    icon: <Cpu className="w-6 h-6" />,
    title: "Inovasi EdTech & AI",
    subtitle: "Pemanfaatan Teknologi & Kecerdasan Artifisial Etis",
    description:
      "Kumpulan praktik baik guru dalam mengintegrasikan AI Sokratik, simulasi laboratorium virtual PhET, LMS interaktif, dan gamifikasi kelas.",
    sampleTopics: ["Etika GenAI Siswa", "Gamifikasi Quizizz & Kahoot", "Media Interaktif Canva"],
    totalPortfolios: "2,480+ Portofolio",
    accentBg: "bg-blue-50 text-[#2563EB] border-blue-100",
    badge: "Tren Pendidikan 2026",
  },
  {
    id: "kurikulum-merdeka",
    icon: <BookMarked className="w-6 h-6" />,
    title: "Kurikulum Merdeka & P5",
    subtitle: "Modul Ajar & Projek Profil Pelajar Pancasila",
    description:
      "Rancangan modul ajar berbasis Capaian Pembelajaran (CP), alur tujuan pembelajaran (ATP), serta rubrik asesmen P5 kearifan lokal.",
    sampleTopics: ["Modul Projek P5 Kewirausahaan", "Asesmen Diagnostik Awal", "Pembelajaran Berdiferensiasi"],
    totalPortfolios: "4,120+ Portofolio",
    accentBg: "bg-amber-50 text-amber-700 border-amber-100",
    badge: "Standar Nasional",
  },
  {
    id: "steam-robotika",
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Pembelajaran STEAM",
    subtitle: "Sains, Teknologi, Rekayasa, Seni & Matematika",
    description:
      "Praktik pembelajaran berbasis proyek (PBL) yang mengajak murid memecahkan masalah lingkungan sekitar dengan komputasi fisik dan eksperimen langsung.",
    sampleTopics: ["Sensor Arduino Murah", "Matematika Arsitektur Tradisional", "Sains Daur Ulang"],
    totalPortfolios: "1,890+ Portofolio",
    accentBg: "bg-orange-50 text-[#F97316] border-orange-100",
    badge: "Eksplorasi Praktis",
  },
  {
    id: "inklusi-udl",
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Pendidikan Inklusif",
    subtitle: "Universal Design for Learning (UDL) & Akomodasi ABK",
    description:
      "Strategi modifikasi materi, media multisensori, dan penyesuaian evaluasi bagi peserta didik berkebutuhan khusus di sekolah inklusi maupun SLB.",
    sampleTopics: ["Media Taktil & Audio", "Akomodasi ADHD & Disleksia", "Vokasional Kemandirian"],
    totalPortfolios: "1,140+ Portofolio",
    accentBg: "bg-emerald-50 text-[#10B981] border-emerald-100",
    badge: "Ramah Semua Murid",
  },
  {
    id: "kepemimpinan-kombel",
    icon: <Users2 className="w-6 h-6" />,
    title: "Kepemimpinan & Kombel",
    subtitle: "Komunitas Belajar Sekolah & Supervisi Klinis",
    description:
      "Inisiatif kepala sekolah dan guru penggerak dalam memfasilitasi lingkaran belajar sejawat, peer coaching, dan budaya refleksi pendidik.",
    sampleTopics: ["Pengelolaan Kombel Sekolah", "Coaching Supervisi Akademik", "Kemitraan Orang Tua"],
    totalPortfolios: "1,650+ Portofolio",
    accentBg: "bg-purple-50 text-purple-700 border-purple-100",
    badge: "Kolaborasi Sekolah",
  },
  {
    id: "literasi-numerasi",
    icon: <Compass className="w-6 h-6" />,
    title: "Literasi & Numerasi Kontekstual",
    subtitle: "Penguatan Logika Berpikir Kritis Abad 21",
    description:
      "Metodologi penguatan pemahaman bacaan kritis dan penalaran kuantitatif yang dihubungkan dengan kehidupan sehari-hari di nusantara.",
    sampleTopics: ["Membaca Berjenjang", "Numerasi Pasar Tradisional", "Analisis Fakta & Hoaks"],
    totalPortfolios: "1,980+ Portofolio",
    accentBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    badge: "Fondasi Akademik",
  },
];

export default function PilarTematik() {
  // State Karya Modal
  const [selectedKarya, setSelectedKarya] = useState<KaryaShowcaseItem | null>(null);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  // State Likes & Reviews
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [reviewsMap, setReviewsMap] = useState<Record<string, KaryaReview[]>>({});

  // State Google Visitor Login
  const [googleVisitor, setGoogleVisitor] = useState<GoogleVisitorUser | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleModalContext, setGoogleModalContext] = useState<"like" | "comment" | "general">("general");
  const [pendingAction, setPendingAction] = useState<{
    type: "like" | "comment";
    karyaId: string;
  } | null>(null);

  useEffect(() => {
    setGoogleVisitor(getSavedGoogleVisitor());
    setLikedMap(getLikedKaryaIds());
    setLikeCounts(getKaryaLikeCounts());
    setReviewsMap(getAllKaryaReviews());
  }, []);

  // KETIKA DIKLIK PILAR KARYA / "JELAJAHI KARYA" -> LANGSUNG MUNCUL KARYA!
  const handlePillarClick = (pillarId: string) => {
    const matched =
      INITIAL_KARYA_SHOWCASES.find((k) => k.pillarId === pillarId) ||
      INITIAL_KARYA_SHOWCASES[0];
    setSelectedKarya(matched);
    setIsReaderModalOpen(true);
  };

  const handleLike = (karyaId: string) => {
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

  const handleAddReview = (
    karyaId: string,
    newRev: {
      authorName: string;
      authorEmail: string;
      authorAvatar: string;
      rating: number;
      content: string;
    }
  ) => {
    const added = addKaryaReview(karyaId, newRev);
    setReviewsMap((prev) => ({
      ...prev,
      [karyaId]: [added, ...(prev[karyaId] || [])],
    }));
  };

  return (
    <section id="karya" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0] scroll-mt-10 relative">
      <span id="tematik" className="absolute -top-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kategori Karya & Praktik Baik</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Eksplorasi Karya Pendidik
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Klik kategori tema di bawah untuk langsung membuka karya inovasi, modul ajar, dan praktik baik terkurasi.
          </p>
        </div>

        {/* 6 Grid Cards: Diklik langsung muncul karya! */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => handlePillarClick(pillar.id)}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(37,99,235,0.12)] hover:border-blue-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pillar.accentBg}`}
                  >
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] border border-slate-200">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-[#2563EB] mt-0.5 mb-3">
                  {pillar.subtitle}
                </p>

                <p className="text-sm text-[#64748B] leading-relaxed mb-5">
                  {pillar.description}
                </p>

                {/* Sample Topics Chips */}
                <div className="space-y-1.5 pt-3 border-t border-[#F1F5F9] mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Topik Populer:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.sampleTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Klik langsung muncul karya */}
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E293B]">
                  {pillar.totalPortfolios}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePillarClick(pillar.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] group-hover:underline cursor-pointer"
                >
                  <span>Jelajahi Karya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL BACA KARYA (LANGSUNG MUNCUL KETIKA PILAR / JELAJAHI KARYA DIKLIK) */}
      <BacaKaryaModal
        isOpen={isReaderModalOpen}
        item={selectedKarya}
        onClose={() => setIsReaderModalOpen(false)}
        likesCount={
          selectedKarya
            ? likeCounts[selectedKarya.id] ?? selectedKarya.initialLikes
            : 0
        }
        isLiked={selectedKarya ? Boolean(likedMap[selectedKarya.id]) : false}
        onLikeClick={() => selectedKarya && handleLike(selectedKarya.id)}
        reviews={
          selectedKarya
            ? reviewsMap[selectedKarya.id] || selectedKarya.initialReviews
            : []
        }
        onAddReview={(rev) =>
          selectedKarya && handleAddReview(selectedKarya.id, rev)
        }
        googleVisitor={googleVisitor}
        onPromptGoogleLogin={(ctx) => {
          setGoogleModalContext(ctx);
          if (selectedKarya) {
            setPendingAction({ type: ctx, karyaId: selectedKarya.id });
          }
          setIsGoogleModalOpen(true);
        }}
        allItems={INITIAL_KARYA_SHOWCASES}
        onSelectKarya={(item) => setSelectedKarya(item)}
      />

      {/* MODAL LOGIN GOOGLE UNTUK LIKE & ULASAN */}
      <GoogleVisitorModal
        isOpen={isGoogleModalOpen}
        onClose={() => {
          setIsGoogleModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleGoogleSuccess}
        actionContext={googleModalContext}
      />
    </section>
  );
}

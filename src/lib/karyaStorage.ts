"use client";

import { GoogleVisitorUser, KaryaReview } from "@/types/karya";
import { INITIAL_KARYA_SHOWCASES } from "./karyaData";

const GOOGLE_VISITOR_STORAGE_KEY = "porto_guru_google_visitor_user";
const KARYA_LIKES_STORAGE_KEY = "porto_guru_karya_user_likes";
const KARYA_LIKE_COUNTS_KEY = "porto_guru_karya_like_counts";
const KARYA_REVIEWS_STORAGE_KEY = "porto_guru_karya_reviews_list";

export const PRESET_GOOGLE_USERS: GoogleVisitorUser[] = [
  {
    id: "g-clarissa",
    name: "Clarissa Putri",
    email: "clarissa.putri@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
  {
    id: "g-ananda",
    name: "Ananda Nabila",
    email: "ananda.nabila@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
  {
    id: "g-budi",
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
  {
    id: "g-fauzan",
    name: "Ahmad Fauzan",
    email: "ahmad.fauzan@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
];

// 1. Google Visitor Session
export function getSavedGoogleVisitor(): GoogleVisitorUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GOOGLE_VISITOR_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGoogleVisitor(user: GoogleVisitorUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GOOGLE_VISITOR_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save google visitor", err);
  }
}

export function clearGoogleVisitor(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GOOGLE_VISITOR_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear google visitor", err);
  }
}

// 2. Likes Management
export function getLikedKaryaIds(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KARYA_LIKES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getKaryaLikeCounts(): Record<string, number> {
  if (typeof window === "undefined") {
    const map: Record<string, number> = {};
    INITIAL_KARYA_SHOWCASES.forEach((k) => {
      map[k.id] = k.initialLikes;
    });
    return map;
  }
  try {
    const raw = localStorage.getItem(KARYA_LIKE_COUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    INITIAL_KARYA_SHOWCASES.forEach((k) => {
      if (typeof parsed[k.id] !== "number") {
        parsed[k.id] = k.initialLikes;
      }
    });
    return parsed;
  } catch {
    const map: Record<string, number> = {};
    INITIAL_KARYA_SHOWCASES.forEach((k) => {
      map[k.id] = k.initialLikes;
    });
    return map;
  }
}

export function toggleKaryaLike(
  karyaId: string
): { isLiked: boolean; newCount: number } {
  const currentLikes = getLikedKaryaIds();
  const currentCounts = getKaryaLikeCounts();

  const isCurrentlyLiked = Boolean(currentLikes[karyaId]);
  const currentCount = currentCounts[karyaId] ?? 0;

  const nextLiked = !isCurrentlyLiked;
  const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

  currentLikes[karyaId] = nextLiked;
  currentCounts[karyaId] = nextCount;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        KARYA_LIKES_STORAGE_KEY,
        JSON.stringify(currentLikes)
      );
      localStorage.setItem(
        KARYA_LIKE_COUNTS_KEY,
        JSON.stringify(currentCounts)
      );
    } catch (err) {
      console.error("Failed to persist like", err);
    }
  }

  return { isLiked: nextLiked, newCount: nextCount };
}

// 3. Reviews Management
export function getAllKaryaReviews(): Record<string, KaryaReview[]> {
  if (typeof window === "undefined") {
    const map: Record<string, KaryaReview[]> = {};
    INITIAL_KARYA_SHOWCASES.forEach((k) => {
      map[k.id] = k.initialReviews;
    });
    return map;
  }

  try {
    const raw = localStorage.getItem(KARYA_REVIEWS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    INITIAL_KARYA_SHOWCASES.forEach((k) => {
      if (!parsed[k.id] || !Array.isArray(parsed[k.id])) {
        parsed[k.id] = k.initialReviews;
      }
    });
    return parsed;
  } catch {
    const map: Record<string, KaryaReview[]> = {};
    INITIAL_KARYA_SHOWCASES.forEach((k) => {
      map[k.id] = k.initialReviews;
    });
    return map;
  }
}

export function addKaryaReview(
  karyaId: string,
  newReview: Omit<KaryaReview, "id" | "karyaId" | "createdAt" | "isGoogleVerified">
): KaryaReview {
  const allReviews = getAllKaryaReviews();
  const list = allReviews[karyaId] || [];

  const createdReview: KaryaReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    karyaId,
    authorName: newReview.authorName,
    authorEmail: newReview.authorEmail,
    authorAvatar: newReview.authorAvatar,
    isGoogleVerified: true,
    rating: newReview.rating,
    content: newReview.content,
    createdAt: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
  };

  const updatedList = [createdReview, ...list];
  allReviews[karyaId] = updatedList;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        KARYA_REVIEWS_STORAGE_KEY,
        JSON.stringify(allReviews)
      );
    } catch (err) {
      console.error("Failed to persist review", err);
    }
  }

  return createdReview;
}

export interface GoogleVisitorUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
}

export interface KaryaReview {
  id: string;
  karyaId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  isGoogleVerified: boolean;
  rating: number; // 1-5
  content: string;
  createdAt: string;
}

export interface KaryaShowcaseItem {
  id: string;
  categoryTag: string; // e.g. "PUISI"
  modalCategoryTag: string; // e.g. "PUISI SISWA"
  awardTag: string; // e.g. "Juara 2"
  awardFullTag: string; // e.g. "Juara 2: Karya Cemerlang"
  readTime: string; // e.g. "± 2 Min"
  modalReadTime: string; // e.g. "± 2 Menit Membaca"
  title: string;
  author: string;
  date: string;
  excerpt: string;
  stanzas: string[];
  verifierRole: string;
  verifierName: string;
  tags: string[];
  headerGradient: string;
  pillarId: string; // matching pillar id like "literasi-numerasi", "edtech-ai", etc.
  initialLikes: number;
  initialReviews: KaryaReview[];
}

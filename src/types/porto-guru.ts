export type UserRole = "admin" | "guru" | "guest";

export type ValidationStatus = "pending" | "approved" | "rejected";

export type ItemStatus = "pending" | "approved" | "rejected";

export interface PrestasiItem {
  id: string;
  title: string;
  level: "Sekolah" | "Kota/Kabupaten" | "Provinsi" | "Nasional" | "Internasional";
  year: string;
  organizer: string;
  description: string;
  certificateUrl?: string;
  status: ItemStatus;
  statusNote?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export interface SertifikasiItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  validUntil?: string;
  description?: string;
  certificateUrl?: string;
  status: ItemStatus;
  statusNote?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export interface KaryaItem {
  id: string;
  title: string;
  category: "Modul Ajar" | "Inovasi Pembelajaran" | "Aplikasi / Software" | "Media Interaktif" | "Publikasi / Jurnal";
  year: string;
  description: string;
  linkUrl?: string;
  status: ItemStatus;
  statusNote?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export type NotificationType = "pending" | "verified" | "rejected";
export type NotificationItemType = "prestasi" | "sertifikasi" | "karya" | "portfolio";

export interface GuruNotification {
  id: string;
  guruId: string;
  type: NotificationType;
  itemType: NotificationItemType;
  itemId?: string;
  itemTitle: string;
  title: string;
  message: string;
  adminNote?: string;
  createdAt: string;
  read: boolean;
}

export interface GuruProfile {
  id: string;
  email: string; // must end with @smktelkom-mlg.sch.id
  name: string;
  nuptkOrNip: string;
  jurusan: "RPL" | "TKJ" | "PG" | "Normatif" | "Adaptif";
  mapel: string;
  specializations: string[];
  bio: string;
  avatarUrl: string;
  phone?: string;
  linkedinUrl?: string;
  githubOrPortfolioUrl?: string;
  validationStatus: ValidationStatus;
  validationNote?: string;
  validatedAt?: string;
  validatedBy?: string; // e.g. chusni@smktelkom-mlg.sch.id
  submittedAt: string;
  prestasiList: PrestasiItem[];
  sertifikasiList: SertifikasiItem[];
  karyaList: KaryaItem[];
}

export type AdminVerificationScope = "all" | "prestasi" | "sertifikasi" | "karya";

export interface AdminValidator {
  id: string;
  email: string;
  name: string;
  nuptkOrNip?: string;
  roleTitle: string;
  scope: AdminVerificationScope;
  addedAt: string;
  addedBy: string;
  isActive: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  guruId?: string;
  adminScope?: AdminVerificationScope;
  roleTitle?: string;
}


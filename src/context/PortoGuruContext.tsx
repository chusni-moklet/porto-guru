"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthUser,
  GuruProfile,
  PrestasiItem,
  SertifikasiItem,
  KaryaItem,
  ValidationStatus,
  ItemStatus,
  GuruNotification,
  AdminValidator,
  AdminVerificationScope,
} from "@/types/porto-guru";
import { signOutSupabase } from "@/lib/supabase";

const ADMIN_EMAIL = "chusni@smktelkom-mlg.sch.id";

const INITIAL_ADMIN_VALIDATORS: AdminValidator[] = [
  {
    id: "admin-chusni",
    email: "chusni@smktelkom-mlg.sch.id",
    name: "M. Chusni Agus, M. Pd.",
    nuptkOrNip: "198205142008011005",
    roleTitle: "Kepala Penjaminan Mutu (Super Admin)",
    scope: "all",
    addedAt: "2026-08-01T08:00:00Z",
    addedBy: "Sistem Pusat Moklet",
    isActive: true,
  },
  {
    id: "admin-siti",
    email: "siti_aminah@smktelkom-mlg.sch.id",
    name: "Dra. Siti Aminah, M.Pd.",
    nuptkOrNip: "197803122005012003",
    roleTitle: "Admin Verifikator Prestasi",
    scope: "prestasi",
    addedAt: "2026-08-15T09:00:00Z",
    addedBy: "chusni@smktelkom-mlg.sch.id",
    isActive: true,
  },
  {
    id: "admin-bambang",
    email: "bambang_tri@smktelkom-mlg.sch.id",
    name: "Ir. Bambang Trihatmodjo, M.T.",
    nuptkOrNip: "198106202008121002",
    roleTitle: "Admin Verifikator Sertifikasi",
    scope: "sertifikasi",
    addedAt: "2026-08-20T10:00:00Z",
    addedBy: "chusni@smktelkom-mlg.sch.id",
    isActive: true,
  },
  {
    id: "admin-fauzi",
    email: "achmad_fauzi@smktelkom-mlg.sch.id",
    name: "Achmad Fauzi, S.Kom., M.Kom.",
    nuptkOrNip: "198911042018011001",
    roleTitle: "Admin Verifikator Karya & Modul",
    scope: "karya",
    addedAt: "2026-09-01T11:00:00Z",
    addedBy: "chusni@smktelkom-mlg.sch.id",
    isActive: true,
  },
];

const INITIAL_GURU_DATA: GuruProfile[] = [
  {
    id: "guru-chusni",
    email: "chusni@smktelkom-mlg.sch.id",
    name: "M. Chusni Agus, M. Pd.",
    nuptkOrNip: "198205142008011005",
    jurusan: "RPL",
    mapel: "Software Engineering & Penjaminan Mutu",
    specializations: [
      "Software Architecture",
      "Quality Assurance",
      "Project Management",
      "Cloud Infrastructure",
    ],
    bio: "Kepala Tim Penjaminan Mutu Pendidikan dan Pengampu RPL SMK Telkom Malang. Penggiat kurikulum berbasis industri dan standarisasi portofolio pendidik vokasi berstandar global.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    phone: "+62 812-3456-7890",
    linkedinUrl: "https://linkedin.com/in/chusni",
    validationStatus: "approved",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-09-01T08:00:00Z",
    submittedAt: "2026-08-25T10:00:00Z",
    prestasiList: [
      {
        id: "p-ch-1",
        title: "Pendidik Inspiratif Vokasi Nasional",
        level: "Nasional",
        year: "2025",
        organizer: "Kemendikbudristek",
        description: "Juara 1 Kategori Guru Kejuruan Terbaik Pengembangan Kurikulum Industri Berbasis Project.",
        status: "approved",
        verifiedAt: "2026-09-01T08:00:00Z",
      },
      {
        id: "p-ch-2",
        title: "Mentor Terbaik LKS Web Technologies Nasional",
        level: "Nasional",
        year: "2024",
        organizer: "Puspresnas",
        description: "Membimbing siswa SMK Telkom Malang meraih Medali Emas LKS Nasional bidang Web Technologies.",
        status: "approved",
        verifiedAt: "2026-09-01T08:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-ch-1",
        name: "Asesor Kompetensi BNSP Rekayasa Perangkat Lunak",
        issuer: "BNSP Indonesia",
        year: "2024",
        credentialId: "MET.000.004921.2024",
        validUntil: "2027",
        status: "approved",
        verifiedAt: "2026-09-01T08:00:00Z",
      },
      {
        id: "s-ch-2",
        name: "Google Cloud Certified Professional Cloud Architect",
        issuer: "Google Cloud",
        year: "2023",
        credentialId: "GCP-PCA-984210",
        validUntil: "2026",
        status: "approved",
        verifiedAt: "2026-09-01T08:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-ch-1",
        title: "Modul Standarisasi Kurikulum Industri RPL Berbasis Agile Scrum",
        category: "Modul Ajar",
        year: "2025",
        description: "Modul ajar 60 halaman diadopsi oleh 15 SMK jejaring Telkom Schools se-Indonesia.",
        linkUrl: "https://drive.google.com",
        status: "approved",
        verifiedAt: "2026-09-01T08:00:00Z",
      },
      {
        id: "k-ch-2",
        title: "Moklet SIPORTO: Sistem Manajemen Portofolio Pendidik Vokasi",
        category: "Aplikasi / Software",
        year: "2026",
        description: "Platform digital terintegrasi untuk verifikasi dan validasi portofolio guru kejuruan.",
        status: "approved",
        verifiedAt: "2026-09-01T08:00:00Z",
      },
    ],
  },
  {
    id: "guru-budi",
    email: "budi_santoso@smktelkom-mlg.sch.id",
    name: "Budi Santoso, S.Kom.",
    nuptkOrNip: "198804122014021003",
    jurusan: "RPL",
    mapel: "Pemrograman Web & Perangkat Bergerak",
    specializations: [
      "Frontend Development",
      "Mobile Development",
      "Software Engineering",
      "Web Development",
    ],
    bio: "Pendidik RPL SMK Telkom Malang dengan pengalaman industri 8 tahun. Aktif membina inkubator startup siswa dan penerapan arsitektur modern Next.js & Flutter.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    phone: "+62 813-8877-6655",
    linkedinUrl: "https://linkedin.com/in/budisantoso",
    githubOrPortfolioUrl: "https://github.com/budisantoso-moklet",
    validationStatus: "approved",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-09-10T14:30:00Z",
    submittedAt: "2026-09-08T09:15:00Z",
    prestasiList: [
      {
        id: "p-b-1",
        title: "Best Coach Hackathon Telkom DigiTalent",
        level: "Nasional",
        year: "2025",
        organizer: "Telkom Indonesia",
        description: "Membimbing tim siswa Moklet menciptakan aplikasi edukasi disabilitas berbasis AI.",
        status: "approved",
        verifiedAt: "2026-09-10T14:30:00Z",
      },
      {
        id: "p-b-2",
        title: "Juara 2 Guru Inovatif Pembelajaran Berbasis Industri",
        level: "Provinsi",
        year: "2024",
        organizer: "Dinas Pendidikan Jawa Timur",
        description: "Inovasi kurikulum simulasi sprint industri di kelas kejuruan RPL.",
        status: "rejected",
        statusNote: "Mohon sertakan scan sertifikat resmi berstempel dan bertanda tangan kepala dinas pendidikan.",
        verifiedAt: "2026-10-06T15:00:00Z",
      },
      {
        id: "p-b-3",
        title: "Penulis Buku Ajar Pemrograman Modern Vokasi",
        level: "Nasional",
        year: "2023",
        organizer: "Penerbit Informatika",
        description: "Buku panduan Praktikum React & TypeScript untuk jenjang SMK.",
        status: "approved",
        verifiedAt: "2026-09-10T14:30:00Z",
      },
      {
        id: "p-b-4",
        title: "Juara 1 Innovfest 2026",
        level: "Nasional",
        year: "2026",
        organizer: "YPT",
        description: "Porto-q portofolio siswa kejuruan terintegrasi.",
        status: "pending",
        submittedAt: "2026-10-07T10:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-b-1",
        name: "Oracle Certified Professional: Java SE 17 Developer",
        issuer: "Oracle University",
        year: "2024",
        credentialId: "OCP-JAVA-881920",
        validUntil: "2027",
        status: "approved",
        verifiedAt: "2026-09-10T14:30:00Z",
      },
      {
        id: "s-b-2",
        name: "Sertifikasi Kompetensi BNSP Junior Web Programmer",
        issuer: "LSP Informatika BNSP",
        year: "2023",
        credentialId: "BNSP-JWP-2023-1120",
        validUntil: "2026",
        status: "pending",
        submittedAt: "2026-10-06T11:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-b-1",
        title: "Modul Ajar Fullstack Next.js 15 & REST API untuk Tingkat XI SMK",
        category: "Modul Ajar",
        year: "2025",
        description: "Bahan ajar lengkap dengan 12 modul praktikum dan template starter repo GitHub.",
        linkUrl: "https://github.com",
        status: "approved",
        verifiedAt: "2026-09-10T14:30:00Z",
      },
      {
        id: "k-b-2",
        title: "Moklet CodeLab: Platform Evaluasi Koding Otomatis Siswa",
        category: "Aplikasi / Software",
        year: "2025",
        description: "Online judge ringan berbasis Docker untuk menguji tes koding siswa secara instan.",
        status: "rejected",
        statusNote: "Tautan repositori GitHub perlu disetel ke public agar tim penjamin mutu dapat memverifikasi kode.",
        verifiedAt: "2026-10-06T15:30:00Z",
      },
      {
        id: "k-b-3",
        title: "Video Pembelajaran Interaktif State Management Modern",
        category: "Media Interaktif",
        year: "2024",
        description: "Seri video YouTube edukasi yang telah ditonton lebih dari 45.000 kali oleh pelajar vokasi.",
        status: "approved",
        verifiedAt: "2026-09-10T14:30:00Z",
      },
    ],
  },
  {
    id: "guru-wisnu",
    email: "wisnu_saputra@smktelkom-mlg.sch.id",
    name: "Wisnu Surya Saputra, S.T., M.Kom.",
    nuptkOrNip: "199102192018011002",
    jurusan: "TKJ",
    mapel: "Administrasi Sistem Jaringan & Keamanan Siber",
    specializations: [
      "Cyber Security",
      "Network Engineering",
      "Cloud Security",
      "MikroTik Certified",
    ],
    bio: "Pendidik TKJ SMK Telkom Malang fokus pada Cyber Defense dan Offensive Security. Pembina Cyber Club Moklet peraih juara CTF tingkat nasional.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    phone: "+62 821-4455-6677",
    linkedinUrl: "https://linkedin.com/in/wisnusurya",
    validationStatus: "approved",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-09-12T11:00:00Z",
    submittedAt: "2026-09-10T16:20:00Z",
    prestasiList: [
      {
        id: "p-w-1",
        title: "Juara 1 Cyber Defense Coach Competition",
        level: "Nasional",
        year: "2025",
        organizer: "BSSN (Badan Siber & Sandi Negara)",
        description: "Penghargaan atas perancangan skenario mitigasi serangan siber simulasi industri.",
        status: "approved",
        verifiedAt: "2026-09-12T11:00:00Z",
      },
      {
        id: "p-w-2",
        title: "Pelatih Tim Juara 1 Cyber Jawara Siswa Nasional",
        level: "Nasional",
        year: "2024",
        organizer: "CSIRT Indonesia",
        description: "Membawa siswa Moklet memenangkan kejuaraan Capture The Flag (CTF) prestisius.",
        status: "approved",
        verifiedAt: "2026-09-12T11:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-w-1",
        name: "Certified Ethical Hacker (CEH v12)",
        issuer: "EC-Council",
        year: "2024",
        credentialId: "ECC-CEH-993812",
        validUntil: "2027",
        status: "approved",
        verifiedAt: "2026-09-12T11:00:00Z",
      },
      {
        id: "s-w-2",
        name: "Cisco Certified Network Associate (CCNA 200-301)",
        issuer: "Cisco Systems",
        year: "2023",
        credentialId: "CSCO-14285910",
        validUntil: "2026",
        status: "approved",
        verifiedAt: "2026-09-12T11:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-w-1",
        title: "Laboratorium Virtual Capture The Flag (CTF) Keamanan Siber SMK",
        category: "Inovasi Pembelajaran",
        year: "2025",
        description: "Sistem simulasi perang siber di server lokal untuk praktik siswa tanpa risiko jaringan.",
        linkUrl: "https://ctf.smktelkom-mlg.sch.id",
        status: "approved",
        verifiedAt: "2026-09-12T11:00:00Z",
      },
      {
        id: "k-w-2",
        title: "Modul Ajar Hardening Linux Server & Firewall Mikrotik",
        category: "Modul Ajar",
        year: "2024",
        description: "Buku saku praktikum konfigurasi pertahanan infrastruktur jaringan sekolah.",
        status: "approved",
        verifiedAt: "2026-09-12T11:00:00Z",
      },
    ],
  },
  {
    id: "guru-anita",
    email: "anita_kusuma@smktelkom-mlg.sch.id",
    name: "Anita Kusuma Wardani, S.Sn., M.Ds.",
    nuptkOrNip: "199307242019032008",
    jurusan: "PG",
    mapel: "Pengembangan Game, Game Art & UI/UX Design",
    specializations: [
      "Game Development",
      "UI/UX Design",
      "3D Game Assets",
      "Design Systems",
    ],
    bio: "Pendidik PG SMK Telkom Malang dengan latar belakang konsultan game development dan desain produk digital. Mendidik siswa menguasai Game Design, Unity, 3D Art, dan riset pengguna industri.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    phone: "+62 856-7890-1234",
    linkedinUrl: "https://linkedin.com/in/anitakusuma",
    validationStatus: "approved",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-09-15T10:00:00Z",
    submittedAt: "2026-09-14T08:00:00Z",
    prestasiList: [
      {
        id: "p-a-1",
        title: "Finalis Desain Antarmuka Edukasi Internasional (Awwwards Nominee)",
        level: "Internasional",
        year: "2025",
        organizer: "Awwwards Educational Showcase",
        description: "Desain portal digital interaktif untuk akses pembelajaran anak berkebutuhan khusus.",
        status: "approved",
        verifiedAt: "2026-09-15T10:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-a-1",
        name: "Google UX Design Professional Certificate",
        issuer: "Google / Coursera",
        year: "2024",
        credentialId: "COURSERA-UX-ANITA-2024",
        validUntil: "Seumur Hidup",
        status: "approved",
        verifiedAt: "2026-09-15T10:00:00Z",
      },
      {
        id: "s-a-2",
        name: "Sertifikasi Asesor Desain Grafis BNSP",
        issuer: "BNSP Indonesia",
        year: "2023",
        credentialId: "BNSP-DG-2023-7721",
        validUntil: "2026",
        status: "approved",
        verifiedAt: "2026-09-15T10:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-a-1",
        title: "Moklet Game Engine UI Kit & Asset Pack Pembelajaran",
        category: "Inovasi Pembelajaran",
        year: "2025",
        description: "Desain sistem komponen Figma dan aset game engine terstandarisasi yang digunakan di seluruh kelas kejuruan PG & RPL.",
        status: "approved",
        verifiedAt: "2026-09-15T10:00:00Z",
      },
      {
        id: "k-a-2",
        title: "Modul Ajar Game Design Thinking & Prototyping untuk SMK",
        category: "Modul Ajar",
        year: "2025",
        description: "Buku panduan riset kebutuhan pengguna dan perancangan mekanik game dalam pengembangan prototipe game edukasi.",
        status: "approved",
        verifiedAt: "2026-09-15T10:00:00Z",
      },
    ],
  },
  {
    id: "guru-fauzan",
    email: "fauzan_akbar@smktelkom-mlg.sch.id",
    name: "Fauzan Akbar, S.T.",
    nuptkOrNip: "199611082023021004",
    jurusan: "TKJ",
    mapel: "Internet of Things (IoT) & Smart Electronics",
    specializations: [
      "IoT Architecture",
      "Embedded Systems",
      "Arduino & ESP32",
      "Edge Computing",
    ],
    bio: "Pendidik muda bersemangat tinggi di bidang otomasi industri dan IoT. Sedang mengajukan portofolio perdana untuk diverifikasi oleh admin penjamin mutu.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    phone: "+62 899-1234-5678",
    linkedinUrl: "https://linkedin.com/in/fauzanakbar",
    validationStatus: "pending",
    submittedAt: "2026-10-06T15:00:00Z",
    prestasiList: [
      {
        id: "p-f-1",
        title: "Juara 1 Inovasi IoT Smart Agriculture Jawa Timur",
        level: "Provinsi",
        year: "2025",
        organizer: "Dinas Pertanian & Kominfo Jatim",
        description: "Pengembangan sensor pemantau kelembaban tanah hemat energi berbasis LoRaWAN.",
        status: "pending",
        submittedAt: "2026-10-06T15:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-f-1",
        name: "Cisco IoT Fundamentals Certification",
        issuer: "Cisco Networking Academy",
        year: "2024",
        credentialId: "CISCO-IOT-448102",
        validUntil: "2027",
        status: "pending",
        submittedAt: "2026-10-06T15:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-f-1",
        title: "Kit Modul Ajar IoT Praktis: Monitoring Suhu Kelas Otomatis",
        category: "Modul Ajar",
        year: "2025",
        description: "Modul rancang bangun perangkat hardware IoT interaktif untuk siswa kelas X & XI.",
        status: "pending",
        submittedAt: "2026-10-06T15:00:00Z",
      },
      {
        id: "k-f-2",
        title: "Smart GreenHouse Moklet: Sistem Penyiraman Otomatis Berbasis ESP32",
        category: "Inovasi Pembelajaran",
        year: "2025",
        description: "Projek kolaboratif siswa jurusan TKJ di lingkungan green house sekolah.",
        status: "pending",
        submittedAt: "2026-10-06T15:00:00Z",
      },
    ],
  },
  {
    id: "guru-rendy",
    email: "rendy_pangestu@smktelkom-mlg.sch.id",
    name: "Rendy Pangestu, S.Kom.",
    nuptkOrNip: "199503152021031005",
    jurusan: "RPL",
    mapel: "Basis Data & Cloud Services",
    specializations: [
      "Database Administration",
      "PostgreSQL",
      "Docker & Kubernetes",
      "Backend Architecture",
    ],
    bio: "Pendidik RPL yang mengampu mata pelajaran database relasional dan non-relasional serta implementasi containerization.",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    phone: "+62 877-6543-2109",
    validationStatus: "rejected",
    validationNote: "Mohon lengkapi nomor registrasi lisensi sertifikasi BNSP dan lampirkan tautan bukti modul ajar resmi.",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-10-05T09:00:00Z",
    submittedAt: "2026-10-04T11:00:00Z",
    prestasiList: [],
    sertifikasiList: [
      {
        id: "s-r-1",
        name: "PostgreSQL Certified Associate",
        issuer: "EnterpriseDB",
        year: "2024",
        status: "rejected",
        statusNote: "Kredensial lisensi belum dicantumkan nomor verifikasi resminya.",
        verifiedAt: "2026-10-05T09:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-r-1",
        title: "Slide Pembelajaran Normalisasi Database Tingkat Lanjut",
        category: "Media Interaktif",
        year: "2024",
        description: "Materi presentasi 40 slide konsep basis data.",
        status: "rejected",
        statusNote: "Tautan unduh dokumen modul ajar masih privat.",
        verifiedAt: "2026-10-05T09:00:00Z",
      },
    ],
  },
  {
    id: "guru-aminah",
    email: "siti_aminah@smktelkom-mlg.sch.id",
    name: "Dra. Hj. Siti Aminah, M.Pd.",
    nuptkOrNip: "197508122005012003",
    jurusan: "Normatif",
    mapel: "Bahasa Indonesia & Literasi Vokasi",
    specializations: [
      "Literasi Vokasi",
      "Kepenulisan Karya Ilmiah",
      "Public Speaking",
      "Komunikasi Profesional",
    ],
    bio: "Pendidik Normatif Bahasa Indonesia di SMK Telkom Malang dengan dedikasi lebih dari 15 tahun. Aktif membimbing lomba debat, literasi digital, dan publikasi antologi karya tulis siswa kejuruan.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    phone: "+62 812-9988-7711",
    validationStatus: "approved",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-09-18T10:00:00Z",
    submittedAt: "2026-09-17T08:30:00Z",
    prestasiList: [
      {
        id: "p-sa-1",
        title: "Juara 1 Guru Berprestasi Bidang Bahasa & Sastra Vokasi Jawa Timur",
        level: "Provinsi",
        year: "2024",
        organizer: "Dinas Pendidikan Jawa Timur",
        description: "Pengembangan modul ajar literasi digital dan komunikasi bisnis berbasis studi kasus industri IT.",
        status: "approved",
        verifiedAt: "2026-09-18T10:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-sa-1",
        name: "Sertifikasi Pendidik Profesional Bahasa Indonesia",
        issuer: "Kemendikbudristek",
        year: "2023",
        credentialId: "SERTPEND-BI-19750812",
        validUntil: "Seumur Hidup",
        status: "approved",
        verifiedAt: "2026-09-18T10:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-sa-1",
        title: "Modul Ajar Komunikasi Profesional & Korespondensi Industri IT",
        category: "Modul Ajar",
        year: "2025",
        description: "Bahan ajar pedoman penulisan proposal teknis, dokumentasi software, dan surat resmi dunia kerja.",
        linkUrl: "https://drive.google.com",
        status: "approved",
        verifiedAt: "2026-09-18T10:00:00Z",
      },
    ],
  },
  {
    id: "guru-farisi",
    email: "ahmad_farisi@smktelkom-mlg.sch.id",
    name: "Ahmad Farisi, S.Pd., M.Sc.",
    nuptkOrNip: "198906202016031002",
    jurusan: "Adaptif",
    mapel: "Matematika Terapan & Statistika Data",
    specializations: [
      "Matematika Terapan",
      "Statistika Algoritma",
      "Data Analysis",
      "STEM Education",
    ],
    bio: "Pendidik Adaptif Matematika Terapan di SMK Telkom Malang. Mengintegrasikan logika matematika diskrit dan komputasi untuk menunjang keahlian koding siswa RPL, TKJ, dan PG.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    phone: "+62 813-7722-1100",
    validationStatus: "approved",
    validatedBy: "chusni@smktelkom-mlg.sch.id",
    validatedAt: "2026-09-20T09:00:00Z",
    submittedAt: "2026-09-19T11:00:00Z",
    prestasiList: [
      {
        id: "p-af-1",
        title: "Pembina Terbaik Olimpiade Sains Terapan & Matematika Nasional",
        level: "Nasional",
        year: "2025",
        organizer: "Puspresnas Kemendikbudristek",
        description: "Membimbing siswa Moklet meraih Medali Perak OSN Informatika & Matematika Komputasi.",
        status: "approved",
        verifiedAt: "2026-09-20T09:00:00Z",
      },
    ],
    sertifikasiList: [
      {
        id: "s-af-1",
        name: "Data Analytics & Applied Math Master Trainer",
        issuer: "SEAMEO QITEP in Mathematics",
        year: "2024",
        credentialId: "SEAMEO-QITEP-MATH-88210",
        validUntil: "2027",
        status: "approved",
        verifiedAt: "2026-09-20T09:00:00Z",
      },
    ],
    karyaList: [
      {
        id: "k-af-1",
        title: "Modul Praktikum Matematika Diskrit Berbasis Python untuk Siswa Vokasi",
        category: "Modul Ajar",
        year: "2025",
        description: "Buku ajar logika proposisi, relasi himpunan, dan graf berorientasi pemrograman komputer.",
        linkUrl: "https://drive.google.com",
        status: "approved",
        verifiedAt: "2026-09-20T09:00:00Z",
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: GuruNotification[] = [
  {
    id: "notif-1",
    guruId: "guru-budi",
    type: "pending",
    itemType: "prestasi",
    itemId: "p-b-4",
    itemTitle: "Juara 1 Innovfest 2026",
    title: "Pengajuan Prestasi Menunggu Verifikasi",
    message: "Pengajuan prestasi \"Juara 1 Innovfest 2026\" (Nasional • 2026) berhasil dikirimkan dan berstatus PENDING (Menunggu Verifikasi Admin).",
    createdAt: "2026-10-07T10:00:00Z",
    read: false,
  },
  {
    id: "notif-2",
    guruId: "guru-budi",
    type: "rejected",
    itemType: "karya",
    itemId: "k-b-2",
    itemTitle: "Moklet CodeLab: Platform Evaluasi Koding Otomatis Siswa",
    title: "Pengajuan Karya Perlu Revisi (Ditolak)",
    message: "Pengajuan karya inovasi \"Moklet CodeLab\" belum dapat disetujui oleh Penjamin Mutu.",
    adminNote: "Tautan repositori GitHub perlu disetel ke public agar tim penjamin mutu dapat memverifikasi kode.",
    createdAt: "2026-10-06T15:30:00Z",
    read: false,
  },
  {
    id: "notif-3",
    guruId: "guru-budi",
    type: "rejected",
    itemType: "prestasi",
    itemId: "p-b-2",
    itemTitle: "Juara 2 Guru Inovatif Pembelajaran Berbasis Industri",
    title: "Pengajuan Prestasi Ditolak (Perlu Revisi)",
    message: "Pengajuan prestasi tingkat provinsi belum dapat disahkan oleh Admin Penjamin Mutu.",
    adminNote: "Mohon sertakan scan sertifikat resmi berstempel dan bertanda tangan kepala dinas pendidikan.",
    createdAt: "2026-10-06T15:00:00Z",
    read: false,
  },
  {
    id: "notif-4",
    guruId: "guru-budi",
    type: "verified",
    itemType: "prestasi",
    itemId: "p-b-1",
    itemTitle: "Best Coach Hackathon Telkom DigiTalent",
    title: "Prestasi Berhasil Diverifikasi! ✅",
    message: "Prestasi \"Best Coach Hackathon Telkom DigiTalent\" telah diverifikasi dan disahkan oleh Admin Penjamin Mutu M. Chusni Agus, M. Pd.",
    createdAt: "2026-09-10T14:30:00Z",
    read: true,
  },
  {
    id: "notif-5",
    guruId: "guru-budi",
    type: "verified",
    itemType: "sertifikasi",
    itemId: "s-b-1",
    itemTitle: "Oracle Certified Professional: Java SE 17 Developer",
    title: "Sertifikasi Kompetensi Diverifikasi! ✅",
    message: "Sertifikasi kompetensi \"Oracle Certified Professional\" telah diverifikasi dan aktif pada portofolio publik Anda.",
    createdAt: "2026-09-10T14:30:00Z",
    read: true,
  },
  {
    id: "notif-6",
    guruId: "guru-fauzan",
    type: "pending",
    itemType: "portfolio",
    itemTitle: "Portofolio Lengkap Fauzan Akbar, S.T.",
    title: "Portofolio Menunggu Validasi Awal",
    message: "Pengajuan portofolio Anda telah diterima sistem dan dalam antrean verifikasi Admin Penjamin Mutu.",
    createdAt: "2026-10-06T15:00:00Z",
    read: false,
  },
];

interface PortoGuruContextType {
  currentUser: AuthUser | null;
  guruProfiles: GuruProfile[];
  approvedGuruProfiles: GuruProfile[];
  pendingGuruProfiles: GuruProfile[];
  isAdmin: boolean;
  login: (email: string, name?: string) => { success: boolean; message: string };
  logout: () => void;
  quickLoginAsAdmin: () => void;
  quickLoginAsGuruBudi: () => void;
  quickLoginAsGuruFauzanPending: () => void;
  updateMyProfile: (updatedData: Partial<GuruProfile>) => void;
  addPrestasi: (item: Omit<PrestasiItem, "id" | "status" | "submittedAt" | "verifiedAt" | "statusNote">) => void;
  deletePrestasi: (id: string) => void;
  addSertifikasi: (item: Omit<SertifikasiItem, "id" | "status" | "submittedAt" | "verifiedAt" | "statusNote">) => void;
  deleteSertifikasi: (id: string) => void;
  addKarya: (item: Omit<KaryaItem, "id" | "status" | "submittedAt" | "verifiedAt" | "statusNote">) => void;
  deleteKarya: (id: string) => void;
  submitPortfolioForReview: () => void;
  validatePortfolio: (guruId: string, status: ValidationStatus, note?: string) => void;
  validateItem: (
    guruId: string,
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    status: ItemStatus,
    note?: string
  ) => void;
  resubmitItem: (
    guruId: string,
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string
  ) => void;
  notifications: GuruNotification[];
  userNotifications: GuruNotification[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<GuruNotification, "id" | "createdAt" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (guruId: string) => void;
  clearNotifications: (guruId: string) => void;
  adminValidators: AdminValidator[];
  addAdminValidator: (admin: {
    email: string;
    name: string;
    nuptkOrNip?: string;
    roleTitle: string;
    scope: AdminVerificationScope;
  }) => { success: boolean; message: string };
  removeAdminValidator: (id: string) => { success: boolean; message: string };
  toggleAdminValidatorStatus: (id: string) => void;
  isSuperAdmin: boolean;
  currentAdminScope: AdminVerificationScope;
  quickLoginAsAdminScope: (scope: "prestasi" | "sertifikasi" | "karya") => void;
  canVerifyItem: (itemType: "prestasi" | "sertifikasi" | "karya") => boolean;
}

const PortoGuruContext = createContext<PortoGuruContextType | undefined>(undefined);

const STORAGE_KEY_PROFILES = "porto_guru_profiles_v3";
const STORAGE_KEY_USER = "porto_guru_auth_user_v3";
const STORAGE_KEY_NOTIFICATIONS = "porto_guru_notifications_v3";
const STORAGE_KEY_ADMINS = "porto_guru_admin_validators_v3";

export function PortoGuruProvider({ children }: { children: React.ReactNode }) {
  const [guruProfiles, setGuruProfiles] = useState<GuruProfile[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
        if (savedProfiles) {
          const parsed = JSON.parse(savedProfiles) as GuruProfile[];
          // Pastikan profil awalan seperti guru-aminah (Normatif) dan guru-farisi (Adaptif) tersedia
          const existingIds = new Set(parsed.map((g) => g.id));
          const missingInitial = INITIAL_GURU_DATA.filter((g) => !existingIds.has(g.id));
          const allProfiles = [...parsed, ...missingInitial];
          return allProfiles.map((g) => {
            const updated = { ...g };
            if (updated.id === "guru-chusni" || (updated.name && updated.name.includes("Chusni Mansur"))) {
              updated.name = "M. Chusni Agus, M. Pd.";
            }
            if (
              updated.jurusan !== "RPL" &&
              updated.jurusan !== "TKJ" &&
              updated.jurusan !== "PG" &&
              updated.jurusan !== "Normatif" &&
              updated.jurusan !== "Adaptif"
            ) {
              updated.jurusan = "RPL" as const;
            }
            return updated;
          });
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_GURU_DATA;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.guruId === "guru-chusni" || parsed.email === ADMIN_EMAIL || (parsed.name && parsed.name.includes("Chusni Mansur"))) {
            parsed.name = "M. Chusni Agus, M. Pd.";
          }
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return null;
  });

  const [notifications, setNotifications] = useState<GuruNotification[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
        if (savedNotifs) return JSON.parse(savedNotifs);
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Save profiles to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(guruProfiles));
    } catch {
      // ignore
    }
  }, [guruProfiles]);

  // Save auth user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Save notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const [adminValidators, setAdminValidators] = useState<AdminValidator[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ADMINS);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.map((a: AdminValidator) => {
            if (a.id === "admin-chusni" || a.email === ADMIN_EMAIL || (a.name && a.name.includes("Chusni Mansur"))) {
              return { ...a, name: "M. Chusni Agus, M. Pd." };
            }
            return a;
          });
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_ADMIN_VALIDATORS;
  });

  // Save admin validators
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(adminValidators));
    } catch {
      // ignore
    }
  }, [adminValidators]);

  const matchedAdmin = adminValidators.find(
    (a) =>
      a.email.toLowerCase() === currentUser?.email.toLowerCase() && a.isActive
  );
  const isAdmin =
    currentUser?.role === "admin" ||
    currentUser?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    Boolean(matchedAdmin);
  const isSuperAdmin =
    currentUser?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    matchedAdmin?.scope === "all" ||
    currentUser?.adminScope === "all";
  const currentAdminScope: AdminVerificationScope =
    currentUser?.adminScope || matchedAdmin?.scope || (isAdmin ? "all" : "all");

  const canVerifyItem = (itemType: "prestasi" | "sertifikasi" | "karya") => {
    if (!isAdmin) return false;
    if (isSuperAdmin || currentAdminScope === "all") return true;
    return currentAdminScope === itemType;
  };

  const addAdminValidator = (admin: {
    email: string;
    name: string;
    nuptkOrNip?: string;
    roleTitle: string;
    scope: AdminVerificationScope;
  }) => {
    const cleanEmail = admin.email.trim().toLowerCase();
    if (!cleanEmail.endsWith("@smktelkom-mlg.sch.id")) {
      return {
        success: false,
        message: "Email admin harus berakhiran domain resmi @smktelkom-mlg.sch.id",
      };
    }

    if (adminValidators.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        message: `Email ${cleanEmail} sudah terdaftar dalam tim verifikator.`,
      };
    }

    const newAdmin: AdminValidator = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name: admin.name.trim(),
      nuptkOrNip: admin.nuptkOrNip?.trim() || "-",
      roleTitle: admin.roleTitle.trim(),
      scope: admin.scope,
      addedAt: new Date().toISOString(),
      addedBy: currentUser?.name || "M. Chusni Agus, M. Pd.",
      isActive: true,
    };

    setAdminValidators((prev) => [...prev, newAdmin]);
    return {
      success: true,
      message: `Admin ${newAdmin.name} (${newAdmin.roleTitle}) berhasil ditambahkan ke tim verifikator!`,
    };
  };

  const removeAdminValidator = (id: string) => {
    const target = adminValidators.find((a) => a.id === id);
    if (!target) return { success: false, message: "Admin tidak ditemukan" };
    if (target.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: "Super Admin utama (M. Chusni Agus, M. Pd.) tidak dapat dihapus.",
      };
    }

    setAdminValidators((prev) => prev.filter((a) => a.id !== id));
    return {
      success: true,
      message: `Admin ${target.name} berhasil dihapus dari tim verifikator.`,
    };
  };

  const toggleAdminValidatorStatus = (id: string) => {
    setAdminValidators((prev) =>
      prev.map((a) => {
        if (a.id === id && a.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          return { ...a, isActive: !a.isActive };
        }
        return a;
      })
    );
  };

  const quickLoginAsAdminScope = (scope: "prestasi" | "sertifikasi" | "karya") => {
    const target = adminValidators.find((a) => a.scope === scope && a.isActive);
    if (target) {
      login(target.email);
    }
  };

  const approvedGuruProfiles = guruProfiles.filter(
    (g) => g.validationStatus === "approved"
  );
  const pendingGuruProfiles = guruProfiles.filter(
    (g) => g.validationStatus === "pending"
  );

  const addNotification = (notif: Omit<GuruNotification, "id" | "createdAt" | "read">) => {
    const newNotif: GuruNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = (guruId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.guruId === guruId ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = (guruId: string) => {
    setNotifications((prev) => prev.filter((n) => n.guruId !== guruId));
  };

  const userNotifications = currentUser?.guruId
    ? notifications.filter((n) => n.guruId === currentUser.guruId)
    : [];

  const unreadNotificationCount = userNotifications.filter((n) => !n.read).length;

  const login = (email: string, customName?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Validasi domain SMK Telkom Malang
    if (!cleanEmail.endsWith("@smktelkom-mlg.sch.id")) {
      return {
        success: false,
        message: "Akses ditolak. Wajib menggunakan akun email resmi @smktelkom-mlg.sch.id",
      };
    }

    // 1. Cek apakah email terdaftar dalam tim Admin Validator
    const registeredAdmin = adminValidators.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.isActive
    );
    if (registeredAdmin) {
      const user: AuthUser = {
        email: cleanEmail,
        name: registeredAdmin.name,
        role: "admin",
        adminScope: registeredAdmin.scope,
        roleTitle: registeredAdmin.roleTitle,
        guruId: "guru-chusni",
      };
      setCurrentUser(user);
      return {
        success: true,
        message: `Berhasil masuk sebagai ${registeredAdmin.roleTitle} (${registeredAdmin.name})`,
      };
    }

    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      const user: AuthUser = {
        email: cleanEmail,
        name: "M. Chusni Agus, M. Pd.",
        role: "admin",
        adminScope: "all",
        roleTitle: "Kepala Penjaminan Mutu (Super Admin)",
        guruId: "guru-chusni",
      };
      setCurrentUser(user);
      return {
        success: true,
        message: "Berhasil masuk sebagai Super Admin Penjamin Mutu (chusni@smktelkom-mlg.sch.id)",
      };
    }

    // Check if guru already exists in list
    let existing = guruProfiles.find((g) => g.email.toLowerCase() === cleanEmail);
    if (!existing) {
      // Buat profile guru baru otomatis jika email baru login pertama kali
      const extractedName =
        customName ||
        cleanEmail
          .replace("@smktelkom-mlg.sch.id", "")
          .split(/[\._]/)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");

      existing = {
        id: `guru-${Date.now()}`,
        email: cleanEmail,
        name: extractedName,
        nuptkOrNip: "-",
        jurusan: "RPL",
        mapel: "Pendidik Kejuruan",
        specializations: ["Teknologi Informasi"],
        bio: "Pendidik di SMK Telkom Malang.",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          extractedName
        )}`,
        validationStatus: "pending",
        submittedAt: new Date().toISOString(),
        prestasiList: [],
        sertifikasiList: [],
        karyaList: [],
      };

      setGuruProfiles((prev) => [existing!, ...prev]);
    }

    const user: AuthUser = {
      email: cleanEmail,
      name: existing.name,
      role: "guru",
      guruId: existing.id,
    };
    setCurrentUser(user);

    return {
      success: true,
      message: `Selamat datang, ${existing.name}! Anda masuk sebagai Pendidik SMK Telkom Malang.`,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    signOutSupabase();
  };

  const quickLoginAsAdmin = () => {
    login(ADMIN_EMAIL);
  };

  const quickLoginAsGuruBudi = () => {
    login("budi_santoso@smktelkom-mlg.sch.id");
  };

  const quickLoginAsGuruFauzanPending = () => {
    login("fauzan_akbar@smktelkom-mlg.sch.id");
  };

  // Helper to update current guru's profile
  const updateMyProfile = (updatedData: Partial<GuruProfile>) => {
    if (!currentUser || !currentUser.guruId) return;
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            ...updatedData,
          };
        }
        return g;
      })
    );
  };

  const addPrestasi = (item: Omit<PrestasiItem, "id" | "status" | "submittedAt" | "verifiedAt" | "statusNote">) => {
    if (!currentUser?.guruId) return;
    const newItemId = `p-${Date.now()}`;
    const newItem: PrestasiItem = {
      ...item,
      id: newItemId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            prestasiList: [newItem, ...g.prestasiList],
          };
        }
        return g;
      })
    );

    addNotification({
      guruId: currentUser.guruId,
      type: "pending",
      itemType: "prestasi",
      itemId: newItemId,
      itemTitle: item.title,
      title: "Pengajuan Prestasi Baru (Pending)",
      message: `Prestasi "${item.title}" (${item.level} • ${item.year}) berhasil diajukan dan sedang Menunggu Verifikasi oleh Admin Penjamin Mutu.`,
    });
  };

  const deletePrestasi = (id: string) => {
    if (!currentUser?.guruId) return;
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            prestasiList: g.prestasiList.filter((p) => p.id !== id),
          };
        }
        return g;
      })
    );
  };

  const addSertifikasi = (item: Omit<SertifikasiItem, "id" | "status" | "submittedAt" | "verifiedAt" | "statusNote">) => {
    if (!currentUser?.guruId) return;
    const newItemId = `s-${Date.now()}`;
    const newItem: SertifikasiItem = {
      ...item,
      id: newItemId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            sertifikasiList: [newItem, ...g.sertifikasiList],
          };
        }
        return g;
      })
    );

    addNotification({
      guruId: currentUser.guruId,
      type: "pending",
      itemType: "sertifikasi",
      itemId: newItemId,
      itemTitle: item.name,
      title: "Pengajuan Sertifikasi Baru (Pending)",
      message: `Sertifikasi "${item.name}" (${item.issuer} • ${item.year}) berhasil diajukan dan sedang Menunggu Verifikasi oleh Admin Penjamin Mutu.`,
    });
  };

  const deleteSertifikasi = (id: string) => {
    if (!currentUser?.guruId) return;
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            sertifikasiList: g.sertifikasiList.filter((s) => s.id !== id),
          };
        }
        return g;
      })
    );
  };

  const addKarya = (item: Omit<KaryaItem, "id" | "status" | "submittedAt" | "verifiedAt" | "statusNote">) => {
    if (!currentUser?.guruId) return;
    const newItemId = `k-${Date.now()}`;
    const newItem: KaryaItem = {
      ...item,
      id: newItemId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            karyaList: [newItem, ...g.karyaList],
          };
        }
        return g;
      })
    );

    addNotification({
      guruId: currentUser.guruId,
      type: "pending",
      itemType: "karya",
      itemId: newItemId,
      itemTitle: item.title,
      title: "Pengajuan Karya Baru (Pending)",
      message: `Karya "${item.title}" (${item.category} • ${item.year}) berhasil diajukan dan sedang Menunggu Verifikasi oleh Admin Penjamin Mutu.`,
    });
  };

  const deleteKarya = (id: string) => {
    if (!currentUser?.guruId) return;
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            karyaList: g.karyaList.filter((k) => k.id !== id),
          };
        }
        return g;
      })
    );
  };

  const resubmitItem = (
    guruId: string,
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string
  ) => {
    let affectedTitle = "";
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id !== guruId) return g;
        if (itemType === "prestasi") {
          return {
            ...g,
            prestasiList: g.prestasiList.map((p) => {
              if (p.id === itemId) {
                affectedTitle = p.title;
                return {
                  ...p,
                  status: "pending" as ItemStatus,
                  statusNote: undefined,
                  submittedAt: new Date().toISOString(),
                };
              }
              return p;
            }),
          };
        } else if (itemType === "sertifikasi") {
          return {
            ...g,
            sertifikasiList: g.sertifikasiList.map((s) => {
              if (s.id === itemId) {
                affectedTitle = s.name;
                return {
                  ...s,
                  status: "pending" as ItemStatus,
                  statusNote: undefined,
                  submittedAt: new Date().toISOString(),
                };
              }
              return s;
            }),
          };
        } else {
          return {
            ...g,
            karyaList: g.karyaList.map((k) => {
              if (k.id === itemId) {
                affectedTitle = k.title;
                return {
                  ...k,
                  status: "pending" as ItemStatus,
                  statusNote: undefined,
                  submittedAt: new Date().toISOString(),
                };
              }
              return k;
            }),
          };
        }
      })
    );

    const itemLabel =
      itemType === "prestasi"
        ? "Prestasi"
        : itemType === "sertifikasi"
        ? "Sertifikasi"
        : "Karya";

    addNotification({
      guruId,
      type: "pending",
      itemType,
      itemId,
      itemTitle: affectedTitle,
      title: `Pengajuan Ulang ${itemLabel} (Pending)`,
      message: `Pengajuan ulang untuk ${itemLabel.toLowerCase()} "${affectedTitle}" berhasil dikirimkan kembali ke Admin untuk diverifikasi.`,
    });
  };

  const validateItem = (
    guruId: string,
    itemType: "prestasi" | "sertifikasi" | "karya",
    itemId: string,
    status: ItemStatus,
    note?: string
  ) => {
    let affectedTitle = "";
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id !== guruId) return g;
        if (itemType === "prestasi") {
          return {
            ...g,
            prestasiList: g.prestasiList.map((p) => {
              if (p.id === itemId) {
                affectedTitle = p.title;
                return {
                  ...p,
                  status,
                  statusNote: note,
                  verifiedAt: new Date().toISOString(),
                };
              }
              return p;
            }),
          };
        } else if (itemType === "sertifikasi") {
          return {
            ...g,
            sertifikasiList: g.sertifikasiList.map((s) => {
              if (s.id === itemId) {
                affectedTitle = s.name;
                return {
                  ...s,
                  status,
                  statusNote: note,
                  verifiedAt: new Date().toISOString(),
                };
              }
              return s;
            }),
          };
        } else {
          return {
            ...g,
            karyaList: g.karyaList.map((k) => {
              if (k.id === itemId) {
                affectedTitle = k.title;
                return {
                  ...k,
                  status,
                  statusNote: note,
                  verifiedAt: new Date().toISOString(),
                };
              }
              return k;
            }),
          };
        }
      })
    );

    const itemLabel =
      itemType === "prestasi"
        ? "Prestasi"
        : itemType === "sertifikasi"
        ? "Sertifikasi"
        : "Karya";

    if (status === "approved") {
      addNotification({
        guruId,
        type: "verified",
        itemType,
        itemId,
        itemTitle: affectedTitle,
        title: `${itemLabel} Terverifikasi! ✅`,
        message: `Kabar baik! Pengajuan ${itemLabel.toLowerCase()} "${affectedTitle}" telah diverifikasi dan disahkan oleh Tim Penjamin Mutu (chusni@smktelkom-mlg.sch.id).`,
      });
    } else if (status === "rejected") {
      addNotification({
        guruId,
        type: "rejected",
        itemType,
        itemId,
        itemTitle: affectedTitle,
        title: `Pengajuan ${itemLabel} Ditolak (Perlu Revisi) ❌`,
        message: `Pengajuan ${itemLabel.toLowerCase()} "${affectedTitle}" belum dapat disetujui.`,
        adminNote: note || "Mohon lengkapi bukti dokumen resmi yang valid.",
      });
    } else {
      addNotification({
        guruId,
        type: "pending",
        itemType,
        itemId,
        itemTitle: affectedTitle,
        title: `Status ${itemLabel} Diubah ke Pending ⏳`,
        message: `Pengajuan ${itemLabel.toLowerCase()} "${affectedTitle}" dikembalikan ke antrean menunggu verifikasi admin.`,
      });
    }
  };

  const submitPortfolioForReview = () => {
    if (!currentUser?.guruId) return;
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === currentUser.guruId) {
          return {
            ...g,
            validationStatus: "pending",
            submittedAt: new Date().toISOString(),
            validationNote: undefined,
          };
        }
        return g;
      })
    );

    addNotification({
      guruId: currentUser.guruId,
      type: "pending",
      itemType: "portfolio",
      itemTitle: "Pengajuan Portofolio Lengkap",
      title: "Portofolio Lengkap Diajukan (Pending)",
      message: "Seluruh berkas portofolio Anda telah diajukan ke Tim Penjamin Mutu untuk validasi komprehensif.",
    });
  };

  const validatePortfolio = (
    guruId: string,
    status: ValidationStatus,
    note?: string
  ) => {
    setGuruProfiles((prev) =>
      prev.map((g) => {
        if (g.id === guruId) {
          // If approved, also approve any pending items
          const updatedPrestasi = status === "approved"
            ? g.prestasiList.map(p => p.status === "pending" ? { ...p, status: "approved" as ItemStatus, verifiedAt: new Date().toISOString() } : p)
            : g.prestasiList;
          const updatedSertifikasi = status === "approved"
            ? g.sertifikasiList.map(s => s.status === "pending" ? { ...s, status: "approved" as ItemStatus, verifiedAt: new Date().toISOString() } : s)
            : g.sertifikasiList;
          const updatedKarya = status === "approved"
            ? g.karyaList.map(k => k.status === "pending" ? { ...k, status: "approved" as ItemStatus, verifiedAt: new Date().toISOString() } : k)
            : g.karyaList;

          return {
            ...g,
            validationStatus: status,
            validationNote: note,
            validatedBy: ADMIN_EMAIL,
            validatedAt: new Date().toISOString(),
            prestasiList: updatedPrestasi,
            sertifikasiList: updatedSertifikasi,
            karyaList: updatedKarya,
          };
        }
        return g;
      })
    );

    if (status === "approved") {
      addNotification({
        guruId,
        type: "verified",
        itemType: "portfolio",
        itemTitle: "Portofolio Pendidik Resmi",
        title: "Portofolio Disahkan & Terverifikasi! ✅",
        message: "Selamat! Seluruh portofolio Anda telah diverifikasi oleh Admin Penjamin Mutu dan kini resmi tampil di tabel publik Daftar Guru.",
      });
    } else if (status === "rejected") {
      addNotification({
        guruId,
        type: "rejected",
        itemType: "portfolio",
        itemTitle: "Portofolio Pendidik",
        title: "Portofolio Perlu Revisi (Ditolak) ❌",
        message: "Portofolio Anda belum dapat disahkan oleh Admin Penjamin Mutu.",
        adminNote: note || "Mohon periksa dan perbaiki dokumen pendukung Anda.",
      });
    } else {
      addNotification({
        guruId,
        type: "pending",
        itemType: "portfolio",
        itemTitle: "Portofolio Pendidik",
        title: "Status Portofolio: Menunggu Verifikasi ⏳",
        message: "Portofolio Anda saat ini berada dalam antrean peninjauan oleh validator.",
      });
    }
  };

  return (
    <PortoGuruContext.Provider
      value={{
        currentUser,
        guruProfiles,
        approvedGuruProfiles,
        pendingGuruProfiles,
        isAdmin,
        login,
        logout,
        quickLoginAsAdmin,
        quickLoginAsGuruBudi,
        quickLoginAsGuruFauzanPending,
        updateMyProfile,
        addPrestasi,
        deletePrestasi,
        addSertifikasi,
        deleteSertifikasi,
        addKarya,
        deleteKarya,
        resubmitItem,
        submitPortfolioForReview,
        validatePortfolio,
        validateItem,
        notifications,
        userNotifications,
        unreadNotificationCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        adminValidators,
        addAdminValidator,
        removeAdminValidator,
        toggleAdminValidatorStatus,
        isSuperAdmin,
        currentAdminScope,
        quickLoginAsAdminScope,
        canVerifyItem,
      }}
    >
      {children}
    </PortoGuruContext.Provider>
  );
}

export function usePortoGuru() {
  const context = useContext(PortoGuruContext);
  if (!context) {
    throw new Error("usePortoGuru must be used within a PortoGuruProvider");
  }
  return context;
}

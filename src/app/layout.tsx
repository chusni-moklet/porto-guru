import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortoGuru — Direktori & Portofolio Resmi Pendidik SMK Telkom Malang",
  description:
    "Repositori resmi rekam jejak portofolio, sertifikasi industri (BNSP, Cisco, Oracle, GCP), prestasi, dan modul ajar dewan pendidik SMK Telkom Malang (Moklet).",
  keywords: [
    "Porto Guru",
    "SMK Telkom Malang",
    "Portofolio Guru Moklet",
    "Pendidik SMK Telkom Malang",
    "Sertifikasi Guru Kejuruan",
    "RPL",
    "TKJ",
    "PG",
    "Normatif",
    "Adaptif",
  ],
  authors: [{ name: "Tim Penjamin Mutu SMK Telkom Malang" }],
  openGraph: {
    title: "PortoGuru — Portofolio Resmi Pendidik SMK Telkom Malang",
    description:
      "Direktori resmi rekam jejak profesional, modul ajar, dan sertifikasi industri guru SMK Telkom Malang.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased selection:bg-blue-100 selection:text-blue-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


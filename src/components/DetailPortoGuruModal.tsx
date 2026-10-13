"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Award,
  BookOpen,
  FileBadge,
  Globe,
  ShieldCheck,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { GuruProfile } from "@/types/porto-guru";

interface DetailPortoGuruModalProps {
  guru: GuruProfile | null;
  onClose: () => void;
}

export default function DetailPortoGuruModal({
  guru,
  onClose,
}: DetailPortoGuruModalProps) {
  const [activeTab, setActiveTab] = useState<"prestasi" | "sertifikasi" | "karya">("prestasi");

  if (!guru) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header Profile */}
        <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={guru.avatarUrl}
              alt={guru.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {guru.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white">
                  {guru.jurusan}
                </span>
                {guru.validationStatus === "approved" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Tervalidasi Admin
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mt-1 font-mono">
                {guru.email} • NIP: {guru.nuptkOrNip}
              </p>
              <p className="text-xs text-blue-300 font-medium mt-0.5">
                {guru.mapel} — SMK Telkom Malang
              </p>
            </div>
          </div>

          {/* Validation attribution */}
          {guru.validatedBy && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Divalidasi secara resmi oleh Penjamin Mutu:{" "}
                <strong className="text-white">{guru.validatedBy}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Spesialisasi Badges & Bio */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/60 shrink-0 space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Bidang Keahlian / Spesialisasi
            </span>
            <div className="flex flex-wrap gap-1.5">
              {guru.specializations.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Profil Pendidik
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {guru.bio}
            </p>
          </div>
        </div>

        {/* Tab switcher: Prestasi, Sertifikasi, Karya */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white shrink-0 gap-6">
          <button
            onClick={() => setActiveTab("prestasi")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "prestasi"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            Prestasi ({guru.prestasiList.length})
          </button>

          <button
            onClick={() => setActiveTab("sertifikasi")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "sertifikasi"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileBadge className="w-4 h-4 text-blue-600" />
            Sertifikasi ({guru.sertifikasiList.length})
          </button>

          <button
            onClick={() => setActiveTab("karya")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "karya"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Karya & Modul ({guru.karyaList.length})
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* PRESTASI */}
          {activeTab === "prestasi" && (
            <div className="space-y-3">
              {guru.prestasiList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  Belum ada daftar prestasi yang dicantumkan.
                </p>
              ) : (
                guru.prestasiList.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-sm text-slate-900">
                          {p.title}
                        </h5>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {p.level}
                        </span>
                        {p.status === "approved" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Terverifikasi
                          </span>
                        ) : p.status === "pending" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Perlu Revisi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        Penyelenggara: {p.organizer} • Tahun {p.year}
                      </p>
                      {p.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                      {p.certificateUrl && (
                        <a
                          href={p.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline mt-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Tautan File Berkas ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SERTIFIKASI */}
          {activeTab === "sertifikasi" && (
            <div className="space-y-3">
              {guru.sertifikasiList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  Belum ada daftar sertifikasi kompetensi yang dicantumkan.
                </p>
              ) : (
                guru.sertifikasiList.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-sm text-slate-900">
                          {s.name}
                        </h5>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Tahun {s.year}
                        </span>
                        {s.status === "approved" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Terverifikasi
                          </span>
                        ) : s.status === "pending" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Perlu Revisi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        Lembaga Penerbit: {s.issuer}
                      </p>
                      {s.credentialId && (
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          No. Kredensial: {s.credentialId}
                        </p>
                      )}
                      {s.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {s.description}
                        </p>
                      )}
                      {s.certificateUrl && (
                        <a
                          href={s.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline mt-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Tautan File Berkas ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* KARYA */}
          {activeTab === "karya" && (
            <div className="space-y-3">
              {guru.karyaList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  Belum ada daftar karya yang dicantumkan.
                </p>
              ) : (
                guru.karyaList.map((k) => (
                  <div
                    key={k.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-sm text-slate-900">
                          {k.title}
                        </h5>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                          {k.category} • {k.year}
                        </span>
                        {k.status === "approved" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Terverifikasi
                          </span>
                        ) : k.status === "pending" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Perlu Revisi
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {k.description}
                    </p>
                    {k.linkUrl && (
                      <a
                        href={k.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline mt-2"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Akses Tautan Karya ↗
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Portofolio Resmi SMK Telkom Malang</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-black cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

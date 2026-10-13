"use client";

import React, { useEffect } from "react";
import {
  X,
  Award,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building,
  KeyRound,
  FileCheck2,
} from "lucide-react";
import { CertificationItem } from "./Certifications";

interface CredentialModalProps {
  credential: CertificationItem | null;
  onClose: () => void;
}

export default function CredentialModal({ credential, onClose }: CredentialModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (credential) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [credential, onClose]);

  if (!credential) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Credential
            </span>
            <span className="text-xs text-blue-100 font-mono">
              {credential.credentialId}
            </span>
          </div>

          <h3 id="modal-headline" className="text-xl sm:text-2xl font-bold leading-snug">
            {credential.title}
          </h3>
          <p className="text-sm text-blue-100 mt-1 font-medium">
            Issued by {credential.issuer}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
            <div>
              <p className="text-xs text-[#94A3B8] font-semibold uppercase">Date Issued</p>
              <p className="text-sm font-bold text-[#1E293B] mt-0.5">{credential.issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-semibold uppercase">Validity / Status</p>
              <p className="text-sm font-bold text-[#10B981] mt-0.5">{credential.expiration}</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-semibold uppercase">Issuer Authority</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{credential.issuer}</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-semibold uppercase">Badge Level</p>
              <p className="text-xs font-bold text-[#2563EB] mt-0.5">{credential.badgeName}</p>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Certification Scope & Significance
            </h4>
            <p className="text-sm text-[#475569] leading-relaxed">
              {credential.summary}
            </p>
          </div>

          {/* Competencies Verified */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3">
              Verified Pedagogical Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {credential.skillsCovered.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-semibold border border-blue-100"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={credential.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm"
            >
              <span>Verify at Official Registry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 text-xs font-semibold text-[#475569] hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

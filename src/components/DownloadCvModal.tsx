"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileDown,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  Download,
  Check,
  FileText,
} from "lucide-react";

interface DownloadCvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadCvModal({ isOpen, onClose }: DownloadCvModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const triggerDownload = () => {
    setDownloading(true);

    const cvContent = `
========================================================================
CURRICULUM VITAE — DR. SARAH JENKINS, M.Ed.
Head of STEM & Innovation | Secondary Science Education Specialist
Email: sarah.jenkins@eduprecision.org | Location: Boston, MA
========================================================================

1. EDUCATION & CREDENTIALS
------------------------------------------------------------------------
• M.Ed. in Learning Design, Innovation & Technology
  Harvard Graduate School of Education, Cambridge, MA (2015)
• B.S. in Applied Physics & Secondary Science Pedagogy
  University of Massachusetts Amherst (Magna Cum Laude, 2010)
• National Board Certified Teacher (NBCT) — Secondary Science (2021-Present)
• Google Certified Educator & Certified Instructional Coach (Level 2)
• Apple Distinguished Educator (ADE) Class of 2022

2. PROFESSIONAL EXPERIENCE
------------------------------------------------------------------------
• Head of STEM & Innovation | Westlake STEM Academy (2018 - Present)
  - Directed 14-faculty cross-disciplinary STEM department.
  - Spearheaded $180,000 innovation laboratory upgrade (3D print, robotics, sensors).
  - Raised state standardized science test proficiency from 72% to 94%.
• Lead Science Educator & Robotics Coordinator | Oakridge High (2012 - 2018)
  - Coached FIRST LEGO League teams to 3 consecutive state finals.
  - Implemented district-wide computational thinking and Python modules.

3. MAJOR PUBLICATIONS & SCHOLARSHIP
------------------------------------------------------------------------
• Book: "Hands-On STEM: Practical Inquiry for Modern Classrooms" (Routledge, 2024)
• Article: "Universal Design for Learning: Beyond Surface Accommodations" (Journal of STEM Education, 2023)
• Article: "Generative AI as a Thinking Partner: A Teacher's Field Guide" (Education Week, 2024)
• Article: "Fostering Computational Thinking in Middle School Science" (Edutopia, 2024)

4. GRANTS & COMPETITIVE AWARDS SECURED
------------------------------------------------------------------------
• National Science Teaching Association (NSTA) STEM Teacher of the Year Finalist (2023)
• National Science Foundation (NSF) Classroom Innovation Grant ($120,000 - Co-PI)
• State Educational Technology Board Grant ($60,000)

========================================================================
Verification & References available upon request.
========================================================================
`;

    const blob = new Blob([cvContent.trim()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Dr_Sarah_Jenkins_Curriculum_Vitae_2026.txt");
    document.body.appendChild(link);

    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(false);
      setDownloaded(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <FileDown className="w-3.5 h-3.5" />
              Official Curriculum Vitae
            </span>
          </div>

          <h3 id="cv-modal-title" className="text-xl sm:text-2xl font-bold leading-snug">
            Dr. Sarah Jenkins, M.Ed. — CV
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Updated for 2026 Academic Year • 6 Pages Comprehensive Dossier
          </p>
        </div>

        {/* Body Overview */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Summary Highlights */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E293B]">Education</p>
                <p className="text-xs text-[#64748B]">
                  Harvard Graduate School of Education (M.Ed.) • UMass Amherst (B.S. Physics)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E293B]">Frontline Leadership</p>
                <p className="text-xs text-[#64748B]">
                  Head of STEM & Innovation (15+ Years) • 5,000+ Students Mentored
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E293B]">Awards & Grants</p>
                <p className="text-xs text-[#64748B]">
                  NSTA National Finalist • $340,000+ in Classroom STEM Grants Secured
                </p>
              </div>
            </div>
          </div>

          {/* Download Action Box */}
          <div className="p-5 rounded-2xl bg-[#EFF6FF] border border-blue-200 text-center space-y-3">
            <FileText className="w-8 h-8 text-[#2563EB] mx-auto" />
            <div>
              <p className="text-sm font-bold text-[#1E293B]">
                Download Complete Verified CV
              </p>
              <p className="text-xs text-[#64748B] mt-0.5">
                Includes full bibliography, conference keynote history, and teaching evaluation records.
              </p>
            </div>

            <button
              onClick={triggerDownload}
              disabled={downloading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-75 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              {downloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing document...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Downloaded! Click to download again</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Curriculum Vitae (Dossier)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

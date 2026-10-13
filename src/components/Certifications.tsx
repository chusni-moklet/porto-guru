"use client";

import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
  FileCheck2,
  Sparkles,
} from "lucide-react";

export interface CertificationItem {
  id: string;
  category: "all" | "edtech" | "pedagogy" | "awards";
  title: string;
  issuer: string;
  issuerLogoBg: string;
  issueDate: string;
  expiration: string;
  credentialId: string;
  verificationUrl: string;
  badgeName: string;
  skillsCovered: string[];
  summary: string;
}

export const certificationsList: CertificationItem[] = [
  {
    id: "nbct-science",
    category: "pedagogy",
    title: "National Board Certified Teacher (NBCT)",
    issuer: "National Board for Professional Teaching Standards",
    issuerLogoBg: "bg-blue-600 text-white",
    issueDate: "November 2021",
    expiration: "Lifetime / Maintained 2026",
    credentialId: "NBPTS-EA-SCI-84920",
    verificationUrl: "https://www.nbpts.org/verify-credentials",
    badgeName: "Highest Teaching Honor",
    skillsCovered: ["Formative Assessment", "Pedagogical Content Knowledge", "Student Engagement", "Inquiry-Based Science"],
    summary:
      "The gold standard in US teacher certification. Demonstrated mastery through peer-reviewed student work portfolios, pedagogical analysis, and rigorous content exams in secondary science.",
  },
  {
    id: "google-level-2",
    category: "edtech",
    title: "Google Certified Educator Level 2 & Certified Coach",
    issuer: "Google for Education",
    issuerLogoBg: "bg-amber-500 text-white",
    issueDate: "August 2023",
    expiration: "Valid through Aug 2026",
    credentialId: "G-EDU-L2-993817",
    verificationUrl: "https://edu.google.com/teacher-center/certifications",
    badgeName: "Advanced Tech Mastery",
    skillsCovered: ["Google Workspace for Education", "Flipped Learning", "Instructional Coaching Cycle", "Data Dashboards"],
    summary:
      "Certified to instruct and mentor educators on leveraging advanced Google Workspace collaborative tools, Classroom APIs, and real-time student feedback mechanisms.",
  },
  {
    id: "mie-expert",
    category: "edtech",
    title: "Microsoft Innovative Educator Expert (MIE Expert)",
    issuer: "Microsoft Education",
    issuerLogoBg: "bg-cyan-600 text-white",
    issueDate: "September 2023",
    expiration: "Annual Global Cohort 2024-2026",
    credentialId: "MS-MIEE-GLOBAL-202341",
    verificationUrl: "https://education.microsoft.com",
    badgeName: "Global Fellow",
    skillsCovered: ["Minecraft Education STEM", "OneNote Classroom", "MakeCode Micro:bit", "Inclusive Reader"],
    summary:
      "Global visionary recognition for pioneering student-centered game-based learning and accessibility tools like Immersive Reader for neurodiverse students.",
  },
  {
    id: "mit-stem",
    category: "pedagogy",
    title: "STEM Leadership & Maker Pedagogies",
    issuer: "MIT OpenLearning & Edgerton Center",
    issuerLogoBg: "bg-red-700 text-white",
    issueDate: "June 2022",
    expiration: "Permanent Certification",
    credentialId: "MIT-EDG-STEM-11093",
    verificationUrl: "https://openlearning.mit.edu",
    badgeName: "MIT Academic Fellow",
    skillsCovered: ["Design Thinking", "Rapid Prototyping", "Robotics Curriculum", "Maker Space Safety"],
    summary:
      "Intensive 180-hour fellowship focused on implementing experiential physical computing, sensor-based laboratory data logging, and low-cost prototyping in secondary education.",
  },
  {
    id: "national-award-2023",
    category: "awards",
    title: "National STEM Teacher of the Year Finalist",
    issuer: "National Science Teaching Association (NSTA)",
    issuerLogoBg: "bg-orange-500 text-white",
    issueDate: "May 2023",
    expiration: "Honorary Lifetime Award",
    credentialId: "NSTA-AWD-FINAL-2023",
    verificationUrl: "https://www.nsta.org/awards",
    badgeName: "Distinguished Award",
    skillsCovered: ["Innovative Pedagogy", "Community Impact", "Student Research Mentorship", "Peer Leadership"],
    summary:
      "Selected as one of 5 national finalists for groundbreaking student robotics initiatives that solved local watershed pollution monitoring challenges.",
  },
  {
    id: "apple-distinguished",
    category: "edtech",
    title: "Apple Distinguished Educator (ADE)",
    issuer: "Apple Education",
    issuerLogoBg: "bg-slate-800 text-white",
    issueDate: "March 2022",
    expiration: "Active ADE Network",
    credentialId: "ADE-CLASS-2022-NA",
    verificationUrl: "https://www.apple.com/education/ade",
    badgeName: "EdTech Pioneer",
    skillsCovered: ["Swift Playgrounds", "Keynote Interactive Animations", "GarageBand Podcasts", "Accessibility"],
    summary:
      "Recognized for authoring interactive multi-touch biology and robotics laboratory guides utilizing Swift Playgrounds and augmented reality iPad apps.",
  },
];

interface CertificationsProps {
  onSelectCredential: (item: CertificationItem) => void;
}

export default function Certifications({ onSelectCredential }: CertificationsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "edtech" | "pedagogy" | "awards">("all");

  const filtered =
    activeTab === "all"
      ? certificationsList
      : certificationsList.filter((c) => c.category === activeTab);

  return (
    <section id="certifications" className="py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Qualifications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
              Certifications & Professional Honors
            </h2>
            <p className="mt-3 text-base text-[#64748B] leading-relaxed">
              Maintained credentials demonstrating rigorous mastery in instructional technology, standards-based STEM pedagogy, and national excellence.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-full border border-[#E2E8F0]">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setActiveTab("edtech")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "edtech"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              EdTech & AI
            </button>
            <button
              onClick={() => setActiveTab("pedagogy")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "pedagogy"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              Pedagogy
            </button>
            <button
              onClick={() => setActiveTab("awards")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "awards"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              Awards
            </button>
          </div>
        </div>

        {/* Grid of Cards (Mimicking Featured Courses layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(37,99,235,0.09)] hover:border-blue-200 flex flex-col justify-between"
            >
              <div>
                {/* Top: Issuer header & Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${item.issuerLogoBg}`}
                    >
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#64748B] block truncate max-w-[180px]">
                        {item.issuer}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981]">
                        <CheckCircle className="w-3 h-3" />
                        Verified Active
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 whitespace-nowrap">
                    {item.badgeName}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Metadata Pills */}
                <div className="space-y-1.5 pt-3 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#94A3B8]">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued
                    </span>
                    <span className="font-medium text-[#1E293B]">{item.issueDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#94A3B8]">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      Credential ID
                    </span>
                    <span className="font-mono text-[11px] text-[#475569]">{item.credentialId}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {item.skillsCovered.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                    >
                      {skill}
                    </span>
                  ))}
                  {item.skillsCovered.length > 3 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-50 text-[#94A3B8]">
                      +{item.skillsCovered.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
                <button
                  onClick={() => onSelectCredential(item)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold hover:bg-[#2563EB] hover:text-white transition-all duration-200 border border-blue-100 group-hover:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <span>View Credential Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

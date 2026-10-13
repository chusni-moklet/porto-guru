"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Bookmark,
  Clock,
  Calendar,
  ExternalLink,
  Star,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  publication: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
  excerpt: string;
  linkUrl: string;
}

const articles: ArticleItem[] = [
  {
    id: "art-1",
    title: "Fostering Computational Thinking in Middle School Science",
    publication: "Edutopia & George Lucas Educational Foundation",
    date: "February 2024",
    readTime: "6 min read",
    tag: "Computer Science",
    tagColor: "bg-blue-50 text-[#2563EB] border-blue-100",
    excerpt:
      "How to deconstruct algorithmic logic through physical simulations before touching computer screens. Includes classroom rubrics tested on 300+ students.",
    linkUrl: "#",
  },
  {
    id: "art-2",
    title: "Universal Design for Learning: Beyond Surface Accommodations",
    publication: "Journal of STEM Education & Pedagogy",
    date: "October 2023",
    readTime: "12 min read",
    tag: "Inclusive Education",
    tagColor: "bg-emerald-50 text-[#10B981] border-emerald-100",
    excerpt:
      "A peer-reviewed investigation into multi-sensory robotics labs that eliminated achievement gaps for neurodiverse middle school cohorts.",
    linkUrl: "#",
  },
  {
    id: "art-3",
    title: "Generative AI as a Thinking Partner: A Teacher's Field Guide",
    publication: "Education Week Leadership Forum",
    date: "August 2024",
    readTime: "8 min read",
    tag: "EdTech & AI",
    tagColor: "bg-purple-50 text-purple-600 border-purple-100",
    excerpt:
      "Practical classroom policies that encourage students to use LLMs for Socratic inquiry while preventing passive plagiarism in science labs.",
    linkUrl: "#",
  },
  {
    id: "art-4",
    title: "Building Inquiry Labs on a Public School Budget",
    publication: "NSTA Science Scope",
    date: "April 2023",
    readTime: "7 min read",
    tag: "Classroom Funding",
    tagColor: "bg-amber-50 text-amber-700 border-amber-100",
    excerpt:
      "Tactical advice on securing community grants, upcycling donor equipment, and building microcontroller sensor labs for under $15 per student station.",
    linkUrl: "#",
  },
];

export default function Publications() {
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "book">("all");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadSample = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section id="publications" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scholarship & Thought Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Featured Publications & Educational Writings
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Bridging empirical research with frontline classroom realities. Read published books, peer-reviewed papers, and practitioner articles.
          </p>
        </div>

        {/* Featured Book Showcase (Hero card inside section) */}
        <div className="mb-16 bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.08)] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Book 3D Cover Wrapper */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-[240px] sm:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.14)] border border-slate-200 group">
                <Image
                  src="/book-cover.jpg"
                  alt="Book Cover: Hands-On STEM by Dr. Sarah Jenkins"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 280px, 320px"
                />
                <div className="absolute top-3 left-3 bg-[#F97316] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  Published 2024
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                    Featured Educational Book
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0</span>
                    <span className="text-[#64748B] font-normal">(180+ Educator Reviews)</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#1E293B] leading-tight">
                  Hands-On STEM: Practical Inquiry for Modern Classrooms
                </h3>
                <p className="text-sm text-[#2563EB] font-semibold mt-1">
                  Published by Routledge Education • 320 Pages • ISBN 978-0-367-48291
                </p>

                <p className="text-sm sm:text-base text-[#64748B] mt-4 leading-relaxed">
                  A comprehensive practitioner&apos;s manual for educators seeking to introduce student-led inquiry, physical computing, and robotics without prohibitive budgets. Includes 40 reproducible lesson modules, NGSS alignment matrices, and step-by-step troubleshooting for maker equipment.
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <div className="flex items-start gap-2 text-xs text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span>40+ Ready-to-teach lab exercises & assessments</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span>Low-cost materials guide ($15/student station)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span>Universal Design for Learning (UDL) adaptations</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span>Adopted by 45+ school districts nationwide</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  onClick={handleDownloadSample}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadSuccess ? "Sample Downloaded!" : "Download Free Sample Chapter (PDF)"}</span>
                </button>

                <a
                  href="https://amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E2E8F0] text-sm font-semibold text-[#1E293B] hover:bg-slate-50 transition-colors"
                >
                  <span>Order on Routledge / Amazon</span>
                  <ExternalLink className="w-4 h-4 text-[#64748B]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1E293B]">Selected Articles & Research Papers</h3>
            <span className="text-xs font-semibold text-[#64748B]">Showing 4 Recent Publications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(37,99,235,0.06)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors leading-snug mb-2">
                    {item.title}
                  </h4>

                  <p className="text-xs font-semibold text-[#64748B] mb-3">
                    {item.publication}
                  </p>

                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2563EB] group-hover:underline flex items-center gap-1">
                    Read Article <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-[#94A3B8] group-hover:bg-blue-50 group-hover:text-[#2563EB] transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

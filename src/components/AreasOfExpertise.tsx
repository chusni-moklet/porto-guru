"use client";

import React, { useState } from "react";
import {
  Cpu,
  BookMarked,
  HeartHandshake,
  Laptop,
  Lightbulb,
  UserCheck,
  Check,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface SkillItem {
  id: string;
  category: "stem" | "pedagogy" | "leadership";
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  metric: string;
  metricLabel: string;
  accentBg: string;
  accentText: string;
  badge: string;
}

const skillsData: SkillItem[] = [
  {
    id: "stem",
    category: "stem",
    icon: <Cpu className="w-6 h-6" />,
    title: "STEM & Robotics Inquiry",
    tagline: "Hands-on Engineering & Algorithmic Literacy",
    description:
      "Integrating hands-on physical computing with microcontrollers (Arduino, Micro:bit), Python coding, and robotics competitions to develop rigorous analytical problem-solving in young minds.",
    highlights: [
      "Head Coach for FIRST LEGO League (State Finalists 2022-2024)",
      "Cross-curricular physics & code integration modules",
      "Lab safety & maker-space equipment stewardship",
    ],
    metric: "120+",
    metricLabel: "Robotics kits built",
    accentBg: "bg-blue-50 text-[#2563EB] border-blue-100",
    accentText: "text-[#2563EB]",
    badge: "Core Discipline",
  },
  {
    id: "curriculum",
    category: "pedagogy",
    icon: <BookMarked className="w-6 h-6" />,
    title: "Curriculum Architecture",
    tagline: "Standards-Aligned Inquiry Frameworks",
    description:
      "Crafting multi-tiered K-12 curricula conforming to Next Generation Science Standards (NGSS) and ISTE guidelines, pairing rigorous conceptual checkpoints with real-world inquiry rubrics.",
    highlights: [
      "Authored district-wide middle school STEM syllabi",
      "Formative assessment rubric libraries adopted by 8 schools",
      "Backwards design framework with clear mastery milestones",
    ],
    metric: "18+",
    metricLabel: "Custom curricula authored",
    accentBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    accentText: "text-indigo-600",
    badge: "Standards-Aligned",
  },
  {
    id: "inclusive",
    category: "pedagogy",
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Inclusive & Neurodiverse Learning",
    tagline: "Universal Design for Learning (UDL)",
    description:
      "Creating supportive, multimodal learning spaces that empower students with ADHD, dyslexia, and varied processing styles through adaptive technologies and differentiated scaffolding.",
    highlights: [
      "Multimodal assignments (audio, visual, tactile prototypes)",
      "Individualized Education Program (IEP) collaboration lead",
      "Sensory-conscious classroom spatial planning",
    ],
    metric: "100%",
    metricLabel: "IEP goal progress rate",
    accentBg: "bg-emerald-50 text-[#10B981] border-emerald-100",
    accentText: "text-[#10B981]",
    badge: "Equity & Inclusion",
  },
  {
    id: "edtech",
    category: "stem",
    icon: <Laptop className="w-6 h-6" />,
    title: "EdTech & Generative AI Ethics",
    tagline: "Modern Digital Tools & AI Literacy",
    description:
      "Guiding students and faculty on ethical GenAI utilization, data privacy, and modern educational platforms to enhance critical thinking without compromising academic integrity.",
    highlights: [
      "Developed 'AI as Thinking Partner' high school curriculum",
      "Implementation of flipped classrooms via interactive LMS",
      "Digital citizenship & cybersecurity modules",
    ],
    metric: "94%",
    metricLabel: "Student engagement boost",
    accentBg: "bg-amber-50 text-amber-600 border-amber-100",
    accentText: "text-amber-600",
    badge: "Emerging Tech",
  },
  {
    id: "pbl",
    category: "pedagogy",
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Project-Based Learning (PBL)",
    tagline: "Community-Driven Engineering Sprints",
    description:
      "Orchestrating interdisciplinary design challenges where student teams solve local environmental and urban infrastructure problems, presenting solutions to civic stakeholders.",
    highlights: [
      "Annual Community Science Expo (400+ attendees)",
      "Zero-carbon campus initiative designed by student cohort",
      "Rapid prototyping with 3D printers and laser cutters",
    ],
    metric: "45+",
    metricLabel: "Community projects shipped",
    accentBg: "bg-orange-50 text-[#F97316] border-orange-100",
    accentText: "text-[#F97316]",
    badge: "Real-World Impact",
  },
  {
    id: "mentorship",
    category: "leadership",
    icon: <UserCheck className="w-6 h-6" />,
    title: "Faculty Coaching & Mentorship",
    tagline: "Empowering Next-Generation Teachers",
    description:
      "Facilitating professional development seminars, clinical peer observation cycles, and instructional coaching to assist early-career educators in instructional design and classroom management.",
    highlights: [
      "Led 24+ regional teacher professional development institutes",
      "Mentored 65+ student teachers through university practica",
      "Instructional coaching on active-learning classroom culture",
    ],
    metric: "350+",
    metricLabel: "Educators trained",
    accentBg: "bg-purple-50 text-purple-600 border-purple-100",
    accentText: "text-purple-600",
    badge: "Leadership",
  },
];

export default function AreasOfExpertise() {
  const [filter, setFilter] = useState<"all" | "stem" | "pedagogy" | "leadership">("all");

  const filteredSkills =
    filter === "all"
      ? skillsData
      : skillsData.filter((item) => item.category === filter);

  return (
    <section id="expertise" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pedagogical Domains</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Areas of Pedagogical Expertise
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Combining rigorous scientific inquiry with compassionate, student-centered instruction to build classrooms where every learner thrives.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === "all"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              All Domains (6)
            </button>
            <button
              onClick={() => setFilter("stem")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === "stem"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              STEM & Emerging Tech
            </button>
            <button
              onClick={() => setFilter("pedagogy")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === "pedagogy"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              Curriculum & Inclusion
            </button>
            <button
              onClick={() => setFilter("leadership")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === "leadership"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              Faculty Leadership
            </button>
          </div>
        </div>

        {/* Bento Grid Layout (Cards with 16px radius and soft elevation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group bg-white rounded-2xl border border-[#E2E8F0] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:border-blue-200 flex flex-col justify-between"
            >
              <div>
                {/* Top header within card */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${skill.accentBg} transition-transform duration-300 group-hover:scale-105`}
                  >
                    {skill.icon}
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-[#64748B] border border-slate-200">
                    {skill.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors leading-snug">
                  {skill.title}
                </h3>
                <p className="text-xs font-semibold text-[#2563EB] mt-0.5 mb-3">
                  {skill.tagline}
                </p>

                <p className="text-sm text-[#64748B] leading-relaxed mb-5">
                  {skill.description}
                </p>

                {/* Key Bullet Highlights */}
                <div className="space-y-2 mb-6 pt-4 border-t border-[#F1F5F9]">
                  {skill.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#475569]">
                      <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Metric Box */}
              <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-[#1E293B]">
                    {skill.metric}
                  </span>
                  <span className="text-xs text-[#64748B] ml-1.5 font-medium">
                    {skill.metricLabel}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#94A3B8] group-hover:bg-blue-50 group-hover:text-[#2563EB] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

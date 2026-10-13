"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Are you available for school consulting, keynotes, or district workshops in 2026?",
    answer:
      "Yes. I actively accept invitations for keynote addresses at educational conferences, full-day faculty professional development institutes, and ongoing district curriculum audits. Both in-person visits and multi-week virtual coaching cohorts are available.",
    category: "Consulting & Speaking",
  },
  {
    id: "faq-2",
    question: "How can our school or institution license your STEM inquiry curriculum?",
    answer:
      "The complete curriculum modules, laboratory guides, and assessment rubrics detailed in 'Hands-On STEM' are available under institutional site licenses. This includes editable lesson plans, equipment sourcing spreadsheets, student workbooks, and slide decks aligned with NGSS standards.",
    category: "Curriculum Licensing",
  },
  {
    id: "faq-3",
    question: "What grade bands and age levels do your programs target?",
    answer:
      "While my frontline classroom tenure is concentrated in secondary education (Grades 6–12, ages 11–18), the inquiry frameworks, UDL accessibility principles, and physical computing lessons have been successfully adapted for upper elementary (Grades 4–5) and introductory undergraduate STEM seminars.",
    category: "Grade Levels",
  },
  {
    id: "faq-4",
    question: "What is your pedagogical stance on Generative AI tools in the classroom?",
    answer:
      "I view Generative AI as an intellectual bicycle — a tool for iterative brainstorming, debugging code, and Socratic challenge, rather than a surrogate for deep critical thinking. My curriculum incorporates explicit 'AI Transparency Rubrics' where students cite AI prompts and critically verify machine hallucinations.",
    category: "AI & EdTech",
  },
  {
    id: "faq-5",
    question: "Do you mentor high school students for ISEF science fairs or robotics teams?",
    answer:
      "Yes. I mentor a selective cohort of 8–10 independent student researchers annually, guiding them through experimental design, statistical data analysis, and technical presentation defense for Regeneron ISEF and FIRST Robotics competitions.",
    category: "Student Mentorship",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Everything you need to know regarding consulting engagements, speaking availability, and curriculum licensing.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#F8FAFC] border-blue-200 shadow-sm"
                    : "bg-white border-[#E2E8F0] hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 sm:px-7 flex items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-inset"
                >
                  <span className="text-base sm:text-lg font-bold text-[#1E293B] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-100 text-[#64748B]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-[#64748B] leading-relaxed border-t border-[#E2E8F0]/60 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#2563EB]">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA prompt */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#EFF6FF] border border-blue-100">
          <p className="text-sm font-semibold text-[#1E293B]">
            Have a custom collaboration or district inquiry not answered here?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] underline underline-offset-4"
          >
            Send a direct message or schedule a call &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

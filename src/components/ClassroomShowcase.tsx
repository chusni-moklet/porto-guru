"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Quote,
  Lightbulb,
  Cpu,
  Layers,
} from "lucide-react";

export default function ClassroomShowcase() {
  return (
    <section id="classroom" className="py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with Overlays */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)] border-4 border-white group">
              <Image
                src="/stem-classroom.jpg"
                alt="STEM Innovation Lab in action"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#2563EB] text-white shadow-sm inline-block mb-2">
                  Innovation Lab
                </span>
                <p className="text-base font-bold text-white leading-snug">
                  Westlake Academy STEM Discovery Lab
                </p>
                <p className="text-xs text-slate-200 mt-1">
                  Students collaborating on Arduino sensor-driven environmental monitoring probes.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Metric */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xl items-center gap-3.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-[#1E293B] leading-tight">100% Student Agency</p>
                <p className="text-xs text-[#64748B]">Inquiry-led lab experiments</p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Philosophy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase self-start">
              <Compass className="w-3.5 h-3.5" />
              <span>Experiential Pedagogy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
              Transforming the Classroom into a Launchpad for Curiosity
            </h2>

            <p className="text-base text-[#64748B] leading-relaxed">
              True scientific literacy doesn&apos;t happen through passive rote memorization. In my laboratory classrooms, students formulate authentic research questions, build physical prototypes, test failure points, and iterate with real engineering rigor.
            </p>

            {/* Quote Box */}
            <div className="bg-[#F8FAFC] border-l-4 border-[#2563EB] p-5 rounded-r-2xl">
              <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-[#2563EB] shrink-0 opacity-70" />
                <p className="text-sm italic font-medium text-[#334155] leading-relaxed">
                  &ldquo;When students are given ownership of their questions, they stop asking &lsquo;is this for the test?&rsquo; and start asking &lsquo;what happens if we try this next?&rsquo;&rdquo;
                </p>
              </div>
              <p className="text-xs font-bold text-[#64748B] text-right mt-2">
                — Dr. Sarah Jenkins, M.Ed.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1E293B]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Zero-Barrier Entry for All Learners</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1E293B]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Real-Time Sensor Data Logging</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1E293B]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Iterative Design Sprint Sprints</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1E293B]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Peer-to-Peer Code Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

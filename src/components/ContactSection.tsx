"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Loader2,
} from "lucide-react";

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "Speaking / Keynote",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        organization: "",
        inquiryType: "Speaking / Keynote",
        message: "",
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold tracking-wide uppercase mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight leading-[1.2]">
            Let&apos;s Build Inspiring Learning Experiences
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Whether you&apos;re planning an upcoming educational symposium, seeking curriculum licensing, or revamping your STEM lab, let&apos;s connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-8">
            <div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">Direct Inquiries</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                I prioritize school leaders, educators, and conference organizers. Expect a thoughtful reply within one business day.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Email Address</p>
                  <a
                    href="mailto:sarah.jenkins@eduprecision.org"
                    className="text-sm font-bold text-[#1E293B] hover:text-[#2563EB] transition-colors"
                  >
                    sarah.jenkins@eduprecision.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Response Window</p>
                  <p className="text-sm font-bold text-[#1E293B]">Within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Based in</p>
                  <p className="text-sm font-bold text-[#1E293B]">Boston, MA • Available Worldwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Direct Zoom Booking</p>
                  <p className="text-sm font-bold text-[#1E293B]">20-Minute Intro Discovery Call</p>
                </div>
              </div>
            </div>

            {/* Quick Action Button for Zoom */}
            <div className="pt-4 border-t border-[#F1F5F9]">
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#1E293B] hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span>Open Calendly Scheduler</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] p-8 sm:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Send a Message</h3>
            <p className="text-sm text-[#64748B] mb-6">
              Fill out the form below and I&apos;ll get back to you with custom syllabus samples or speaking availability.
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#065F46] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                <div className="text-sm font-medium">
                  <strong>Message sent successfully!</strong> Thank you for reaching out. Dr. Jenkins will respond shortly.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Dr. Jennifer Vance"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="e.g. jvance@academy.edu"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    value={formState.organization}
                    onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                    placeholder="e.g. Westlake Unified School District"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                    Inquiry Category
                  </label>
                  <select
                    value={formState.inquiryType}
                    onChange={(e) => setFormState({ ...formState, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all bg-white"
                  >
                    <option>Speaking / Keynote</option>
                    <option>Curriculum Licensing & Audit</option>
                    <option>Faculty Workshop / PD Day</option>
                    <option>Student Mentorship Cohort</option>
                    <option>Media & Press Interview</option>
                    <option>Other Collaboration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Project Details / Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Share details regarding your school's timeline, event goals, or curriculum requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#2563EB] text-white text-base font-semibold hover:bg-[#1D4ED8] disabled:opacity-70 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Dr. Jenkins</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

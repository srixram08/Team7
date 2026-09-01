"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck, Globe, Lock, Cpu, Play } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { GlowButton } from "@/components/ui/GlowButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#162215] flex flex-col font-sans">
      {/* Global Unified Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6E5D4] bg-[#E8F3E7] px-4 py-1.5 text-xs font-bold text-[#2E5B28] shadow-sm">
              <Zap className="h-4 w-4 shrink-0 text-[#2E5B28]" />
              <span>ReviveX — Automated Rollback for Online Examination Systems</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#162215] leading-tight tracking-tight max-w-4xl mx-auto">
              High-Stakes Online Exams with <br className="hidden sm:inline" />
              <span className="text-[#2E5B28] inline-block mt-1">Automated 2.4s State Rollback</span>
            </h1>

            <p className="text-base sm:text-lg text-[#586B56] max-w-2xl mx-auto leading-relaxed font-normal">
              Predictive 100Hz telemetry checkpointing, real-time digital twin edge synchronization, and explainable AI state recovery. Zero silent data loss under catastrophic failures.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
              <Link href="/login">
                <GlowButton variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Sign In to User Dashboard
                </GlowButton>
              </Link>
              <Link href="/dashboard">
                <GlowButton variant="secondary" size="lg" icon={<Play className="h-4 w-4 fill-current" />}>
                  Launch Proctor Console
                </GlowButton>
              </Link>
            </div>

            {/* Metrics Overview Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-[#D6E5D4] bg-white p-5 text-center shadow-sm flex flex-col items-center justify-center space-y-1">
                <div className="font-heading text-3xl font-extrabold text-[#2E5B28] leading-none">5K+</div>
                <div className="text-xs font-semibold text-[#586B56]">Protected Sessions Daily</div>
              </div>
              <div className="rounded-2xl border border-[#D6E5D4] bg-white p-5 text-center shadow-sm flex flex-col items-center justify-center space-y-1">
                <div className="font-heading text-3xl font-extrabold text-[#2E5B28] leading-none">99.999%</div>
                <div className="text-xs font-semibold text-[#586B56]">Platform Uptime</div>
              </div>
              <div className="rounded-2xl border border-[#D6E5D4] bg-white p-5 text-center shadow-sm flex flex-col items-center justify-center space-y-1">
                <div className="font-heading text-3xl font-extrabold text-[#2E5B28] leading-none">0 B</div>
                <div className="text-xs font-semibold text-[#586B56]">Silent Data Loss</div>
              </div>
            </div>
          </section>

          {/* System Capabilities */}
          <section id="features" className="space-y-10">
            <div className="text-center space-y-2.5 max-w-xl mx-auto">
              <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#2E5B28] bg-[#E8F3E7] px-3.5 py-1 rounded-full border border-[#D6E5D4]">
                System Capabilities
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#162215] leading-tight">
                Built for Uncompromising Reliability
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[#D6E5D4] bg-white p-7 space-y-4 shadow-sm hover:border-[#4E8B46] hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-[#E8F3E7] border border-[#D6E5D4] flex items-center justify-center text-[#2E5B28]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#162215]">Zero Silent Data Loss</h3>
                <p className="text-sm text-[#586B56] leading-relaxed">
                  Continuous 100Hz local IndexedDB buffering guarantees zero candidate data loss during abrupt network drops or power outages.
                </p>
              </div>

              <div className="rounded-2xl border border-[#D6E5D4] bg-white p-7 space-y-4 shadow-sm hover:border-[#4E8B46] hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-[#E8F3E7] border border-[#D6E5D4] flex items-center justify-center text-[#2E5B28]">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#162215]">2.4s Automated Rollback</h3>
                <p className="text-sm text-[#586B56] leading-relaxed">
                  Explainable AI state recovery restores candidate exam sessions in under 2.4 seconds upon browser or process crashes.
                </p>
              </div>

              <div className="rounded-2xl border border-[#D6E5D4] bg-white p-7 space-y-4 shadow-sm hover:border-[#4E8B46] hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-[#E8F3E7] border border-[#D6E5D4] flex items-center justify-center text-[#2E5B28]">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#162215]">Digital Twin Edge Sync</h3>
                <p className="text-sm text-[#586B56] leading-relaxed">
                  Geographically closest edge servers maintain active candidate shadow states with SHA-256 cryptographic non-repudiation.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action Banner */}
          <section id="security" className="rounded-3xl bg-gradient-to-br from-[#2E5B28] to-[#1E3F1A] p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight text-white">
                Secure Your Online Examinations Today
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Sign in to access your individual candidate exam portal, proctor monitoring workspace, or administrative failover hub.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link href="/login">
                  <GlowButton variant="outline" size="lg" className="bg-white text-[#2E5B28] border-white hover:bg-white/90 shadow-md">
                    Sign In to User Dashboard
                  </GlowButton>
                </Link>
                <Link href="/student">
                  <GlowButton variant="secondary" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    Open Student Portal
                  </GlowButton>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Global Unified Footer */}
      <Footer />
    </div>
  );
}

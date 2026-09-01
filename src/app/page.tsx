"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#162215] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#D6E5D4] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3.5 no-underline">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E5B28] to-[#4E8B46] text-white shadow-md">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-extrabold text-xl text-[#162215] tracking-tight">
                ReviveX
              </span>
              <span className="font-mono text-[10px] uppercase text-[#586B56] font-bold tracking-widest mt-0.5">
                Automated Rollback Engine
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-sans text-xs uppercase font-bold text-[#586B56] tracking-wider">
            <a href="#features" className="hover:text-[#2E5B28] transition-colors whitespace-nowrap">Features</a>
            <a href="#workflow" className="hover:text-[#2E5B28] transition-colors whitespace-nowrap">Rollback Workflow</a>
            <a href="#security" className="hover:text-[#2E5B28] transition-colors whitespace-nowrap">Security Specs</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <GlowButton variant="outline" size="sm" className="whitespace-nowrap">
                Sign In
              </GlowButton>
            </Link>
            <Link href="/login">
              <GlowButton variant="primary" size="sm" className="whitespace-nowrap">
                Get Started
              </GlowButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-36 pb-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6E5D4] bg-[#E8F3E7] px-5 py-2 text-xs font-bold text-[#2E5B28] shadow-2xs">
            <Zap className="h-4 w-4 shrink-0 text-[#2E5B28]" />
            <span>ReviveX — Automated Rollback for Online Examination System</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#162215] leading-[1.25] tracking-tight max-w-4xl mx-auto">
            High-Stakes Online Exams with <br className="hidden sm:inline" />
            <span className="text-[#2E5B28] inline-block mt-1">Automated 2.4s State Rollback</span>
          </h1>

          <p className="text-base sm:text-lg text-[#586B56] max-w-2xl mx-auto leading-relaxed font-normal">
            Predictive 100Hz telemetry checkpointing, real-time digital twin edge synchronization, and explainable AI state recovery. Zero silent data loss under catastrophic failures.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link href="/login">
              <GlowButton variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />} className="whitespace-nowrap">
                Sign In to User Dashboard
              </GlowButton>
            </Link>
            <a href="#features">
              <GlowButton variant="outline" size="lg" className="whitespace-nowrap">
                Explore System Features
              </GlowButton>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-[#D6E5D4] bg-white p-6 text-center shadow-xs flex flex-col items-center justify-center space-y-1">
              <div className="font-heading text-3xl font-extrabold text-[#2E5B28] leading-none">5K+</div>
              <div className="text-xs font-semibold text-[#586B56] whitespace-nowrap">Protected Sessions Daily</div>
            </div>
            <div className="rounded-2xl border border-[#D6E5D4] bg-white p-6 text-center shadow-xs flex flex-col items-center justify-center space-y-1">
              <div className="font-heading text-3xl font-extrabold text-[#2E5B28] leading-none">99.999%</div>
              <div className="text-xs font-semibold text-[#586B56] whitespace-nowrap">Platform Uptime</div>
            </div>
            <div className="rounded-2xl border border-[#D6E5D4] bg-white p-6 text-center shadow-xs flex flex-col items-center justify-center space-y-1">
              <div className="font-heading text-3xl font-extrabold text-[#2E5B28] leading-none">0 B</div>
              <div className="text-xs font-semibold text-[#586B56] whitespace-nowrap">Silent Data Loss</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-12 pt-8">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#4E8B46] bg-[#E8F3E7] px-3.5 py-1 rounded-full border border-[#D6E5D4]">
              System Capabilities
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#162215] leading-tight">
              Built for Uncompromising Reliability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#D6E5D4] bg-white p-8 space-y-4 shadow-xs hover:border-[#4E8B46] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#E8F3E7] border border-[#D6E5D4] flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="font-heading text-xl font-bold text-[#162215]">Zero Silent Data Loss</h3>
              <p className="text-sm text-[#586B56] leading-relaxed">
                Continuous 100Hz local IndexedDB buffering guarantees zero candidate data loss during abrupt network drops or power outages.
              </p>
            </div>

            <div className="rounded-2xl border border-[#D6E5D4] bg-white p-8 space-y-4 shadow-xs hover:border-[#4E8B46] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#E8F3E7] border border-[#D6E5D4] flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="font-heading text-xl font-bold text-[#162215]">2.4s Automated Rollback</h3>
              <p className="text-sm text-[#586B56] leading-relaxed">
                Explainable AI state recovery restores candidate exam sessions in under 2.4 seconds upon browser or process crashes.
              </p>
            </div>

            <div className="rounded-2xl border border-[#D6E5D4] bg-white p-8 space-y-4 shadow-xs hover:border-[#4E8B46] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#E8F3E7] border border-[#D6E5D4] flex items-center justify-center text-2xl">
                🌐
              </div>
              <h3 className="font-heading text-xl font-bold text-[#162215]">Digital Twin Edge Sync</h3>
              <p className="text-sm text-[#586B56] leading-relaxed">
                Geographically closest edge servers maintain active candidate shadow states with SHA-256 cryptographic non-repudiation.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section id="security" className="rounded-3xl bg-gradient-to-br from-[#2E5B28] to-[#4E8B46] p-10 sm:p-14 text-center text-white space-y-6 shadow-lg relative overflow-hidden my-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight text-white">
            Secure Your Online Examinations Today
          </h2>
          <p className="text-base text-white/95 max-w-xl mx-auto leading-relaxed">
            Sign in to access your individual candidate exam portal, proctor monitoring workspace, or admin controls.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/login">
              <GlowButton variant="outline" size="lg" className="bg-white text-[#2E5B28] border-none hover:bg-white/90 shadow-md font-bold whitespace-nowrap">
                Sign In to User Dashboard
              </GlowButton>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D6E5D4] bg-white py-8 text-center text-xs text-[#586B56]">
        <div className="max-w-7xl mx-auto px-6 font-mono">
          ReviveX Automated Rollback Engine for Online Examination System • All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Mail, Globe, ArrowRight, CheckCircle2, Server, Cpu, Check } from "lucide-react";
import { DottedLogo } from "./DottedLogo";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#07111E] text-white border-t border-[#122B48] font-sans">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3.5">
              <DottedLogo size={44} />
              <div>
                <span className="font-heading text-2xl font-bold tracking-tight text-white block">
                  ReviveX
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#00A8FF] font-bold block">
                  Resilience Platform
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#8AA4BE] leading-relaxed max-w-sm">
              Autonomous, edge-synchronized online examination platform with 100Hz local telemetry buffering, explainable AI anomaly detection, and sub-2.4s state recovery.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-[#00A8FF]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A8FF]/10 border border-[#00A8FF]/30">
                <span className="h-2 w-2 rounded-full bg-[#00A8FF] animate-pulse" />
                <span>GLOBAL EDGE MESH ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#00A8FF]">
              Workspaces
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8AA4BE]">
              <li>
                <Link href="/student" className="hover:text-white transition-colors">
                  Student Exam Pod
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Proctor Console
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Edge Failover Hub
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-white transition-colors">
                  3D Architecture Spec
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors">
                  Chaos Engineering Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#00A8FF]">
              Specifications
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8AA4BE]">
              <li>
                <span className="hover:text-white cursor-pointer">100Hz Local Buffering</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">SHA-256 Merkle Ledger</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Kyber-1024 Post-Quantum</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Sub-2.4s State Rollback</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">LTI 1.3 Canvas / Moodle</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Dispatch Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#00A8FF]">
              Stay Informed
            </h4>
            <p className="text-xs text-[#8AA4BE] leading-relaxed">
              Subscribe to our monthly engineering bulletin on edge fault-tolerance and academic integrity.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B192C] border border-[#1E3A5F] text-xs text-white placeholder-[#556B82] focus:outline-none focus:border-[#00A8FF]"
                />
                <button
                  type="submit"
                  className="btn-cyan !py-2.5 !px-4 !text-xs shrink-0 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-[#00A8FF] flex items-center gap-1 mt-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Metrics Strip */}
      <div className="border-t border-[#122B48] bg-[#050D17] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556B82] font-mono">
          <div>
            &copy; {new Date().getFullYear()} ReviveX Resilience Platform. Capella CSL Architecture. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>SLA: 99.999%</span>
            <span>•</span>
            <span>ZERO DATA LOSS</span>
            <span>•</span>
            <span>POST-QUANTUM READY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

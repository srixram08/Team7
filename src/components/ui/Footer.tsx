import React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Activity, Zap } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-[#0A3D24] bg-[#05070A] pt-16 pb-12 text-[#7FA98F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E5B28] text-white shadow-sm">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <span className="font-heading text-lg font-bold text-[#E8FCEF]">ReviveX</span>
            </div>
            <p className="text-xs leading-relaxed text-[#7FA98F]">
              Autonomous Resilient Online Examination Platform — Continuous risk-adaptive telemetry monitoring, verified state consistency, and explainable instant rollback.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF7F]">
              <Activity className="h-4 w-4" />
              <span>GLOBAL NODE HEALTH: 99.999% OPERATIONAL</span>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#E8FCEF] mb-4">
              Core Architecture Stack
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7F]" /> Next.js App Router + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7F]" /> Three.js & React Three Fiber
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7F]" /> IndexedDB + Local State Engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7F]" /> SHA-256 State Delta Hash Chain
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7F]" /> 100Hz Telemetry Stream Monitor
              </li>
            </ul>
          </div>

          {/* Platform Sections */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#E8FCEF] mb-4">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student" className="hover:text-[#00FF7F] transition-colors">
                  Student Examination Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#00FF7F] transition-colors">
                  Proctor Monitoring Console
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#00FF7F] transition-colors">
                  Admin Failover & Hash Verifier
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-[#00FF7F] transition-colors">
                  System Architecture & 3D Spec
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#00FF7F] transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Hackathon Credits */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#E8FCEF]">
              Resilience & Integrity Spec
            </h4>
            <div className="rounded-lg border border-[#0A3D24] bg-[#0B120E] p-4 text-xs">
              <div className="flex items-center gap-2 text-[#00FF7F] font-mono mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>FAULT-TOLERANT ARCHITECTURE</span>
              </div>
              <p className="text-[11px] text-[#7FA98F]">
                Engineered to demonstrate sub-3-second recovery and zero silent data loss under catastrophic network drops & crash conditions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#0A3D24] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#7FA98F] gap-4">
          <div>
            © {new Date().getFullYear()} ReviveX Autonomous Resilience Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#00FF7F]">
              <span className="h-2 w-2 rounded-full bg-[#00FF7F] animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

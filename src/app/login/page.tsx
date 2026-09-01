"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, GraduationCap, ArrowRight, Lock } from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<"student" | "proctor">("student");
  const [selectedStudent, setSelectedStudent] = useState("STU-84920");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "student") {
      router.push(`/student`);
    } else {
      router.push(`/dashboard?userId=PROCTOR-01`);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00A8FF]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-flex items-center justify-center gap-3.5 group">
          <DottedLogo size={48} className="group-hover:scale-105 transition-transform" />
          <div className="text-left">
            <span className="font-heading text-2xl font-bold text-white tracking-tight block">
              ReviveX
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#00A8FF] font-bold block">
              Resilience Platform
            </span>
          </div>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="text-xs sm:text-sm text-[#8AA4BE]">
          {activeRole === "student"
            ? "Access candidate IDE, active test session, and auto-rollback pod"
            : "Access telemetry streams, risk anomaly engine, and instant rollback controls"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[#1E3A5F] bg-[#0B192C]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* 2 Distinct Role Login Tabs */}
          <div className="flex rounded-xl bg-[#07111E] border border-[#1E3A5F] p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveRole("student")}
              className={`flex-1 py-2.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeRole === "student"
                  ? "bg-[#00A8FF] text-white shadow-[0_0_15px_rgba(0,168,255,0.35)]"
                  : "text-[#8AA4BE] hover:text-white"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("proctor")}
              className={`flex-1 py-2.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeRole === "proctor"
                  ? "bg-[#00A8FF] text-white shadow-[0_0_15px_rgba(0,168,255,0.35)]"
                  : "text-[#8AA4BE] hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Proctor Console</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {activeRole === "student" ? (
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                  Select Candidate Profile
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="block w-full rounded-xl border border-[#1E3A5F] bg-[#07111E] p-3 text-xs text-white font-semibold focus:border-[#00A8FF] focus:outline-none transition-colors"
                >
                  <option value="STU-84920">Alex Chen (ID: CN-2026-881A • Stanford CS)</option>
                  <option value="STU-84921">Sarah Jenkins (ID: CN-2026-902B • MIT Physics)</option>
                  <option value="STU-84922">Marcus Vance (ID: CN-2026-744C • UC Berkeley Crypto)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                  Platform Proctor Account
                </label>
                <select
                  value="PROCTOR-01"
                  disabled
                  className="block w-full rounded-xl border border-[#1E3A5F] bg-[#07111E] p-3 text-xs text-white font-semibold opacity-90"
                >
                  <option value="PROCTOR-01">Supervisory Console (Sarah Jenkins • Lead Invigilator)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                Session Access Token / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="block w-full rounded-xl border border-[#1E3A5F] bg-[#07111E] p-3 text-xs text-white focus:border-[#00A8FF] focus:outline-none transition-colors"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#8AA4BE]">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-cyan w-full justify-center !py-3.5 !text-xs cursor-pointer"
            >
              <span>{activeRole === "student" ? "Enter Student Exam Pod" : "Enter Proctor Console"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs font-semibold text-[#8AA4BE] hover:text-[#00A8FF] transition-colors"
            >
              ← Back to Main Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

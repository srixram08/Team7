"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ShieldCheck, GraduationCap } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<"student" | "proctor">("student");
  const [selectedStudent, setSelectedStudent] = useState("STU-84920");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "student") {
      router.push(`/dashboard?userId=${selectedStudent}`);
    } else {
      router.push(`/dashboard?userId=PROCTOR-01`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#162215] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E5B28] to-[#4E8B46] text-white shadow-md">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <span className="font-heading text-2xl font-extrabold text-[#162215] tracking-tight">
            ReviveX Platform
          </span>
        </Link>

        <h2 className="mt-6 text-center font-heading text-3xl font-extrabold text-[#162215]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#586B56]">
          {activeRole === "student"
            ? "Access your student details, enrolled courses, and active exam workspace"
            : "Access executive monitoring metrics, telemetry streams, and rollback controls"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <GlassCard className="py-8 px-6 shadow-xl sm:px-10 border-[#D6E5D4]">
          
          {/* 2 Distinct Role Login Tabs */}
          <div className="flex rounded-xl bg-[#F8FAF8] border border-[#D6E5D4] p-1 mb-6 gap-1">
            <button
              type="button"
              onClick={() => setActiveRole("student")}
              className={`flex-1 py-2.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === "student"
                  ? "bg-[#2E5B28] text-white shadow-sm"
                  : "text-[#586B56] hover:text-[#2E5B28]"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("proctor")}
              className={`flex-1 py-2.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === "proctor"
                  ? "bg-[#2E5B28] text-white shadow-sm"
                  : "text-[#586B56] hover:text-[#2E5B28]"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Owner Login</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {activeRole === "student" ? (
              <div>
                <label className="block text-xs font-bold text-[#162215] uppercase tracking-wider mb-2">
                  Select Student Profile
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="block w-full rounded-xl border border-[#D6E5D4] bg-[#F8FAF8] p-3 text-sm text-[#162215] font-semibold focus:border-[#2E5B28] focus:bg-white focus:outline-none"
                >
                  <option value="STU-84920">Alex Chen (ID: CN-2026-881A • Stanford CS)</option>
                  <option value="STU-84921">Sarah Jenkins (ID: CN-2026-902B • MIT Physics)</option>
                  <option value="STU-84922">Marcus Vance (ID: CN-2026-744C • UC Berkeley Crypto)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#162215] uppercase tracking-wider mb-2">
                  Platform Owner Account
                </label>
                <select
                  value="PROCTOR-01"
                  onChange={() => {}}
                  className="block w-full rounded-xl border border-[#D6E5D4] bg-[#F8FAF8] p-3 text-sm text-[#162215] font-semibold focus:border-[#2E5B28] focus:bg-white focus:outline-none"
                >
                  <option value="PROCTOR-01">Platform Owner / Proctor Lead (Sarah Jenkins)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#162215] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value="••••••••••••"
                onChange={() => {}}
                className="block w-full rounded-xl border border-[#D6E5D4] bg-[#F8FAF8] p-3 text-sm text-[#162215] focus:border-[#2E5B28] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <GlowButton variant="primary" size="md" type="submit" className="w-full">
                {activeRole === "student"
                  ? "Sign In to Student Examination Dashboard"
                  : "Sign In to Platform Owner Control Center"}
              </GlowButton>
            </div>
          </form>

          <div className="mt-6 border-t border-[#D6E5D4] pt-6 text-center text-xs text-[#586B56]">
            <p className="font-semibold">Protected by 100Hz Telemetry & SHA-256 Hash Chain</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

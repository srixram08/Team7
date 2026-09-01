"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  User, 
  BookOpen, 
  Settings, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { Lightfall } from "@/components/ui/Lightfall";
import { STUDENTS_DATA } from "@/lib/examStore";

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<"student" | "teacher" | "admin" | "proctor">("student");
  
  // Student selection
  const [selectedStudentId, setSelectedStudentId] = useState("STU-84920");

  // Credentials form
  const [email, setEmail] = useState("alex.chen@stanford.edu");
  const [password, setPassword] = useState("••••••••••••");

  const handleRoleChange = (role: "student" | "teacher" | "admin" | "proctor") => {
    setActiveRole(role);
    if (role === "student") {
      setEmail(STUDENTS_DATA[selectedStudentId]?.email || "alex.chen@stanford.edu");
    } else if (role === "teacher") {
      setEmail("robert.sterling@university.edu");
    } else if (role === "admin") {
      setEmail("eleanor.vance@governance.edu");
    } else {
      setEmail("lead.proctor@revivex.network");
    }
  };

  const handleStudentSelect = (stuId: string) => {
    setSelectedStudentId(stuId);
    setEmail(STUDENTS_DATA[stuId]?.email || "");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "student") {
      router.push(`/student?id=${selectedStudentId}`);
    } else if (activeRole === "teacher") {
      router.push("/teacher");
    } else if (activeRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard?userId=PROCTOR-01");
    }
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-white flex flex-col justify-between font-sans selection:bg-[#00A8FF] selection:text-white relative overflow-hidden">
      
      {/* React Bits Lightfall Dynamic WebGL Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <Lightfall
          colors={["#00A8FF", "#00E5FF", "#5227FF", "#0077CC"]}
          backgroundColor="#07111E"
          speed={0.6}
          streakCount={6}
          streakWidth={1}
          streakLength={1.2}
          glow={1.3}
          density={0.6}
          twinkle={1}
          zoom={2.5}
          backgroundGlow={0.7}
          opacity={0.8}
          mouseInteraction={true}
          mouseStrength={0.6}
          mouseRadius={0.9}
        />
      </div>

      {/* Background Orbital Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00A8FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#0066CC]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <DottedLogo size={36} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-white leading-none">
              ReviveX
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#00A8FF] font-sans mt-0.5 font-bold">
              Authentication Gateway
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8AA4BE] hover:text-[#00A8FF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Login Card */}
      <main className="max-w-xl mx-auto w-full px-4 sm:px-6 py-8 z-10">
        <div className="rounded-3xl border border-[#1E3A5F] bg-[#0B192C]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl space-y-6">
          
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00A8FF]/30 bg-[#00A8FF]/10 px-3.5 py-1 text-xs font-mono font-bold text-[#00A8FF]">
              <Lock className="h-3 w-3" />
              <span>CRYPTOGRAPHIC ZERO-TRUST IDENTITY</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Access Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#8AA4BE]">
              Select your academic role to proceed with verified session keys.
            </p>
          </div>

          {/* 4 Role Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#07111E] border border-[#1E3A5F]">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeRole === "student"
                  ? "bg-[#00A8FF] text-[#07111E] font-bold shadow-md"
                  : "text-[#8AA4BE] hover:text-white"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("teacher")}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeRole === "teacher"
                  ? "bg-[#00A8FF] text-[#07111E] font-bold shadow-md"
                  : "text-[#8AA4BE] hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeRole === "admin"
                  ? "bg-[#00A8FF] text-[#07111E] font-bold shadow-md"
                  : "text-[#8AA4BE] hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("proctor")}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeRole === "proctor"
                  ? "bg-[#00A8FF] text-[#07111E] font-bold shadow-md"
                  : "text-[#8AA4BE] hover:text-white"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Proctor</span>
            </button>
          </div>

          {/* Student Persona Picker (When role === student) */}
          {activeRole === "student" && (
            <div className="space-y-3 border-t border-[#1E3A5F] pt-4">
              <label className="block text-xs font-mono text-[#00A8FF] uppercase tracking-wider font-bold">
                Select 1 of 3 Demo Student Candidates:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(STUDENTS_DATA).map((stu) => {
                  const isSelected = selectedStudentId === stu.id;
                  return (
                    <button
                      key={stu.id}
                      type="button"
                      onClick={() => handleStudentSelect(stu.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#00A8FF] bg-[#00A8FF]/15 text-white ring-1 ring-[#00A8FF]"
                          : "border-[#1E3A5F] bg-[#07111E] text-[#8AA4BE] hover:border-[#00A8FF]"
                      }`}
                    >
                      <div className="font-heading font-bold text-xs text-white">
                        {stu.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#00A8FF]">
                        {stu.candidateNumber}
                      </div>
                      <div className="text-[9px] text-[#8AA4BE] truncate">
                        {stu.university.split(" ")[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#8AA4BE] uppercase tracking-wider mb-2">
                Institutional Email / Identity Token
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#1E3A5F] bg-[#07111E] p-3 text-xs sm:text-sm text-white focus:border-[#00A8FF] focus:outline-none"
                placeholder="name@university.edu"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8AA4BE] uppercase tracking-wider mb-2">
                Cryptographic Key / Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#1E3A5F] bg-[#07111E] p-3 text-xs sm:text-sm text-white focus:border-[#00A8FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-cyan w-full justify-center !py-3.5 !text-xs uppercase tracking-wider font-bold cursor-pointer mt-2"
            >
              <span>Authenticate & Enter {activeRole.toUpperCase()} Hub</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs text-[#8AA4BE] font-mono z-10">
        ReviveX Autonomous Resilience Engine • Multi-Role Academic Mesh Protocol
      </footer>

    </div>
  );
}

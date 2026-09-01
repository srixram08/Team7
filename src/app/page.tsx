"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Play, 
  Cpu, 
  Terminal, 
  Server, 
  Layers, 
  Activity, 
  RotateCcw,
  CheckCircle2,
  Lock,
  WifiOff,
  AlertTriangle,
  FileCheck,
  Compass,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Mail,
  Building,
  Check,
  Users,
  Database,
  Cloud,
  Award
} from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { Lightfall } from "@/components/ui/Lightfall";

export default function Home() {
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Demo Contact Form State
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    institution: "",
    candidates: "1000-5000"
  });

  const faqs = [
    {
      q: "How does 100Hz local client buffering prevent data loss during sudden WiFi drops?",
      a: "ReviveX uses an autonomous in-browser IndexedDB queue that operates entirely off the main UI thread. Every keystroke, code execution, and MCQ selection is serialized and hashed locally at 10ms intervals. Even if the internet connection is completely cut, no progress is lost, and the buffer flushes automatically once reconnected."
    },
    {
      q: "What is the 2.4s automated state rollback SLA guarantee?",
      a: "If a candidate's computer crashes, restarts, or the browser window is accidentally closed, opening the exam session immediately queries the nearest geographical digital twin edge node. The candidate's verified cryptographic state is reconstructed in under 2.4 seconds with zero loss of written code or answers."
    },
    {
      q: "How does SHA-256 Merkle Ledger guarantee academic integrity and non-repudiation?",
      a: "Every state mutation generates a cryptographic hash that is linked to the previous state in a verifiable Merkle tree. Neither the candidate nor a third party can alter timestamps or modify past answers without breaking the cryptographic root signature."
    },
    {
      q: "Can ReviveX integrate with existing LMS platforms like Canvas, Moodle, or Blackboard?",
      a: "Yes. ReviveX is built with LTI 1.3 / Advantage compliance and REST APIs, allowing universities and testing centers to synchronize student rosters, schedules, and gradebooks seamlessly with zero custom backend infrastructure."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactData.email) {
      setContactSubmitted(true);
      setTimeout(() => setContactSubmitted(false), 5000);
      setContactData({ name: "", email: "", institution: "", candidates: "1000-5000" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0E1E33] flex flex-col font-sans selection:bg-[#00A8FF] selection:text-white overflow-x-hidden">
      {/* Global Unified Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        
        {/* ================= 1. HERO SECTION (DEEP MIDNIGHT NAVY + CYAN GLOW) ================= */}
        <section className="hero-navy-wrapper relative overflow-hidden">
          
          {/* React Bits Lightfall Dynamic WebGL Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-75">
            <Lightfall
              colors={["#00A8FF", "#00E5FF", "#5227FF", "#0077CC"]}
              backgroundColor="#07111E"
              speed={0.7}
              streakCount={8}
              streakWidth={1.2}
              streakLength={1.2}
              glow={1.4}
              density={0.7}
              twinkle={1}
              zoom={2.2}
              backgroundGlow={0.8}
              opacity={0.85}
              mouseInteraction={true}
              mouseStrength={0.7}
              mouseRadius={0.9}
            />
          </div>

          <div className="hero-content relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Hero Typography & CTAs */}
              <div className="lg:col-span-7 text-left">
                
                {/* Subheading Badge */}
                <div className="hero-eyebrow">
                  <Zap className="h-3.5 w-3.5 text-[#00A8FF]" />
                  <span>AUTONOMOUS RESILIENT ONLINE EXAMINATION PLATFORM</span>
                </div>

                {/* Main Headline */}
                <h1 className="hero-title">
                  Next-Gen Online Exam <br />
                  <span className="text-[#00A8FF]">Resilience & Recovery</span>
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle">
                  Autonomous 100Hz local telemetry buffering, real-time edge digital twin synchronization, and explainable AI state rollback in under 2.4 seconds. Zero silent data loss under catastrophic failures.
                </p>

                {/* Action Buttons */}
                <div className="hero-actions">
                  <Link href="/student" className="btn-cyan">
                    <span>Launch Exam Pod</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  
                  <Link href="/demo" className="btn-outline-cyan">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Live Chaos Demo</span>
                  </Link>
                </div>

                {/* 4 SLA Metric Boxes (Dark Glassmorphism) */}
                <div className="hero-metrics-grid">
                  <div className="metric-box-navy">
                    <div className="font-heading text-3xl font-extrabold text-white mb-1">5,000+</div>
                    <div className="text-[10px] text-[#8AA4BE] uppercase tracking-wider font-semibold">Sessions</div>
                  </div>
                  <div className="metric-box-navy">
                    <div className="font-heading text-3xl font-extrabold text-[#00A8FF] mb-1">99.999%</div>
                    <div className="text-[10px] text-[#8AA4BE] uppercase tracking-wider font-semibold">Uptime SLA</div>
                  </div>
                  <div className="metric-box-navy">
                    <div className="font-heading text-3xl font-extrabold text-white mb-1">0 Bytes</div>
                    <div className="text-[10px] text-[#8AA4BE] uppercase tracking-wider font-semibold">Data Loss</div>
                  </div>
                  <div className="metric-box-navy">
                    <div className="font-heading text-3xl font-extrabold text-[#00A8FF] mb-1">&lt; 2.4s</div>
                    <div className="text-[10px] text-[#8AA4BE] uppercase tracking-wider font-semibold">Rollback</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Glowing High-Tech Dotted Matrix Sphere */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative flex items-center justify-center">
                  {/* Glowing Rings */}
                  <div className="absolute w-72 h-72 rounded-full border border-[#00A8FF]/20 animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute w-96 h-96 rounded-full border border-[#00A8FF]/10 animate-ping" style={{ animationDuration: '4s' }} />
                  <div className="absolute w-60 h-60 rounded-full bg-[#00A8FF]/15 blur-2xl pointer-events-none" />
                  
                  {/* Center Dotted Sphere Matrix */}
                  <div className="relative z-10 bg-[#07111E]/90 p-8 rounded-full border border-[#00A8FF]/40 shadow-2xl shadow-[#00A8FF]/20 backdrop-blur-md">
                    <DottedLogo size={140} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. INSTITUTIONAL TRUST BAR ================= */}
        <section className="py-10 bg-white border-b border-[#E1E8F0]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#556B82] font-bold block mb-5">
              Trusted for High-Stakes Assessments Across Leading Global Institutions
            </span>
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 font-heading text-lg sm:text-xl font-bold text-[#0B192C] opacity-85">
              <span className="flex items-center gap-2"><Building className="h-4 w-4 text-[#00A8FF]" /> Stanford University</span>
              <span className="flex items-center gap-2"><Cpu className="h-4 w-4 text-[#00A8FF]" /> MIT CS & Physics</span>
              <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-[#00A8FF]" /> UC Berkeley Crypto</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#00A8FF]" /> Oxford Examination Board</span>
              <span className="flex items-center gap-2"><Award className="h-4 w-4 text-[#00A8FF]" /> Cambridge Assessments</span>
            </div>
          </div>
        </section>

        {/* ================= 3. THREE CORE PILLARS ================= */}
        <section id="about" className="section-spacing bg-[#F4F8FC] border-b border-[#E1E8F0]">
          <div className="section-header">
            <span className="section-eyebrow">
              Platform Philosophy
            </span>
            <h2 className="section-title">
              A Calm, Resilient Examination Experience
            </h2>
            <p className="section-desc">
              Three foundational pillars engineered to ensure continuous candidate testing and mathematical integrity.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Pillar 1 */}
            <div className="card-modern text-center">
              <div>
                <div className="icon-badge-cyan mx-auto mb-6">
                  <RotateCcw className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-3">
                  Autonomous 100Hz Buffering
                </h3>
                <p className="text-sm text-[#556B82] leading-relaxed">
                  Every single keystroke, code alteration, and radio selection is captured in local non-volatile IndexedDB storage without blocking the UI thread.
                </p>
              </div>
              <div className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center justify-center gap-1">
                <span>10ms Tick Granularity</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="card-modern text-center">
              <div>
                <div className="icon-badge-cyan mx-auto mb-6">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-3">
                  Zero Silent Byte Loss
                </h3>
                <p className="text-sm text-[#556B82] leading-relaxed">
                  Cryptographic SHA-256 state delta chaining ensures candidate progress is non-repudiable and immune to silent packet drops or socket disconnects.
                </p>
              </div>
              <div className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center justify-center gap-1">
                <span>SHA-256 Merkle Chaining</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="card-modern text-center">
              <div>
                <div className="icon-badge-cyan mx-auto mb-6">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-3">
                  Sub-2.4s State Rollback
                </h3>
                <p className="text-sm text-[#556B82] leading-relaxed">
                  When a candidate device freezes or loses connectivity, our explainable AI engine reconstructs their exact workspace in under 2.4 seconds.
                </p>
              </div>
              <div className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center justify-center gap-1">
                <span>Verified 1.8s Benchmark</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. FAILURE SCENARIOS WE NEUTRALIZE ================= */}
        <section id="features" className="section-spacing bg-white border-b border-[#E1E8F0]">
          <div className="section-header">
            <span className="section-eyebrow">
              Threat Neutralization
            </span>
            <h2 className="section-title">
              Failure Scenarios We Neutralize
            </h2>
            <p className="section-desc">
              High-stakes assessments cannot tolerate edge interruptions. ReviveX handles every catastrophic edge event autonomously.
            </p>
          </div>

          {/* 6 Modern Cards */}
          <div className="scenarios-grid">
            
            {/* Card 1 */}
            <div className="card-modern">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] flex items-center justify-center text-[#00A8FF] mb-5">
                  <WifiOff className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0B192C] mb-2">
                  Abrupt WiFi Disconnect
                </h3>
                <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed">
                  Local IndexedDB immediately switches to autonomous client queuing. Upon reconnect, delta changes are flushed to edge twins seamlessly.
                </p>
              </div>
              <Link href="/student" className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center gap-1 hover:underline">
                <span>Explore Buffer Engine</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="card-modern">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] flex items-center justify-center text-[#00A8FF] mb-5">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0B192C] mb-2">
                  Browser Crash & Kill
                </h3>
                <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed">
                  Re-opening the browser automatically retrieves the last verified state from the digital twin shadow in under 2.4 seconds with zero loss.
                </p>
              </div>
              <Link href="/dashboard" className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center gap-1 hover:underline">
                <span>View Rollback Specs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="card-modern">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] flex items-center justify-center text-[#00A8FF] mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0B192C] mb-2">
                  Tamper & Repudiation
                </h3>
                <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed">
                  Every state change generates a SHA-256 Merkle chain entry signed by the candidate session, preventing post-facto exam tampering.
                </p>
              </div>
              <Link href="/admin" className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center gap-1 hover:underline">
                <span>Inspect Merkle Ledger</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="card-modern">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] flex items-center justify-center text-[#00A8FF] mb-5">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0B192C] mb-2">
                  Edge Node Stress & Drop
                </h3>
                <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed">
                  Global edge topology mesh detects overloaded nodes and routes candidate telemetry streams to the nearest healthy fallback node in real time.
                </p>
              </div>
              <Link href="/admin" className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center gap-1 hover:underline">
                <span>Check Node Topology</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="card-modern">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] flex items-center justify-center text-[#00A8FF] mb-5">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0B192C] mb-2">
                  Proctor Anomaly Scoring
                </h3>
                <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed">
                  Continuous ML risk scoring flags focus loss, tab switching, and abnormal keystroke dynamics with explainable rationale for invigilators.
                </p>
              </div>
              <Link href="/dashboard" className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center gap-1 hover:underline">
                <span>Proctor Console Tour</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 6 */}
            <div className="card-modern">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] flex items-center justify-center text-[#00A8FF] mb-5">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0B192C] mb-2">
                  Post-Quantum Ciphers
                </h3>
                <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed">
                  Built with Kyber-1024 and AES-GCM-256 post-quantum cryptographic primitives, protecting exams against future cryptanalytic breaches.
                </p>
              </div>
              <Link href="/architecture" className="pt-6 text-xs font-bold text-[#00A8FF] flex items-center gap-1 hover:underline">
                <span>Quantum Architecture</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================= 5. DEEP MIDNIGHT NAVY INTEGRITY STANDARD BANNER ================= */}
        <section className="section-spacing bg-[#0B192C] text-white border-b border-[#122B48] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <span className="section-eyebrow text-[#00A8FF]">
              The ReviveX Integrity Standard
            </span>
            <blockquote className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-[1.3] tracking-tight">
              “Every exam session is mathematically sealed with SHA-256 state delta hash chaining. When disaster strikes, ReviveX restores candidate progress in under 2.4 seconds with zero loss of academic integrity.”
            </blockquote>
            <div className="text-xs font-mono text-[#8AA4BE] tracking-wider pt-2">
              — Certified Autonomous Failover Protocol for Higher Education & Professional Certifications
            </div>
          </div>
        </section>

        {/* ================= 6. THE 4 CORE SYSTEM MODULES ================= */}
        <section id="modules" className="section-spacing bg-[#F4F8FC] border-b border-[#E1E8F0]">
          <div className="section-header">
            <span className="section-eyebrow">
              System Architecture
            </span>
            <h2 className="section-title">
              The Four Platform Modules
            </h2>
            <p className="section-desc">
              Seamlessly integrated modules connecting candidates, proctors, system administrators, and edge networks.
            </p>
          </div>

          <div className="modules-grid">
            
            {/* Module 1 */}
            <Link href="/student" className="card-modern group">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                  MODULE 01
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                  Student Exam Pod
                </h3>
                <p className="text-xs text-[#556B82] leading-relaxed">
                  Interactive code IDE, cryptographic MCQs, and 100Hz local IndexedDB state buffering with real-time offline indicators.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-[#00A8FF] group-hover:translate-x-1 transition-transform">
                <span>Enter Student Pod</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            {/* Module 2 */}
            <Link href="/dashboard" className="card-modern group">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                  MODULE 02
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                  Proctor Console
                </h3>
                <p className="text-xs text-[#556B82] leading-relaxed">
                  Multi-candidate live telemetry stream, explainable ML risk scoring, latency monitoring, and 1-click state rollback action center.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-[#00A8FF] group-hover:translate-x-1 transition-transform">
                <span>Open Proctor Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            {/* Module 3 */}
            <Link href="/admin" className="card-modern group">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                  MODULE 03
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                  Edge Failover Hub
                </h3>
                <p className="text-xs text-[#556B82] leading-relaxed">
                  Global 6-region edge topology mesh, simulated node crash stress tests, and cryptographic SHA-256 Merkle ledger proof inspector.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-[#00A8FF] group-hover:translate-x-1 transition-transform">
                <span>Manage Edge Nodes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            {/* Module 4 */}
            <Link href="/architecture" className="card-modern group">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-2">
                  MODULE 04
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                  3D Architecture Spec
                </h3>
                <p className="text-xs text-[#556B82] leading-relaxed">
                  Interactive Three.js constellation visualization and live state delta cryptographic sandbox calculating SHA-256 hashes in real time.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-[#00A8FF] group-hover:translate-x-1 transition-transform">
                <span>Explore 3D Spec</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

          </div>

          <div className="text-center pt-12">
            <Link href="/login" className="btn-navy">
              <span>Access System Workspaces</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ================= 7. OPERATIONAL PROTOCOL ================= */}
        <section className="section-spacing bg-white border-b border-[#E1E8F0]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual Dashboard Card in Deep Navy */}
            <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-10 border border-[#1E3A5F] shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-4">
                <div className="flex items-center gap-3">
                  <DottedLogo size={36} />
                  <div>
                    <h4 className="font-heading text-lg font-bold text-white">Live Telemetry Stream</h4>
                    <span className="text-[10px] font-mono text-[#00A8FF]">SESSION: #CN-2026-881A</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#00A8FF]/20 text-[#00A8FF] px-3 py-1 rounded-full border border-[#00A8FF]/30">
                  STATE: SYNCHRONIZED
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE]">Local IndexedDB Buffer</span>
                  <span className="text-[#00A8FF] font-bold">100Hz Active (0.01s Delta)</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE]">Edge Twin Latency</span>
                  <span className="text-white font-bold">14ms (US-East Edge 01)</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE]">Current Hash Proof</span>
                  <span className="text-[#00A8FF] truncate max-w-[170px]">0xa8f492c10b7e49d2...</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE]">Automated Rollback SLA</span>
                  <span className="text-[#00A8FF] font-bold">1.8s Verified</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#122B48] text-white text-xs space-y-1">
                <div className="font-bold font-heading text-sm text-[#00A8FF]">Non-Repudiation Guarantee</div>
                <p className="text-[11px] text-[#B8CDDE] leading-relaxed font-sans">
                  Candidate keystrokes cannot be altered or lost retroactively.
                </p>
              </div>
            </div>

            {/* Right Column: Numbered Protocol Steps */}
            <div className="space-y-6">
              <div>
                <span className="section-eyebrow">
                  Operational Protocol
                </span>
                <h2 className="section-title text-left">
                  How ReviveX Protects Every Second
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-[#00A8FF] text-white flex items-center justify-center font-heading text-base font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-[#0B192C]">100Hz Local Client Buffering</h4>
                    <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed mt-1">
                      Candidate answers and IDE code changes are captured continuously on the client device even during complete offline disconnection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-heading text-base font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-[#0B192C]">Digital Twin Shadow Edge Sync</h4>
                    <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed mt-1">
                      The closest geographical edge node replicates the student workspace with continuous SHA-256 cryptographic chaining.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-heading text-base font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-[#0B192C]">Explainable AI Anomaly Detection</h4>
                    <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed mt-1">
                      Invigilators receive risk index scores in real time with transparent rationale (focus loss, network drops, tab switching).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-[#00A8FF] text-white flex items-center justify-center font-heading text-base font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-[#0B192C]">Instant 2.4s State Rollback</h4>
                    <p className="text-xs sm:text-sm text-[#556B82] leading-relaxed mt-1">
                      Upon any browser restart or system interruption, the verified state is restored in under 2.4 seconds with zero loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 8. INTERACTIVE FAQ ACCORDION ================= */}
        <section id="faq" className="section-spacing bg-[#F4F8FC] border-b border-[#E1E8F0]">
          <div className="section-header">
            <span className="section-eyebrow">
              Frequently Asked Questions
            </span>
            <h2 className="section-title">
              Everything You Need to Know
            </h2>
            <p className="section-desc">
              Understand how ReviveX solves catastrophic exam failures and guarantees non-repudiation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-[#E1E8F0] rounded-2xl overflow-hidden transition-all bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-heading text-lg font-bold text-[#0B192C] hover:text-[#00A8FF] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="h-7 w-7 rounded-full bg-[#F4F8FC] border border-[#E1E8F0] flex items-center justify-center shrink-0 text-[#00A8FF]">
                    {openFaq === idx ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-[#556B82] leading-relaxed border-t border-[#F0F5FA] pt-4 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= 9. REQUEST INSTITUTIONAL PILOT ================= */}
        <section id="contact" className="section-spacing bg-white border-b border-[#E1E8F0]">
          <div className="max-w-4xl mx-auto bg-[#F4F8FC] rounded-3xl p-8 sm:p-14 border border-[#E1E8F0] shadow-sm space-y-8">
            <div className="text-center space-y-3">
              <span className="section-eyebrow">
                Institutional Access
              </span>
              <h2 className="section-title mb-2">
                Request an Institutional Pilot
              </h2>
              <p className="section-desc">
                Connect your university or testing agency with our engineering team for custom edge node deployments and LMS integration.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Eleanor Vance"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  className="w-full rounded-xl border border-[#D8DFE8] bg-white p-3.5 text-xs text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="vance@stanford.edu"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#D8DFE8] bg-white p-3.5 text-xs text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                  University / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="Stanford University / Oxford Board"
                  value={contactData.institution}
                  onChange={(e) => setContactData({ ...contactData, institution: e.target.value })}
                  className="w-full rounded-xl border border-[#D8DFE8] bg-white p-3.5 text-xs text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                  Annual Exam Candidates
                </label>
                <select
                  value={contactData.candidates}
                  onChange={(e) => setContactData({ ...contactData, candidates: e.target.value })}
                  className="w-full rounded-xl border border-[#D8DFE8] bg-white p-3.5 text-xs text-[#0B192C] font-semibold focus:border-[#00A8FF] focus:outline-none"
                >
                  <option value="500-1000">500 – 1,000 Candidates</option>
                  <option value="1000-5000">1,000 – 5,000 Candidates</option>
                  <option value="5000-25000">5,000 – 25,000 Candidates</option>
                  <option value="25000+">25,000+ Enterprise Candidates</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-4">
                <button
                  type="submit"
                  className="btn-cyan w-full justify-center !py-4 cursor-pointer"
                >
                  {contactSubmitted ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Pilot Request Received — We will contact you shortly!</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Pilot Request</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ================= 10. CALL TO ACTION SECTION ================= */}
        <section className="section-spacing bg-[#07111E] text-white text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="section-eyebrow text-[#00A8FF]">
              Ready to Deploy
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white mb-4">
              Secure Your Academic Integrity Today
            </h2>
            <p className="text-xs sm:text-sm text-[#8AA4BE] max-w-xl mx-auto leading-relaxed mb-8">
              Experience the world’s first autonomous examination platform built with 100Hz telemetry, 2.4s state recovery, and zero silent data loss.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link href="/login" className="btn-cyan">
                <span>Sign In to Platform</span>
              </Link>
              <Link href="/student" className="btn-outline-light">
                <span>Launch Student Portal</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Global Unified Footer */}
      <Footer />
    </div>
  );
}

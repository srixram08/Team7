"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  Eye,
  Cpu,
  FileCode,
  Send,
  Database
} from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { HashBadge } from "@/components/ui/HashBadge";

interface Question {
  id: number;
  title: string;
  type: "code" | "mcq" | "essay";
  prompt: string;
  codeTemplate?: string;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Question 1: Raft Consensus State Recovery",
    type: "code",
    prompt: "Implement a crash-resilient state log commit function that guarantees zero silent data loss upon unannounced follower disconnection.",
    codeTemplate: `// AROEP State Recovery Log Commit
function commitStateSnapshot(logIndex, candidateState, hashChain) {
  // TODO: Buffer 100Hz local telemetry to IndexedDB
  const localBuffer = [];
  if (candidateState.isDisconnected) {
    return localBuffer.append({ logIndex, hash: hashChain.head });
  }
  return { status: "COMMITTED_TO_EDGE", stateHash: "0xa8f492c10b7e49d2" };
}`
  },
  {
    id: 2,
    title: "Question 2: Cryptographic Hash Chain Validation",
    type: "mcq",
    prompt: "Which mechanism in AROEP guarantees non-repudiation and zero byte loss during abrupt socket termination?",
    options: [
      "Periodic HTTP polling every 30 seconds",
      "100Hz Telemetry Stream with SHA-256 State Delta Hash Chaining",
      "Client-side LocalStorage unencrypted JSON caching",
      "Manual proctor refresh upon candidate request"
    ]
  },
  {
    id: 3,
    title: "Question 3: Digital Twin Shadow Synchronization",
    type: "essay",
    prompt: "Explain how AROEP's edge node shadow copy enables seamless 2.4-second recovery when a candidate's browser process crashes unexpectedly."
  }
];

export default function StudentExamPage() {
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [codeAnswer, setCodeAnswer] = useState(QUESTIONS[0].codeTemplate);
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(1);
  const [essayAnswer, setEssayAnswer] = useState("AROEP maintains a 100Hz digital twin shadow copy on the nearest edge node. When a socket drop occurs, the candidate's state snapshot is verified via the cryptographic hash chain...");
  
  const [offlineBufferCount, setOfflineBufferCount] = useState(0);
  const [lastSavedHash, setLastSavedHash] = useState("0xa8f492c10b7e49d29f8c12a3456789abcdef");
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [timerSeconds, setTimerSeconds] = useState(5320); // ~1h 28m
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptToken, setReceiptToken] = useState<string | null>(null);

  // Timer countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate local buffer keystrokes when typing offline
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeAnswer(e.target.value);
    if (!isOnline) {
      setOfflineBufferCount((prev) => prev + 1);
    } else {
      setLastSavedTime("Just now");
      setLastSavedHash("0x" + Math.random().toString(16).substring(2, 12) + "9f8c");
    }
  };

  const toggleNetwork = () => {
    if (isOnline) {
      setIsOnline(false);
    } else {
      setIsOnline(true);
      // Synchronize offline buffer
      setOfflineBufferCount(0);
      setLastSavedTime("Just now (Resynced)");
      setLastSavedHash("0x" + Math.random().toString(16).substring(2, 14));
    }
  };

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitExam = () => {
    const generatedReceipt = `AROEP-RECEIPT-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`;
    setReceiptToken(generatedReceipt);
    setIsSubmitted(true);
  };

  const currentQ = QUESTIONS[activeQIndex];

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E8FCEF] flex flex-col scanlines">
      {/* Top Header Exam Status Console */}
      <header className="border-b border-[#0A3D24] bg-[#0B120E] px-4 py-3 sm:px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs text-[#7FA98F] hover:text-[#00FF7F] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Exit Exam</span>
            </Link>

            <div className="h-4 w-px bg-[#0A3D24]" />

            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#00FF7F]" />
                <h1 className="font-heading font-bold text-sm text-[#E8FCEF] truncate max-w-[200px] sm:max-w-none">
                  ADVANCED DISTRIBUTED SYSTEMS EXAM
                </h1>
              </div>
              <p className="font-mono text-[10px] text-[#7FA98F]">
                Candidate: <span className="text-[#00FF7F]">Alex Chen (CN-2026-881A)</span>
              </p>
            </div>
          </div>

          {/* Center / Right Exam Control Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
            {/* Timer */}
            <div className="flex items-center gap-2 rounded border border-[#0A3D24] bg-[#05070A] px-3 py-1.5 text-[#00FF7F]">
              <Clock className="h-4 w-4 animate-pulse text-[#00FF7F]" />
              <span className="font-bold tabular-nums text-sm">{formatTimer(timerSeconds)}</span>
            </div>

            {/* Offline Simulation Toggle Button */}
            <button
              onClick={toggleNetwork}
              id="student-toggle-network-btn"
              className={`flex items-center gap-2 rounded border px-3 py-1.5 transition-all text-xs font-mono cursor-pointer ${
                isOnline
                  ? "border-[#00FF7F]/40 bg-[#0A3D24]/40 text-[#00FF7F] hover:bg-[#0A3D24]"
                  : "border-[#FFB020]/50 bg-[#FFB020]/10 text-[#FFB020] hover:bg-[#FFB020]/20"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-[#00FF7F]" />
                  <span className="hidden md:inline">NETWORK: ONLINE (14ms)</span>
                  <span className="md:hidden">ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-[#FFB020] animate-bounce" />
                  <span className="hidden md:inline">DISCONNECTED (SIMULATED)</span>
                  <span className="md:hidden">OFFLINE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Grid Workspace */}
      <div className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Proctor Status & Question Palette */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Proctor Live Feed Status */}
          <GlassCard className="p-4 space-y-3 border-[#0A3D24]">
            <div className="flex items-center justify-between font-mono text-xs border-b border-[#0A3D24] pb-2">
              <span className="flex items-center gap-1.5 text-[#7FA98F]">
                <Eye className="h-3.5 w-3.5 text-[#00FF7F]" />
                AI PROCTOR HUD
              </span>
              <span className="rounded bg-[#0A3D24] px-1.5 py-0.5 text-[10px] text-[#00FF7F] font-mono">
                ACTIVE
              </span>
            </div>

            {/* Camera Box Simulation */}
            <div className="relative aspect-video rounded border border-[#0A3D24] bg-[#05070A] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-60" />
              {/* Grid overlay */}
              <div className="absolute inset-0 cyber-grid opacity-30" />
              <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                <div className="h-12 w-12 rounded-full border border-[#00FF7F]/60 bg-[#0A3D24]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,127,0.3)]">
                  <Cpu className="h-6 w-6 text-[#00FF7F]" />
                </div>
                <span className="font-mono text-[10px] text-[#00FF7F] tracking-wider">
                  FACE & GAZE DETECTED
                </span>
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[9px] text-[#00FF7F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7F] pulse-dot" />
                <span>30 FPS TELEMETRY</span>
              </div>
            </div>

            {/* Security Checks */}
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-[#7FA98F]">
                <span>Gaze Confidence:</span>
                <span className="text-[#00FF7F]">99.4% (In Zone)</span>
              </div>
              <div className="flex justify-between text-[#7FA98F]">
                <span>Browser Lock:</span>
                <span className="text-[#00FF7F]">STRICT (0 Switches)</span>
              </div>
              <div className="flex justify-between text-[#7FA98F]">
                <span>Audio Stream:</span>
                <span className="text-[#00FF7F]">CLEAR (-42dB)</span>
              </div>
            </div>
          </GlassCard>

          {/* Question Navigator */}
          <GlassCard className="p-4 space-y-3 border-[#0A3D24]">
            <div className="font-mono text-xs text-[#7FA98F] border-b border-[#0A3D24] pb-2">
              QUESTION NAVIGATOR
            </div>
            <div className="grid grid-cols-3 gap-2">
              {QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQIndex(idx)}
                  className={`p-2.5 rounded border font-mono text-xs text-center transition-all cursor-pointer ${
                    activeQIndex === idx
                      ? "border-[#00FF7F] bg-[#0A3D24] text-[#00FF7F] font-bold shadow-[0_0_10px_rgba(0,255,127,0.3)]"
                      : "border-[#0A3D24] bg-[#0B120E] text-[#7FA98F] hover:border-[#00FF7F]/40 hover:text-[#E8FCEF]"
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Zero-Data-Loss Buffer Status Card */}
          <GlassCard className="p-4 space-y-2 border-[#0A3D24]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#00FF7F]">
              <Database className="h-4 w-4" />
              <span>ZERO-LOSS SYNC STATE</span>
            </div>
            <p className="font-mono text-[11px] text-[#7FA98F] leading-tight">
              {isOnline
                ? "Every key stroke is committed to 100Hz local IndexedDB state & mirrored to shadow edge node."
                : `[OFFLINE MODE] ${offlineBufferCount} state deltas buffered in local IndexedDB. Zero data lost!`}
            </p>
            <div className="pt-1">
              <HashBadge hash={lastSavedHash} label="State Delta Hash" />
            </div>
          </GlassCard>
        </div>

        {/* Center / Right Column: Active Exam Question Workspace */}
        <div className="lg:col-span-9 flex flex-col space-y-4">
          <GlassCard className="flex-1 p-6 space-y-6 border-[#0A3D24]">
            {/* Question Header */}
            <div className="border-b border-[#0A3D24] pb-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-[#00FF7F] uppercase tracking-wider">
                  {currentQ.type === "code"
                    ? "Interactive Coding Task"
                    : currentQ.type === "mcq"
                    ? "Multiple Choice Concept"
                    : "System Architecture Essay"}
                </span>
                <h2 className="font-heading text-xl font-bold text-[#E8FCEF] mt-1">
                  {currentQ.title}
                </h2>
              </div>
              <div className="font-mono text-xs text-[#7FA98F] bg-[#05070A] border border-[#0A3D24] px-3 py-1 rounded">
                Weight: 30 Points
              </div>
            </div>

            {/* Prompt Description */}
            <div className="rounded-lg border border-[#0A3D24] bg-[#05070A]/80 p-4 font-sans text-sm leading-relaxed text-[#E8FCEF]">
              {currentQ.prompt}
            </div>

            {/* Answer Input Area based on Question Type */}
            {currentQ.type === "code" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-[#7FA98F]">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="h-4 w-4 text-[#00FF7F]" />
                    JavaScript / Node.js Workspace
                  </span>
                  <span className="text-[10px]">Auto-saved: {lastSavedTime}</span>
                </div>
                <textarea
                  value={codeAnswer}
                  onChange={handleCodeChange}
                  rows={10}
                  className="w-full rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono text-xs text-[#00FF7F] focus:border-[#00FF7F] focus:outline-none focus:ring-1 focus:ring-[#00FF7F] selection:bg-[#00FF7F] selection:text-[#05070A] leading-relaxed"
                  placeholder="// Type your code solution here..."
                />
              </div>
            )}

            {currentQ.type === "mcq" && currentQ.options && (
              <div className="space-y-3 font-mono text-xs">
                {currentQ.options.map((opt, i) => (
                  <label
                    key={i}
                    onClick={() => setMcqAnswer(i)}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      mcqAnswer === i
                        ? "border-[#00FF7F] bg-[#0A3D24]/50 text-[#E8FCEF] shadow-[0_0_15px_rgba(0,255,127,0.15)]"
                        : "border-[#0A3D24] bg-[#05070A] text-[#7FA98F] hover:border-[#00FF7F]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mcq"
                      checked={mcqAnswer === i}
                      onChange={() => setMcqAnswer(i)}
                      className="accent-[#00FF7F]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === "essay" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-[#7FA98F]">
                  <span>Technical Explanation Editor</span>
                  <span>Word count: {essayAnswer.split(" ").length}</span>
                </div>
                <textarea
                  value={essayAnswer}
                  onChange={(e) => setEssayAnswer(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono text-xs text-[#E8FCEF] focus:border-[#00FF7F] focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Bottom Question Controls & Submit Exam */}
            <div className="border-t border-[#0A3D24] pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  disabled={activeQIndex === 0}
                  onClick={() => setActiveQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded border border-[#0A3D24] bg-[#0B120E] text-[#7FA98F] hover:text-[#00FF7F] disabled:opacity-40 cursor-pointer"
                >
                  Previous Q
                </button>
                <button
                  disabled={activeQIndex === QUESTIONS.length - 1}
                  onClick={() => setActiveQIndex((prev) => Math.min(QUESTIONS.length - 1, prev + 1))}
                  className="px-4 py-2 rounded border border-[#0A3D24] bg-[#0B120E] text-[#7FA98F] hover:text-[#00FF7F] disabled:opacity-40 cursor-pointer"
                >
                  Next Q
                </button>
              </div>

              <GlowButton
                variant="primary"
                size="md"
                onClick={handleSubmitExam}
                icon={<Send className="h-4 w-4" />}
                id="submit-final-exam-btn"
              >
                Submit Exam Session
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Submission Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#00FF7F] bg-[#0B120E] p-6 space-y-6 shadow-[0_0_50px_rgba(0,255,127,0.3)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-[#00FF7F] bg-[#0A3D24] flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#00FF7F]" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#E8FCEF]">
                  EXAM SUBMITTED & CRYPTOGRAPHICALLY SIGNED
                </h3>
                <p className="font-mono text-xs text-[#7FA98F]">
                  0 bytes lost • 100% Hash Chain Integrity Verified
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#7FA98F]">
                <span>Candidate ID:</span>
                <span className="text-[#00FF7F]">CN-2026-881A (Alex Chen)</span>
              </div>
              <div className="flex justify-between text-[#7FA98F]">
                <span>Cryptographic Proof:</span>
                <span className="text-[#00FF7F] truncate max-w-[200px]">{lastSavedHash}</span>
              </div>
              <div className="flex justify-between text-[#7FA98F]">
                <span>Receipt Token:</span>
                <span className="text-[#00FF7F] font-bold">{receiptToken}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/demo" className="w-full">
                <GlowButton variant="primary" size="md" className="w-full">
                  Go to Proctor Console Demo
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

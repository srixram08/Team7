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
  Database,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";

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
    codeTemplate: `// ReviveX State Recovery Log Commit
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
    prompt: "Which mechanism in ReviveX guarantees non-repudiation and zero byte loss during abrupt socket termination?",
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
    prompt: "Explain how ReviveX's edge node shadow copy enables seamless 2.4-second recovery when a candidate's browser process crashes unexpectedly."
  }
];

export default function StudentExamPage() {
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [codeAnswer, setCodeAnswer] = useState(QUESTIONS[0].codeTemplate);
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(1);
  const [essayAnswer, setEssayAnswer] = useState("ReviveX maintains a 100Hz digital twin shadow copy on the nearest edge node. When a socket drop occurs, the candidate's state snapshot is verified via the cryptographic hash chain...");
  
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
    const generatedReceipt = `REVIVEX-RECEIPT-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`;
    setReceiptToken(generatedReceipt);
    setIsSubmitted(true);
  };

  const currentQ = QUESTIONS[activeQIndex];

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans">
      {/* Top Header Exam Status Console */}
      <header className="border-b border-[#122B48] bg-[#07111E] text-white px-4 py-3 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-xs text-[#8AA4BE] hover:text-[#00A8FF] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Exit Exam</span>
            </Link>

            <div className="h-4 w-px bg-[#1E3A5F]" />

            <div className="flex items-center gap-3">
              <DottedLogo size={28} />
              <div>
                <h1 className="font-heading font-bold text-sm text-white truncate max-w-[220px] sm:max-w-none">
                  ADVANCED DISTRIBUTED SYSTEMS EXAM
                </h1>
                <p className="font-mono text-[10px] text-[#8AA4BE]">
                  Candidate: <span className="text-[#00A8FF] font-semibold">Alex Chen (CN-2026-881A)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Center / Right Exam Control Metrics */}
          <div className="flex items-center gap-3 sm:gap-5 font-mono text-xs">
            {/* Timer */}
            <div className="flex items-center gap-2 rounded-full border border-[#1E3A5F] bg-[#0B192C] px-3.5 py-1.5 text-white">
              <Clock className="h-3.5 w-3.5 text-[#00A8FF] animate-pulse" />
              <span className="font-bold tabular-nums text-xs sm:text-sm">{formatTimer(timerSeconds)}</span>
            </div>

            {/* Offline Simulation Toggle Button */}
            <button
              onClick={toggleNetwork}
              id="student-toggle-network-btn"
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all text-xs font-mono cursor-pointer ${
                isOnline
                  ? "border-[#00A8FF]/40 bg-[#00A8FF]/10 text-[#00A8FF] hover:bg-[#00A8FF]/20"
                  : "border-[#FFB020]/60 bg-[#FFB020]/20 text-[#FFB020] hover:bg-[#FFB020]/30"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-[#00A8FF]" />
                  <span className="hidden md:inline font-bold">NETWORK: ONLINE (14ms)</span>
                  <span className="md:hidden font-bold">ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-[#FFB020] animate-bounce" />
                  <span className="hidden md:inline font-bold">OFFLINE BUFFERING</span>
                  <span className="md:hidden font-bold">OFFLINE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Grid Workspace */}
      <div className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Proctor Status & Question Palette */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* AI Proctor Live Feed Status in Deep Navy */}
          <div className="bg-[#0B192C] border border-[#1E3A5F] rounded-2xl p-4 text-white space-y-3.5 shadow-md">
            <div className="flex items-center justify-between font-mono text-xs border-b border-[#1E3A5F] pb-2.5">
              <span className="flex items-center gap-1.5 text-[#8AA4BE]">
                <Eye className="h-3.5 w-3.5 text-[#00A8FF]" />
                AI PROCTOR HUD
              </span>
              <span className="rounded-full bg-[#00A8FF]/20 border border-[#00A8FF]/40 px-2 py-0.5 text-[10px] text-[#00A8FF] font-bold">
                ACTIVE
              </span>
            </div>

            {/* Camera Box Simulation */}
            <div className="relative aspect-video rounded-xl border border-[#1E3A5F] bg-[#07111E] overflow-hidden flex items-center justify-center">
              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                <div className="h-11 w-11 rounded-full border border-[#00A8FF]/50 bg-[#00A8FF]/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,255,0.25)]">
                  <Cpu className="h-5 w-5 text-[#00A8FF]" />
                </div>
                <span className="font-mono text-[10px] text-[#00A8FF] font-bold tracking-wider">
                  FACE & GAZE LOCKED
                </span>
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[9px] text-[#00A8FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00A8FF] animate-ping" />
                <span>100Hz STREAM</span>
              </div>
            </div>

            {/* Security Checks */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-[#8AA4BE]">
                <span>Gaze In-Zone:</span>
                <span className="text-[#00A8FF] font-bold">99.4% (Optimal)</span>
              </div>
              <div className="flex justify-between text-[#8AA4BE]">
                <span>Browser Lock:</span>
                <span className="text-white font-bold">STRICT (0 Switches)</span>
              </div>
              <div className="flex justify-between text-[#8AA4BE]">
                <span>Audio Stream:</span>
                <span className="text-[#00A8FF] font-bold">CLEAR (-42dB)</span>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="card-modern !p-4 space-y-3">
            <div className="font-heading text-xs font-bold text-[#0B192C] uppercase tracking-wider border-b border-[#E1E8F0] pb-2">
              Question Navigator
            </div>
            <div className="grid grid-cols-3 gap-2">
              {QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQIndex(idx)}
                  className={`py-2.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer ${
                    activeQIndex === idx
                      ? "btn-cyan !py-2.5 !px-2 w-full"
                      : "bg-[#F4F8FC] border border-[#E1E8F0] text-[#556B82] hover:text-[#0B192C] hover:border-[#00A8FF]"
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Zero-Loss Sync State Badge */}
          <div className="card-modern !p-4 space-y-2">
            <div className="flex items-center gap-2 font-heading text-xs font-bold text-[#0B192C] uppercase tracking-wider">
              <Database className="h-3.5 w-3.5 text-[#00A8FF]" />
              <span>Zero-Loss Telemetry</span>
            </div>
            <p className="text-[11px] text-[#556B82] leading-relaxed">
              Every keystroke is committed to 100Hz local IndexedDB state and mirrored to digital twin shadow edge node.
            </p>
            <div className="pt-2 border-t border-[#E1E8F0] space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-[#556B82]">
                <span>Buffered Drops:</span>
                <span className={offlineBufferCount > 0 ? "text-[#FFB020] font-bold" : "text-[#00A8FF] font-bold"}>
                  {offlineBufferCount} Events
                </span>
              </div>
              <div className="flex justify-between text-[#556B82]">
                <span>State Hash:</span>
                <span className="text-[#00A8FF] truncate max-w-[110px]">{lastSavedHash}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Question Workspace */}
        <div className="lg:col-span-9 flex flex-col space-y-4">
          
          <div className="card-modern flex-1 !p-6 sm:!p-8 flex flex-col justify-between space-y-6">
            
            {/* Question Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-4 mb-4">
                <span className="text-xs font-mono font-bold text-[#00A8FF] uppercase tracking-wider">
                  {currentQ.type.toUpperCase()} TASK • 30 POINTS
                </span>
                <span className="text-xs text-[#556B82] font-mono">
                  Saved: <strong className="text-[#00A8FF]">{lastSavedTime}</strong>
                </span>
              </div>

              <h2 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                {currentQ.title}
              </h2>
              <p className="text-sm text-[#556B82] leading-relaxed">
                {currentQ.prompt}
              </p>
            </div>

            {/* Answer Input Area */}
            <div className="flex-1 my-4">
              
              {/* Type 1: Code IDE */}
              {currentQ.type === "code" && (
                <div className="rounded-2xl border border-[#1E3A5F] bg-[#07111E] overflow-hidden shadow-inner flex flex-col h-[380px]">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B192C] border-b border-[#1E3A5F] text-xs font-mono text-[#8AA4BE]">
                    <span className="flex items-center gap-2 text-[#00A8FF]">
                      <FileCode className="h-4 w-4" />
                      <span>consensus_recovery.js</span>
                    </span>
                    <span className="text-[10px]">100Hz Buffering Active</span>
                  </div>
                  <textarea
                    value={codeAnswer}
                    onChange={handleCodeChange}
                    className="flex-1 w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-[#E6F5FF] leading-relaxed resize-none focus:outline-none selection:bg-[#00A8FF] selection:text-white"
                    placeholder="Write your solution here..."
                  />
                </div>
              )}

              {/* Type 2: Multiple Choice Options */}
              {currentQ.type === "mcq" && (
                <div className="space-y-3 pt-2">
                  {currentQ.options?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setMcqAnswer(oIdx);
                        setLastSavedTime("Just now");
                        setLastSavedHash("0x" + Math.random().toString(16).substring(2, 14));
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-semibold flex items-center gap-3 cursor-pointer ${
                        mcqAnswer === oIdx
                          ? "border-[#00A8FF] bg-[#E6F5FF] text-[#0B192C] shadow-sm font-bold"
                          : "border-[#E1E8F0] bg-white text-[#556B82] hover:border-[#00A8FF] hover:bg-[#F4F8FC]"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                        mcqAnswer === oIdx ? "border-[#00A8FF] bg-[#00A8FF] text-white" : "border-[#C5D5E6]"
                      }`}>
                        {mcqAnswer === oIdx && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Type 3: Technical Essay */}
              {currentQ.type === "essay" && (
                <div className="pt-2">
                  <textarea
                    rows={12}
                    value={essayAnswer}
                    onChange={(e) => {
                      setEssayAnswer(e.target.value);
                      setLastSavedTime("Just now");
                      setLastSavedHash("0x" + Math.random().toString(16).substring(2, 14));
                    }}
                    className="w-full rounded-2xl border border-[#D8DFE8] bg-[#F4F8FC] p-4 text-xs sm:text-sm text-[#0B192C] leading-relaxed resize-none focus:border-[#00A8FF] focus:bg-white focus:outline-none"
                    placeholder="Provide your in-depth architectural explanation..."
                  />
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E1E8F0]">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeQIndex === 0}
                  onClick={() => setActiveQIndex((p) => p - 1)}
                  className="px-4 py-2.5 rounded-full border border-[#E1E8F0] bg-white text-xs font-bold text-[#556B82] hover:text-[#0B192C] hover:border-[#00A8FF] disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={activeQIndex === QUESTIONS.length - 1}
                  onClick={() => setActiveQIndex((p) => p + 1)}
                  className="px-4 py-2.5 rounded-full border border-[#E1E8F0] bg-white text-xs font-bold text-[#556B82] hover:text-[#0B192C] hover:border-[#00A8FF] disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>

              <button
                onClick={handleSubmitExam}
                className="btn-cyan !py-3 !px-6 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Submit Exam Session</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Submission Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-[#07111E]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full border border-[#E1E8F0] shadow-2xl text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-[#E6F5FF] text-[#00A8FF] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-extrabold text-[#0B192C]">
                Exam Successfully Submitted
              </h3>
              <p className="text-xs sm:text-sm text-[#556B82]">
                Your exam session state is cryptographically signed and archived across 6 edge nodes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E1E8F0] text-left space-y-2 font-mono text-xs">
              <div className="text-[10px] text-[#556B82] uppercase tracking-wider font-bold">
                Verification Proof Token:
              </div>
              <div className="font-bold text-[#00A8FF] break-all">
                {receiptToken}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn-cyan flex-1 justify-center">
                <span>Return to Home</span>
              </Link>
              <Link href="/dashboard" className="btn-navy flex-1 justify-center">
                <span>Open Proctor Audit</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

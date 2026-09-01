"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  LogOut, Zap, Shield, Activity, Globe, Lock, Cpu, Server, CheckCircle2, ArrowRight, Users
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { SessionGrid } from "@/components/demo/SessionGrid";
import { SessionDetailPanel } from "@/components/demo/SessionDetailPanel";
import { ExplainableAuditCard } from "@/components/demo/ExplainableAuditCard";
import { BehavioralLogStream, LogEntry } from "@/components/demo/BehavioralLogStream";
import {
  INITIAL_CANDIDATES,
  CandidateSession,
  generateMockTelemetry,
  TelemetryPoint,
  RecoveryReportData,
} from "@/lib/simulationEngine";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "PROCTOR-01";

  // Detailed Student / Proctor User Profile Map
  const userMap: Record<string, { 
    id: string;
    name: string; 
    role: "student" | "proctor" | "admin"; 
    email: string;
    num: string; 
    university: string;
    gpa: string;
    exam: string;
    enrolledCourses: Array<{ code: string; title: string; progress: string; status: string }>;
    testsTaken: Array<{ title: string; score: string; date: string; receipt: string }>;
    upcomingTests: Array<{ title: string; date: string; duration: string }>;
  }> = {
    "PROCTOR-01": { 
      id: "PROCTOR-01",
      name: "Platform Owner (Sarah Jenkins)", 
      role: "proctor",
      email: "owner@revivex.edu",
      num: "OWNER-2026-01",
      university: "ReviveX Global Examination Operations",
      gpa: "N/A",
      exam: "Live Session Monitoring Console",
      enrolledCourses: [],
      testsTaken: [],
      upcomingTests: []
    },
    "STU-84920": { 
      id: "STU-84920",
      name: "Alex Chen", 
      role: "student", 
      email: "alex.chen@revivex.edu",
      num: "CN-2026-881A", 
      university: "Stanford University • Dept of Computer Science",
      gpa: "3.92 GPA",
      exam: "Advanced Distributed Systems",
      enrolledCourses: [
        { code: "CS-448", title: "Advanced Distributed Systems", progress: "85%", status: "Active Examination" },
        { code: "PHYS-301", title: "Quantum Information Theory", progress: "60%", status: "Enrolled" }
      ],
      testsTaken: [
        { title: "Midterm Exam: Consensus Protocols", score: "98 / 100", date: "2026-07-15", receipt: "0xa8f492c10b7e49d2" }
      ],
      upcomingTests: [
        { title: "Final Exam: Distributed Fault-Tolerance", date: "Tomorrow, 10:00 AM", duration: "2.0 Hours" }
      ]
    }
  };

  const currentUser = userMap[userId] || userMap["PROCTOR-01"];

  // Proctor / Owner State
  const [candidates, setCandidates] = useState<CandidateSession[]>(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("STU-84921");
  const [telemetry] = useState<TelemetryPoint[]>(generateMockTelemetry());
  const [report, setReport] = useState<RecoveryReportData | null>(null);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [logs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "20:44:01",
      type: "info",
      candidateId: "STU-84920",
      message: "100Hz Telemetry stream active. Checkpoint #1042-89B verified across 6 edge nodes.",
    },
    {
      id: "2",
      timestamp: "20:44:03",
      type: "warning",
      candidateId: "STU-84921",
      message: "CPU load spike (89%) detected. ML risk score raised to 78%. Pre-crash snapshot committed.",
    },
  ]);

  const selectedCandidate = candidates.find((c: CandidateSession) => c.id === selectedCandidateId) || candidates[0];

  const handleTriggerFailure = (candidateId: string) => {
    setIsTriggering(true);
    setCandidates((prev: CandidateSession[]) =>
      prev.map((c: CandidateSession) => (c.id === candidateId ? { ...c, status: "recovering", riskScore: 94 } : c))
    );

    setTimeout(() => {
      const newReport: RecoveryReportData = {
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        failureReason: "Sudden Socket Drop & Browser Thread Crash",
        confidenceScore: 99.4,
        checkpointId: selectedCandidate.lastCheckpointId,
        checkpointTime: new Date().toISOString().slice(11, 19) + " UTC",
        durationMs: 2420,
        dataConsistency: "100% Match (0 B Lost)",
        hash: selectedCandidate.hash,
        blockNumber: 140289,
        reasoningSteps: [
          "1. Telemetry Stream detected socket disconnect at t-350ms.",
          "2. Emergency snapshot committed before process crash.",
          "3. 2.42s Rollback executed with zero bytes lost.",
        ],
      };
      setReport(newReport);
      setCandidates((prev: CandidateSession[]) =>
        prev.map((c: CandidateSession) => (c.id === candidateId ? { ...c, status: "stable", riskScore: 14 } : c))
      );
      setIsTriggering(false);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans">
      {/* Header Banner */}
      <header className="border-b border-[#E1E8F0] bg-white px-4 py-3.5 sm:px-6 shadow-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <DottedLogo size={36} className="group-hover:scale-105 transition-transform" />
              <span className="font-heading font-extrabold text-xl text-[#0B192C]">
                ReviveX Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#00A8FF]/30 bg-[#E6F5FF] px-4 py-1.5 text-xs font-bold text-[#00A8FF]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00A8FF] animate-pulse" />
              <span>Logged In: <strong>{currentUser.name}</strong></span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-full border border-[#E1E8F0] bg-white px-4 py-2 text-xs font-bold text-[#556B82] hover:text-[#00A8FF] transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Layout */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* PROCTOR / OWNER ROLE DASHBOARD */}
        {currentUser.role === "proctor" && (
          <div className="space-y-6">
            
            {/* Owner Title Header & Executive Metric Cards */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-[#00A8FF] font-bold uppercase tracking-wider">
                    PROCTOR / OWNER CONTROL CENTER
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] mt-0.5">
                    Live Session Monitoring Console
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#00A8FF] bg-[#E6F5FF] border border-[#00A8FF]/30 px-4 py-2 rounded-full">
                    100Hz STREAM ACTIVE • 6 EDGE NODES
                  </span>
                  <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 rounded-full border border-[#E1E8F0] bg-white px-5 py-2 text-xs font-bold text-[#0B192C] hover:bg-[#E6F5FF] hover:border-[#00A8FF] shadow-sm cursor-pointer transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Exit Console</span>
                  </button>
                </div>
              </div>

              {/* Executive Metrics Overview Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-[#0B192C]">5 Active</div>
                    <div className="text-xs font-semibold text-[#556B82]">Monitored Candidates</div>
                  </div>
                </div>

                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">2.42s</div>
                    <div className="text-xs font-semibold text-[#556B82]">Avg Rollback Speed</div>
                  </div>
                </div>

                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-[#0B192C]">14ms</div>
                    <div className="text-xs font-semibold text-[#556B82]">Edge Mesh Latency</div>
                  </div>
                </div>

                <div className="card-modern !p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">99.999%</div>
                    <div className="text-xs font-semibold text-[#556B82]">Consistency Match</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main 3-Column Proctor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[620px]">
              <div className="lg:col-span-3 min-h-[460px] lg:min-h-0 lg:h-full">
                <SessionGrid
                  candidates={candidates}
                  selectedCandidateId={selectedCandidateId}
                  onSelectCandidate={setSelectedCandidateId}
                />
              </div>

              <div className="lg:col-span-5 min-h-[480px] lg:min-h-0 lg:h-full">
                <SessionDetailPanel
                  candidate={selectedCandidate}
                  telemetry={telemetry}
                  onTriggerFailure={handleTriggerFailure}
                  isTriggering={isTriggering}
                />
              </div>

              <div className="lg:col-span-4 min-h-[460px] lg:min-h-0 lg:h-full flex flex-col gap-4">
                <div className="flex-1 min-h-0">
                  <ExplainableAuditCard report={report} />
                </div>
                <div className="h-[220px] min-h-[220px]">
                  <BehavioralLogStream logs={logs} />
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FC] text-[#0B192C]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8FF]"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

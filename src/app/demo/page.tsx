"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Activity, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
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

export default function DemoPage() {
  const [candidates, setCandidates] = useState<CandidateSession[]>(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("STU-84920");
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(generateMockTelemetry());
  const [report, setReport] = useState<RecoveryReportData | null>(null);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "20:44:01",
      type: "info",
      candidateId: "STU-84920",
      message: "100Hz Telemetry buffer active. Checkpoint #1042-89B verified across 6 nodes.",
    },
    {
      id: "2",
      timestamp: "20:44:03",
      type: "warning",
      candidateId: "STU-84921",
      message: "CPU pressure spike (89%) detected. ML risk score raised to 78%. Pre-crash snapshot committed.",
    },
    {
      id: "3",
      timestamp: "20:44:05",
      type: "info",
      candidateId: "STU-84922",
      message: "Digital Twin shadow state committed to edge cache node #4.",
    },
  ]);

  // Periodic Telemetry Jitter Update
  useEffect(() => {
    const interval = setInterval(() => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.status === "recovering") return c;

          const jitterLatency = Math.max(10, Math.min(300, c.latency + Math.floor((Math.random() - 0.5) * 8)));
          const jitterCpu = Math.max(10, Math.min(95, c.cpuLoad + Math.floor((Math.random() - 0.5) * 6)));

          return {
            ...c,
            latency: jitterLatency,
            cpuLoad: jitterCpu,
          };
        })
      );

      // Append new telemetry point
      setTelemetry((prev) => {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          minute: "2-digit",
          second: "2-digit",
        });
        const newPoint: TelemetryPoint = {
          time: timeStr,
          latency: Math.floor(12 + Math.random() * 20),
          cpu: Math.floor(20 + Math.random() * 25),
          riskScore: Math.floor(8 + Math.random() * 15),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const selectedCandidate =
    candidates.find((c: CandidateSession) => c.id === selectedCandidateId) || candidates[0];

  // Trigger Simulated Failure Function
  const handleTriggerFailure = (candidateId: string) => {
    setIsTriggering(true);

    // Step 1: Set candidate status to recovering
    setCandidates((prev: CandidateSession[]) =>
      prev.map((c: CandidateSession) =>
        c.id === candidateId ? { ...c, status: "recovering", riskScore: 94 } : c
      )
    );

    const newLog1: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "critical",
      candidateId,
      message: "CRITICAL: Candidate process killed unexpectedly. State snapshot delta verified.",
    };
    setLogs((prev) => [newLog1, ...prev]);

    // Step 2: Simulate 2.4s AI State Recovery
    setTimeout(() => {
      const newReport: RecoveryReportData = {
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        failureReason: "Sudden Socket Drop & Browser Process Kill",
        confidenceScore: 99.4,
        checkpointId: selectedCandidate.lastCheckpointId,
        checkpointTime: new Date().toISOString().slice(11, 19) + " UTC",
        durationMs: 2420,
        dataConsistency: "100% Match (0 B Lost)",
        hash: selectedCandidate.hash,
        blockNumber: 140289,
        reasoningSteps: [
          "1. 100Hz Telemetry stream detected socket disconnect at t-350ms.",
          "2. Local IndexedDB emergency snapshot committed before process crash.",
          "3. Digital Twin shadow state verified with SHA-256 Merkle proof (0 bytes lost).",
          "4. 2.42s State Rollback executed with zero exam interruptions.",
        ],
      };

      setReport(newReport);

      // Restore candidate to stable
      setCandidates((prev: CandidateSession[]) =>
        prev.map((c: CandidateSession) =>
          c.id === candidateId
            ? { ...c, status: "stable", riskScore: 12, latency: 14, cpuLoad: 24 }
            : c
        )
      );

      const newLog2: LogEntry = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: "info",
        candidateId,
        message: "SUCCESS: Explainable AI Rollback completed in 2.42s. 0 bytes lost.",
      };
      setLogs((prev) => [newLog2, ...prev]);
      setIsTriggering(false);
    }, 2420);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans">
      {/* Top Header Console */}
      <header className="border-b border-[#122B48] bg-[#07111E] text-white px-4 py-3 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-sans text-xs text-[#8AA4BE] hover:text-[#00A8FF] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </Link>

            <div className="h-4 w-px bg-[#1E3A5F]" />

            <div className="flex items-center gap-2.5">
              <DottedLogo size={26} />
              <h1 className="font-heading font-bold text-sm text-white truncate max-w-[200px] sm:max-w-none">
                CHAOS SIMULATION CONSOLE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-[#00A8FF] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#00A8FF]">
              100Hz STREAM ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main Console Layout */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-[#00A8FF] uppercase tracking-wider">
              CHAOS ENGINEERING TESTBED
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] mt-0.5">
              Simulated Failure & State Recovery Testing
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/student" className="btn-cyan !py-2.5 !px-5 !text-xs">
              <span>Open Student Pod</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 3-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[650px]">
          {/* Col 1: Candidate Sessions Grid */}
          <div className="lg:col-span-3 min-h-[460px] lg:min-h-0 lg:h-full">
            <SessionGrid
              candidates={candidates}
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={setSelectedCandidateId}
            />
          </div>

          {/* Col 2: Live Telemetry & Chaos Trigger */}
          <div className="lg:col-span-5 min-h-[480px] lg:min-h-0 lg:h-full">
            <SessionDetailPanel
              candidate={selectedCandidate}
              telemetry={telemetry}
              onTriggerFailure={handleTriggerFailure}
              isTriggering={isTriggering}
            />
          </div>

          {/* Col 3: Explainable Audit & Live Behavioral Logs */}
          <div className="lg:col-span-4 min-h-[460px] lg:min-h-0 lg:h-full flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <ExplainableAuditCard report={report} />
            </div>
            <div className="h-[230px] min-h-[230px]">
              <BehavioralLogStream logs={logs} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

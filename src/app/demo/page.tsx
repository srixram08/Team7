"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Activity, ShieldCheck } from "lucide-react";
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
      message: "100Hz Telemetry buffer active. Checkpoint #1042-89B verified.",
    },
    {
      id: "2",
      timestamp: "20:44:03",
      type: "warning",
      candidateId: "STU-84921",
      message: "CPU pressure spike (89%) detected. ML risk score raised to 78%.",
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
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Trigger Simulated Failure Function
  const handleTriggerFailure = (candidateId: string) => {
    setIsTriggering(true);

    // Step 1: Set candidate status to recovering
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, status: "recovering", riskScore: 94 } : c
      )
    );

    const newLog1: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "error",
      candidateId,
      message: "[CRITICAL] Abrupt browser crash & socket disconnect detected!",
    };
    setLogs((prev) => [newLog1, ...prev]);

    // Step 2: After 800ms, freeze state snapshot & generate report
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
          "1. Telemetry Stream detected 84% packet loss spike at t-350ms.",
          "2. ML Risk Model committed Checkpoint CHK-1042-89B immediately before disconnect.",
          "3. Candidate re-established WebSocket handshake via Edge Cache node.",
          "4. Session state restored seamlessly with cryptographic hash chain validation.",
        ],
      };
      setReport(newReport);

      const newLog2: LogEntry = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: "success",
        candidateId,
        message: "Explainable Rollback executed in 2.42s. Candidate state restored (0 Bytes lost).",
      };
      setLogs((prev) => [newLog2, ...prev]);

      // Step 3: Restore candidate status to stable
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, status: "stable", riskScore: 14 } : c
        )
      );

      setIsTriggering(false);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E8FCEF] flex flex-col scanlines">
      {/* Top Header Console Bar */}
      <header className="border-b border-[#0A3D24] bg-[#0B120E] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs text-[#7FA98F] hover:text-[#00FF7F] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </Link>

            <div className="h-4 w-px bg-[#0A3D24]" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-[#00FF7F]/40 bg-[#05070A]">
                <Cpu className="h-4 w-4 text-[#00FF7F]" />
              </div>
              <span className="font-heading font-bold text-sm text-[#E8FCEF]">
                AROEP MONITORING CONSOLE
              </span>
            </div>
          </div>

          {/* System Metrics Readout */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-[#7FA98F]">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-[#00FF7F] animate-pulse" />
              <span>SYSTEM HEALTH: <strong className="text-[#00FF7F]">99.999%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00FF7F]" />
              <span>ROLLBACKS PREVENTED TODAY: <strong className="text-[#00FF7F]">1,482</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Console Workspace */}
      <div className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-4">
        {/* Top 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[620px]">
          {/* Left Pane: Examinee Sessions List */}
          <div className="lg:col-span-3 min-h-[460px] lg:min-h-0 lg:h-full">
            <SessionGrid
              candidates={candidates}
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={setSelectedCandidateId}
            />
          </div>

          {/* Center Pane: Candidate Telemetry Detail */}
          <div className="lg:col-span-6 min-h-[480px] lg:min-h-0 lg:h-full">
            <SessionDetailPanel
              candidate={selectedCandidate}
              telemetryData={telemetry}
              onTriggerFailure={handleTriggerFailure}
              isTriggering={isTriggering}
            />
          </div>

          {/* Right Pane: Explainable Recovery Report */}
          <div className="lg:col-span-3 min-h-[460px] lg:min-h-0 lg:h-full">
            <ExplainableAuditCard report={report} isSimulating={isTriggering} />
          </div>
        </div>

        {/* Bottom Pane: Behavioral Log Stream */}
        <BehavioralLogStream logs={logs} />
      </div>
    </div>
  );
}

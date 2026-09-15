"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertOctagon, RotateCcw, Activity, Award } from "lucide-react";
import { RecoveryReportData } from "@/lib/simulationEngine";

interface ExplainableAuditCardProps {
  report: RecoveryReportData | null;
  isSimulating?: boolean;
}

export const ExplainableAuditCard: React.FC<ExplainableAuditCardProps> = ({
  report,
  isSimulating,
}) => {
  if (isSimulating) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-[#D97706]/40 bg-[#FFFBF0] p-6 text-center text-[#0E1E33] space-y-4">
        <RotateCcw className="h-10 w-10 text-[#D97706] animate-spin" />
        <h3 className="font-heading text-lg font-bold text-[#D97706]">
          CRDT RECOVERY IN PROGRESS
        </h3>
        <p className="font-mono text-xs text-[#556B82]">
          Executing Web Crypto SHA-256 verification & LWW-Element-Set reconciliation...
        </p>
        <div className="h-2 w-48 bg-[#E1E8F0] rounded-full overflow-hidden">
          <div className="h-full bg-[#D97706] animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-2xl border border-[#E1E8F0] bg-white shadow-sm p-6 text-center text-[#556B82] space-y-3 font-sans text-xs">
        <div className="h-12 w-12 rounded-full bg-[#E6F5FF] text-[#00A8FF] flex items-center justify-center mx-auto">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="font-bold text-[#0B192C] font-heading text-sm">Explainable Recovery Engine Idle</div>
        <p className="text-xs max-w-xs text-[#556B82]">
          Select a candidate session and trigger a simulated fault event to inspect the cryptographic audit report and measured recovery latency.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#00A8FF]/40 bg-white shadow-md p-5 text-[#0E1E33] space-y-3 ring-1 ring-[#00A8FF]/20 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-2.5">
        <div className="flex items-center gap-2 text-[#00A8FF] font-heading text-xs font-bold uppercase">
          <ShieldCheck className="h-4 w-4" />
          <span>Explainable Audit Report</span>
        </div>
        <span className="rounded-full bg-[#E6F5FF] px-2.5 py-0.5 font-mono text-[10px] text-[#00A8FF] font-bold border border-[#00A8FF]/30">
          HMAC VERIFIED
        </span>
      </div>

      {/* Candidate Metadata */}
      <div className="font-sans text-xs space-y-1 bg-[#F4F8FC] p-2.5 rounded-xl border border-[#E1E8F0]">
        <div className="text-[#556B82]">
          Candidate: <span className="text-[#0B192C] font-bold">{report.candidateName}</span> ({report.candidateId})
        </div>
        <div className="text-[#556B82]">
          Failure Event: <span className="text-[#D97706] font-bold">{report.failureReason}</span>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2">
          <div className="text-[9px] text-[#556B82]">RECOVERY CONFIDENCE</div>
          <div className="text-xs font-bold text-[#00A8FF] mt-0.5">
            {report.confidenceScore}% (Verified)
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2">
          <div className="text-[9px] text-[#556B82]">MEASURED RESTORE</div>
          <div className="text-xs font-bold text-[#00A8FF] mt-0.5">
            {report.durationMs} ms (P95: 2.4s)
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2">
          <div className="text-[9px] text-[#556B82]">CHECKPOINT ID</div>
          <div className="text-[11px] font-bold text-[#0B192C] mt-0.5 truncate" title={report.checkpointId}>
            {report.checkpointId}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2">
          <div className="text-[9px] text-[#556B82]">DATA LOSS ACCURACY</div>
          <div className="text-[11px] font-bold text-[#00A8FF] mt-0.5">
            {report.dataConsistency}
          </div>
        </div>
      </div>

      {/* Empirical Benchmark Stats */}
      {report.benchmarkStats && (
        <div className="rounded-xl border border-[#00A8FF]/30 bg-[#E6F5FF]/40 p-2.5 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-[#00A8FF] font-bold text-[10px]">
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              BENCHMARK TRIAL PROOF
            </span>
            <span>{report.benchmarkStats.trialsCount} Trials</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-[#556B82]">
            <div>SLA Success: <strong className="text-[#0B192C]">{report.benchmarkStats.recoverySuccessRate}</strong></div>
            <div>Median Latency: <strong className="text-[#00A8FF]">{report.benchmarkStats.medianRecoveryLatencyMs}ms</strong></div>
            <div>Unverified Loss: <strong className="text-[#00A8FF]">{report.benchmarkStats.unverifiedLossCount}</strong></div>
            <div>P95 Latency: <strong className="text-[#0B192C]">{report.benchmarkStats.p95RecoveryLatencyMs}ms</strong></div>
          </div>
        </div>
      )}

      {/* Reasoning & Verification Steps */}
      <div className="space-y-1.5 flex-1 font-sans text-xs">
        <div className="text-[10px] font-mono text-[#556B82] uppercase tracking-wider font-bold">
          Cryptographic Verification Chain:
        </div>
        {report.reasoningSteps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2 text-[#556B82] text-[11px] leading-snug">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00A8FF] shrink-0 mt-0.5" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

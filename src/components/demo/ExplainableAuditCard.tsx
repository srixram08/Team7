"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertOctagon, RotateCcw } from "lucide-react";
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
          SIMULATED RECOVERY IN PROGRESS
        </h3>
        <p className="font-mono text-xs text-[#556B82]">
          Freezing candidate state snapshot & evaluating ML recovery confidence...
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
          Select a candidate and click &quot;Simulate Failover Event&quot; to generate a real-time explainable audit report.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#00A8FF]/40 bg-white shadow-md p-5 text-[#0E1E33] space-y-4 ring-1 ring-[#00A8FF]/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-3">
        <div className="flex items-center gap-2 text-[#00A8FF] font-heading text-xs font-bold uppercase">
          <ShieldCheck className="h-4 w-4" />
          <span>Explainable Audit Report</span>
        </div>
        <span className="rounded-full bg-[#E6F5FF] px-2.5 py-0.5 font-mono text-[10px] text-[#00A8FF] font-bold border border-[#00A8FF]/30">
          RECOVERY VERIFIED
        </span>
      </div>

      {/* Candidate Metadata */}
      <div className="font-sans text-xs space-y-1 bg-[#F4F8FC] p-3 rounded-xl border border-[#E1E8F0]">
        <div className="text-[#556B82]">
          Candidate: <span className="text-[#0B192C] font-bold">{report.candidateName}</span> ({report.candidateId})
        </div>
        <div className="text-[#556B82]">
          Failure Event: <span className="text-[#D97706] font-bold">{report.failureReason}</span>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2.5">
          <div className="text-[10px] text-[#556B82]">AI CONFIDENCE</div>
          <div className="text-sm font-bold text-[#00A8FF] mt-0.5">
            {report.confidenceScore}% (High)
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2.5">
          <div className="text-[10px] text-[#556B82]">RESTORE TIME</div>
          <div className="text-sm font-bold text-[#00A8FF] mt-0.5">
            {report.durationMs} ms
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2.5">
          <div className="text-[10px] text-[#556B82]">CHECKPOINT ID</div>
          <div className="text-xs font-bold text-[#0B192C] mt-0.5 truncate" title={report.checkpointId}>
            {report.checkpointId}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-2.5">
          <div className="text-[10px] text-[#556B82]">DATA INTEGRITY</div>
          <div className="text-xs font-bold text-[#00A8FF] mt-0.5">
            {report.dataConsistency}
          </div>
        </div>
      </div>

      {/* Reasoning Steps */}
      <div className="space-y-1.5 flex-1 overflow-y-auto font-sans text-xs">
        <div className="text-[10px] font-mono text-[#556B82] uppercase tracking-wider font-bold">
          Verification Chain:
        </div>
        {report.reasoningSteps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2 text-[#556B82] text-[11px] leading-relaxed">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00A8FF] shrink-0 mt-0.5" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

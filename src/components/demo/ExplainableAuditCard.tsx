"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertOctagon } from "lucide-react";
import { RecoveryReportData } from "@/lib/simulationEngine";
import { HashBadge } from "../ui/HashBadge";

interface ExplainableAuditCardProps {
  report: RecoveryReportData | null;
  isSimulating: boolean;
}

export const ExplainableAuditCard: React.FC<ExplainableAuditCardProps> = ({
  report,
  isSimulating,
}) => {
  if (isSimulating) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-xl border border-[#FF4D4D]/40 bg-[#101A14] p-6 text-center text-[#E8FCEF] space-y-4 glitch-active">
        <AlertOctagon className="h-12 w-12 text-[#FF4D4D] animate-bounce" />
        <h3 className="font-heading text-lg font-bold text-[#FF4D4D]">
          SIMULATED FAILURE IN PROGRESS
        </h3>
        <p className="font-mono text-xs text-[#7FA98F]">
          Freezing candidate state snapshot & evaluating ML recovery confidence...
        </p>
        <div className="h-1.5 w-48 bg-[#0A3D24] rounded-full overflow-hidden">
          <div className="h-full bg-[#FF4D4D] animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-xl border border-[#0A3D24] bg-[#0B120E]/90 p-6 text-center text-[#7FA98F] space-y-3 font-mono text-xs">
        <ShieldCheck className="h-10 w-10 text-[#00FF7F]/40" />
        <div className="font-bold text-[#E8FCEF]">EXPLAINABLE RECOVERY ENGINE IDLE</div>
        <p className="text-[11px] max-w-xs">
          Select a candidate and click &quot;Trigger Simulated Failure&quot; to generate a real-time explainable audit report.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#00FF7F]/40 bg-[#0B120E]/95 backdrop-blur-md p-5 text-[#E8FCEF] space-y-4 shadow-[0_0_25px_rgba(0,255,127,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#0A3D24] pb-3">
        <div className="flex items-center gap-2 text-[#00FF7F] font-mono text-xs font-bold">
          <ShieldCheck className="h-4 w-4" />
          <span>EXPLAINABLE AUDIT REPORT</span>
        </div>
        <span className="rounded bg-[#0A3D24] px-2 py-0.5 font-mono text-[10px] text-[#00FF7F] font-bold">
          RECOVERY VERIFIED
        </span>
      </div>

      {/* Candidate Metadata */}
      <div className="font-mono text-xs space-y-1 bg-[#05070A] p-3 rounded border border-[#0A3D24]">
        <div className="text-[#7FA98F]">
          Candidate: <span className="text-[#E8FCEF] font-bold">{report.candidateName}</span> ({report.candidateId})
        </div>
        <div className="text-[#7FA98F]">
          Failure Event: <span className="text-[#FF4D4D] font-bold">{report.failureReason}</span>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="rounded border border-[#0A3D24] bg-[#05070A] p-2.5">
          <div className="text-[10px] text-[#7FA98F]">AI CONFIDENCE</div>
          <div className="text-sm font-bold text-[#00FF7F] green-glow-text mt-0.5">
            {report.confidenceScore}% (High)
          </div>
        </div>

        <div className="rounded border border-[#0A3D24] bg-[#05070A] p-2.5">
          <div className="text-[10px] text-[#7FA98F]">RESTORE TIME</div>
          <div className="text-sm font-bold text-[#00FF7F] mt-0.5">
            {report.durationMs} ms
          </div>
        </div>

        <div className="rounded border border-[#0A3D24] bg-[#05070A] p-2.5">
          <div className="text-[10px] text-[#7FA98F]">CHECKPOINT ID</div>
          <div className="text-xs font-bold text-[#E8FCEF] mt-0.5 truncate" title={report.checkpointId}>
            {report.checkpointId}
          </div>
        </div>

        <div className="rounded border border-[#0A3D24] bg-[#05070A] p-2.5">
          <div className="text-[10px] text-[#7FA98F]">DATA INTEGRITY</div>
          <div className="text-xs font-bold text-[#00FF7F] mt-0.5">
            {report.dataConsistency}
          </div>
        </div>
      </div>

      {/* Reasoning Steps */}
      <div className="flex-1 rounded border border-[#0A3D24] bg-[#101A14] p-3 font-mono text-[11px] space-y-1.5 overflow-y-auto">
        <div className="text-[#00FF7F] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" /> Reasoning Logs:
        </div>
        {report.reasoningSteps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-1.5 text-[#7FA98F]">
            <span className="text-[#00FF7F] font-bold">&gt;</span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* Hash Badge */}
      <div className="border-t border-[#0A3D24] pt-2">
        <HashBadge hash={report.hash} blockNumber={report.blockNumber} verified />
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Terminal } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "error" | "success" | "critical";
  candidateId: string;
  message: string;
}

interface BehavioralLogStreamProps {
  logs: LogEntry[];
}

export const BehavioralLogStream: React.FC<BehavioralLogStreamProps> = ({ logs }) => {
  return (
    <div className="rounded-2xl border border-[#1E3A5F] bg-[#07111E] p-4 text-white font-mono text-xs space-y-2 shadow-inner">
      <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-2 text-[#00A8FF]">
        <div className="flex items-center gap-2 font-bold">
          <Terminal className="h-4 w-4 text-[#00A8FF]" />
          <span>BEHAVIORAL RISK & TELEMETRY LOG</span>
        </div>
        <span className="text-[10px] text-[#8AA4BE]">100HZ SOCKET STREAM</span>
      </div>

      <div className="h-28 overflow-y-auto space-y-1.5 pr-2">
        {logs.map((log) => {
          const typeColors = {
            info: "text-[#8AA4BE]",
            warning: "text-[#FFB020]",
            error: "text-[#EF4444] font-bold",
            critical: "text-[#EF4444] font-bold",
            success: "text-[#00A8FF] font-bold",
          };

          return (
            <div key={log.id} className="flex items-center gap-2 text-[11px]">
              <span className="text-[#556B82] text-[10px]">{log.timestamp}</span>
              <span className="text-white font-bold">[{log.candidateId}]</span>
              <span className={typeColors[log.type] || "text-[#8AA4BE]"}>{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

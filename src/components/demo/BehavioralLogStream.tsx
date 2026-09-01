"use client";

import React from "react";
import { Terminal } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "error" | "success";
  candidateId: string;
  message: string;
}

interface BehavioralLogStreamProps {
  logs: LogEntry[];
}

export const BehavioralLogStream: React.FC<BehavioralLogStreamProps> = ({ logs }) => {
  return (
    <div className="rounded-xl border border-[#0A3D24] bg-[#05070A] p-4 text-[#E8FCEF] font-mono text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-[#0A3D24] pb-2 text-[#00FF7F]">
        <div className="flex items-center gap-2 font-bold">
          <Terminal className="h-4 w-4 text-[#00FF7F]" />
          <span>BEHAVIORAL RISK DETECTION & TELEMETRY STREAM</span>
        </div>
        <span className="text-[10px] text-[#7FA98F]">LIVE SOCKET STREAM</span>
      </div>

      <div className="h-28 overflow-y-auto space-y-1 pr-2">
        {logs.map((log) => {
          const typeColors = {
            info: "text-[#7FA98F]",
            warning: "text-[#FFB020]",
            error: "text-[#FF4D4D] font-bold",
            success: "text-[#00FF7F] font-bold",
          };

          return (
            <div key={log.id} className="flex items-center gap-2">
              <span className="text-[#0A3D24] text-[10px]">{log.timestamp}</span>
              <span className="text-[#E8FCEF] font-bold">[{log.candidateId}]</span>
              <span className={typeColors[log.type]}>{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Battery,
  Cpu,
  Wifi,
  HardDrive,
  RotateCcw
} from "lucide-react";
import { CandidateSession, TelemetryPoint } from "@/lib/simulationEngine";
import { StatusRing } from "../ui/StatusRing";

interface SessionDetailPanelProps {
  candidate: CandidateSession;
  telemetry: TelemetryPoint[];
  onTriggerFailure: (candidateId: string) => void;
  isTriggering: boolean;
}

export const SessionDetailPanel: React.FC<SessionDetailPanelProps> = ({
  candidate,
  telemetry,
  onTriggerFailure,
  isTriggering,
}) => {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#E1E8F0] bg-white shadow-sm p-5 text-[#0E1E33] space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#E1E8F0] pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <StatusRing status={candidate.status} size="lg" showLabel />
            <h2 className="font-heading text-xl font-bold text-[#0B192C]">
              {candidate.name}
            </h2>
            <span className="font-mono text-xs text-[#556B82] bg-[#F4F8FC] px-2.5 py-0.5 rounded-full border border-[#E1E8F0]">
              {candidate.id}
            </span>
          </div>
          <p className="font-mono text-xs text-[#556B82]">
            Exam: <span className="text-[#0B192C] font-semibold">{candidate.examSubject}</span> | Candidate Num: {candidate.candidateNumber}
          </p>
        </div>

        {/* Trigger Simulation Button */}
        <button
          onClick={() => onTriggerFailure(candidate.id)}
          disabled={isTriggering || candidate.status === "recovering"}
          id="trigger-failure-btn"
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
            isTriggering || candidate.status === "recovering"
              ? "bg-[#D97706] text-white animate-pulse"
              : "btn-cyan !py-2.5 !px-5"
          }`}
        >
          <RotateCcw className={`h-4 w-4 ${isTriggering ? "animate-spin" : ""}`} />
          <span>
            {isTriggering || candidate.status === "recovering"
              ? "Recovering State (2.4s)..."
              : "Simulate Failover Event"}
          </span>
        </button>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-3">
          <div className="text-[10px] text-[#556B82] flex items-center gap-1 uppercase font-bold">
            <Wifi className="h-3 w-3 text-[#00A8FF]" /> Network Latency
          </div>
          <div className="text-lg font-bold text-[#00A8FF] mt-1 tabular-nums">
            {candidate.latency} ms
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-3">
          <div className="text-[10px] text-[#556B82] flex items-center gap-1 uppercase font-bold">
            <Cpu className="h-3 w-3 text-[#00A8FF]" /> CPU Core Load
          </div>
          <div className="text-lg font-bold text-[#0B192C] mt-1 tabular-nums">
            {candidate.cpuLoad} %
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-3">
          <div className="text-[10px] text-[#556B82] flex items-center gap-1 uppercase font-bold">
            <Battery className="h-3 w-3 text-[#00A8FF]" /> Device Battery
          </div>
          <div className="text-lg font-bold text-[#0B192C] mt-1 tabular-nums">
            {candidate.battery} %
          </div>
        </div>

        <div className="rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-3">
          <div className="text-[10px] text-[#556B82] flex items-center gap-1 uppercase font-bold">
            <HardDrive className="h-3 w-3 text-[#00A8FF]" /> Risk Score
          </div>
          <div className={`text-lg font-bold mt-1 tabular-nums ${candidate.riskScore > 60 ? "text-[#D97706]" : "text-[#00A8FF]"}`}>
            {candidate.riskScore} %
          </div>
        </div>
      </div>

      {/* Real-time Recharts Stream */}
      <div className="flex-1 rounded-xl border border-[#E1E8F0] bg-[#F4F8FC] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[#556B82] mb-2">
          <span className="flex items-center gap-1.5 font-bold text-[#0B192C]">
            <Activity className="h-3.5 w-3.5 text-[#00A8FF]" />
            LIVE TELEMETRY WAVEFORM (100HZ)
          </span>
          <span className="text-[#00A8FF] font-semibold">STREAM STABLE</span>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetry}>
              <XAxis dataKey="time" stroke="#8AA4BE" fontSize={10} tickLine={false} />
              <YAxis stroke="#8AA4BE" fontSize={10} domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B192C",
                  border: "1px solid #1E3A5F",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#FFFFFF",
                }}
              />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#00A8FF"
                strokeWidth={2}
                dot={false}
                name="Latency (ms)"
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#556B82"
                strokeWidth={1.5}
                dot={false}
                name="CPU (%)"
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#D97706"
                strokeWidth={1.5}
                dot={false}
                name="Risk Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State Delta & Checkpoint Info */}
      <div className="rounded-xl border border-[#E1E8F0] bg-[#FAFCFE] p-3 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[#556B82] block text-[10px]">LAST CHECKPOINT:</span>
          <span className="font-bold text-[#0B192C]">{candidate.lastCheckpointId}</span>
        </div>
        <div>
          <span className="text-[#556B82] block text-[10px]">STATE SHA-256:</span>
          <span className="text-[#00A8FF] truncate max-w-[140px] block">{candidate.hash}</span>
        </div>
        <div>
          <span className="text-[#556B82] block text-[10px]">PROGRESS:</span>
          <span className="font-bold text-[#0B192C]">Q{candidate.currentQuestion} / {candidate.totalQuestions}</span>
        </div>
        <div>
          <span className="text-[#556B82] block text-[10px]">LAST TIMESTAMP:</span>
          <span className="font-bold text-[#0B192C]">{candidate.checkpointTimestamp}</span>
        </div>
      </div>
    </div>
  );
};

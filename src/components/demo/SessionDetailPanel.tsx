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
} from "lucide-react";
import { CandidateSession, TelemetryPoint } from "@/lib/simulationEngine";
import { StatusRing } from "../ui/StatusRing";
import { GlowButton } from "../ui/GlowButton";

interface SessionDetailPanelProps {
  candidate: CandidateSession;
  telemetryData: TelemetryPoint[];
  onTriggerFailure: (candidateId: string) => void;
  isTriggering: boolean;
}

export const SessionDetailPanel: React.FC<SessionDetailPanelProps> = ({
  candidate,
  telemetryData,
  onTriggerFailure,
  isTriggering,
}) => {
  return (
    <div className="flex flex-col h-full rounded-xl border border-[#0A3D24] bg-[#0B120E]/90 backdrop-blur-md p-5 text-[#E8FCEF] space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#0A3D24] pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <StatusRing status={candidate.status} size="lg" showLabel />
            <h2 className="font-heading text-xl font-bold text-[#E8FCEF]">
              {candidate.name}
            </h2>
            <span className="font-mono text-xs text-[#7FA98F] bg-[#05070A] px-2 py-0.5 rounded border border-[#0A3D24]">
              {candidate.id}
            </span>
          </div>
          <p className="font-mono text-xs text-[#7FA98F]">
            Exam: <span className="text-[#E8FCEF]">{candidate.examSubject}</span> | Candidate Num: {candidate.candidateNumber}
          </p>
        </div>

        {/* Trigger Simulation Button */}
        <GlowButton
          variant={isTriggering || candidate.status === "recovering" ? "danger" : "warning"}
          size="md"
          onClick={() => onTriggerFailure(candidate.id)}
          disabled={isTriggering || candidate.status === "recovering"}
          icon={<AlertTriangle className="h-4 w-4" />}
          id="trigger-failure-btn"
        >
          {isTriggering || candidate.status === "recovering"
            ? "RECOVERING STATE..."
            : "TRIGGER SIMULATED FAILURE"}
        </GlowButton>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-3">
          <div className="text-[10px] text-[#7FA98F] flex items-center gap-1 uppercase">
            <Wifi className="h-3 w-3 text-[#00FF7F]" /> Network Latency
          </div>
          <div className="text-lg font-bold text-[#00FF7F] mt-1 tabular-nums">
            {candidate.latency} ms
          </div>
        </div>

        <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-3">
          <div className="text-[10px] text-[#7FA98F] flex items-center gap-1 uppercase">
            <Cpu className="h-3 w-3 text-[#00FF7F]" /> CPU Core Load
          </div>
          <div className="text-lg font-bold text-[#00FF7F] mt-1 tabular-nums">
            {candidate.cpuLoad} %
          </div>
        </div>

        <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-3">
          <div className="text-[10px] text-[#7FA98F] flex items-center gap-1 uppercase">
            <Battery className="h-3 w-3 text-[#00FF7F]" /> Device Battery
          </div>
          <div className="text-lg font-bold text-[#E8FCEF] mt-1 tabular-nums">
            {candidate.battery} %
          </div>
        </div>

        <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-3">
          <div className="text-[10px] text-[#7FA98F] flex items-center gap-1 uppercase">
            <HardDrive className="h-3 w-3 text-[#00FF7F]" /> State Delta Sync
          </div>
          <div className="text-lg font-bold text-[#00FF7F] mt-1 tabular-nums">
            {candidate.stateDelta} B
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Sparkline Chart (Recharts) */}
      <div className="rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 font-mono text-xs text-[#00FF7F]">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#00FF7F] animate-pulse" />
            REAL-TIME TELEMETRY STREAM (100Hz)
          </span>
          <span className="text-[10px] text-[#7FA98F]">LIVE METRIC Delta</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryData}>
              <XAxis
                dataKey="time"
                stroke="#7FA98F"
                tick={{ fontSize: 10, fill: "#7FA98F" }}
              />
              <YAxis stroke="#7FA98F" tick={{ fontSize: 10, fill: "#7FA98F" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B120E",
                  borderColor: "#00FF7F",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#E8FCEF",
                }}
              />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#00FF7F"
                strokeWidth={2}
                dot={false}
                name="Latency (ms)"
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#FFB020"
                strokeWidth={1.5}
                dot={false}
                name="CPU Load (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

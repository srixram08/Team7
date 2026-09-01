"use client";

import React, { useState } from "react";
import { Search, Cpu } from "lucide-react";
import { CandidateSession } from "@/lib/simulationEngine";
import { StatusRing, SessionStatus } from "../ui/StatusRing";

interface SessionGridProps {
  candidates: CandidateSession[];
  selectedCandidateId: string;
  onSelectCandidate: (id: string) => void;
}

export const SessionGrid: React.FC<SessionGridProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const [filter, setFilter] = useState<"all" | SessionStatus>("all");
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.examSubject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#0A3D24] bg-[#0B120E]/90 backdrop-blur-md p-4 text-[#E8FCEF]">
      {/* Header & Filter Controls */}
      <div className="space-y-3 border-b border-[#0A3D24] pb-4 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#00FF7F] flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#00FF7F]" />
            <span>EXAMINEE SESSIONS</span>
          </h3>
          <span className="font-mono text-xs text-[#7FA98F] bg-[#05070A] px-2 py-0.5 rounded border border-[#0A3D24]">
            {filteredCandidates.length} ACTIVE
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7FA98F]" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[#0A3D24] bg-[#05070A] pl-9 pr-3 py-1.5 font-mono text-xs text-[#E8FCEF] placeholder-[#7FA98F] focus:border-[#00FF7F] focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-[11px] font-mono">
          {(["all", "stable", "at-risk", "recovering"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded uppercase tracking-wider transition-colors shrink-0 ${
                filter === f
                  ? "bg-[#0A3D24] text-[#00FF7F] font-bold border border-[#00FF7F]/40"
                  : "text-[#7FA98F] hover:text-[#E8FCEF]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List Stream */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {filteredCandidates.map((candidate) => {
          const isSelected = candidate.id === selectedCandidateId;

          return (
            <div
              key={candidate.id}
              onClick={() => onSelectCandidate(candidate.id)}
              className={`group relative cursor-pointer rounded-lg border p-3 font-mono transition-all duration-200 ${
                isSelected
                  ? "border-[#00FF7F] bg-[#101A14] shadow-[0_0_15px_rgba(0,255,127,0.2)]"
                  : "border-[#0A3D24] bg-[#05070A]/80 hover:border-[#00FF7F]/40 hover:bg-[#0B120E]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <StatusRing status={candidate.status} size="sm" />
                  <span className="font-heading font-bold text-xs text-[#E8FCEF] group-hover:text-[#00FF7F]">
                    {candidate.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#7FA98F]">{candidate.id}</span>
              </div>

              <div className="text-[11px] text-[#7FA98F] truncate mb-2">
                {candidate.examSubject}
              </div>

              {/* Progress & Risk Score Bar */}
              <div className="flex items-center justify-between text-[10px] border-t border-[#0A3D24]/60 pt-2 text-[#7FA98F]">
                <div>
                  Q <span className="text-[#E8FCEF] font-bold">{candidate.currentQuestion}</span> / {candidate.totalQuestions}
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Risk Score:</span>
                  <span
                    className={`font-bold ${
                      candidate.riskScore > 60
                        ? "text-[#FF4D4D]"
                        : candidate.riskScore > 30
                        ? "text-[#FFB020]"
                        : "text-[#00FF7F]"
                    }`}
                  >
                    {candidate.riskScore}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

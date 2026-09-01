"use client";

import React, { useState } from "react";
import { Search, Cpu, Users } from "lucide-react";
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
    <div className="flex flex-col h-full rounded-2xl border border-[#E1E8F0] bg-white shadow-sm p-4 text-[#0E1E33]">
      {/* Header & Filter Controls */}
      <div className="space-y-3 border-b border-[#E1E8F0] pb-4 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00A8FF]" />
            <span>Examinee Sessions</span>
          </h3>
          <span className="font-mono text-xs text-[#00A8FF] bg-[#E6F5FF] px-2.5 py-0.5 rounded-full border border-[#00A8FF]/30 font-bold">
            {filteredCandidates.length} ACTIVE
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#556B82]" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] pl-9 pr-3 py-2 font-sans text-xs text-[#0B192C] placeholder-[#8AA4BE] focus:border-[#00A8FF] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono">
          {(["all", "stable", "at-risk", "recovering"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                filter === f
                  ? "bg-[#00A8FF] text-white font-bold shadow-sm"
                  : "bg-[#F4F8FC] text-[#556B82] hover:text-[#0B192C] hover:bg-[#E6F5FF]"
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
              className={`group relative cursor-pointer rounded-xl border p-3 font-sans transition-all duration-200 ${
                isSelected
                  ? "border-[#00A8FF] bg-[#E6F5FF] shadow-md ring-1 ring-[#00A8FF]"
                  : "border-[#E1E8F0] bg-[#FAFCFE] hover:border-[#00A8FF] hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <StatusRing status={candidate.status} size="sm" />
                  <span className="font-heading font-bold text-xs text-[#0B192C] group-hover:text-[#00A8FF]">
                    {candidate.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#556B82]">{candidate.id}</span>
              </div>

              <div className="text-[11px] text-[#556B82] truncate mb-2">
                {candidate.examSubject}
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#556B82] border-t border-[#E1E8F0]/60 pt-1.5">
                <span>Latency: <strong className="text-[#00A8FF]">{candidate.latency}ms</strong></span>
                <span>Risk: <strong className={candidate.riskScore > 60 ? "text-[#D97706]" : "text-[#00A8FF]"}>{candidate.riskScore}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

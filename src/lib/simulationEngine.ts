"use client";

import { SessionStatus } from "../components/ui/StatusRing";

export interface CandidateSession {
  id: string;
  name: string;
  candidateNumber: string;
  examSubject: string;
  currentQuestion: number;
  totalQuestions: number;
  status: SessionStatus;
  riskScore: number; // 0 - 100
  latency: number; // ms
  cpuLoad: number; // %
  battery: number; // %
  stateDelta: number; // Bytes
  lastCheckpointId: string;
  checkpointTimestamp: string;
  hash: string;
}

export interface TelemetryPoint {
  time: string;
  latency: number;
  cpu: number;
  riskScore: number;
}

export interface RecoveryReportData {
  candidateId: string;
  candidateName: string;
  failureReason: string;
  confidenceScore: number;
  checkpointId: string;
  checkpointTime: string;
  durationMs: number;
  dataConsistency: string;
  hash: string;
  blockNumber: number;
  reasoningSteps: string[];
}

export const INITIAL_CANDIDATES: CandidateSession[] = [
  {
    id: "STU-84920",
    name: "Alex Chen",
    candidateNumber: "CN-2026-881A",
    examSubject: "Advanced Distributed Systems",
    currentQuestion: 14,
    totalQuestions: 40,
    status: "stable",
    riskScore: 12,
    latency: 14,
    cpuLoad: 24,
    battery: 88,
    stateDelta: 142,
    lastCheckpointId: "CHK-1042-89B",
    checkpointTimestamp: "2026-07-28 20:44:09",
    hash: "0xa8f492c10b7e49d29f8c12a3456789abcdef",
  },
  {
    id: "STU-84921",
    name: "Sarah Jenkins",
    candidateNumber: "CN-2026-902B",
    examSubject: "Quantum Information Theory",
    currentQuestion: 22,
    totalQuestions: 40,
    status: "at-risk",
    riskScore: 78,
    latency: 180,
    cpuLoad: 89,
    battery: 15,
    stateDelta: 512,
    lastCheckpointId: "CHK-1042-91A",
    checkpointTimestamp: "2026-07-28 20:43:55",
    hash: "0x7b3e19a45f8c12b99d0e12345678912345",
  },
  {
    id: "STU-84922",
    name: "Marcus Vance",
    candidateNumber: "CN-2026-744C",
    examSubject: "Cryptographic Engineering",
    currentQuestion: 9,
    totalQuestions: 40,
    status: "stable",
    riskScore: 5,
    latency: 12,
    cpuLoad: 18,
    battery: 95,
    stateDelta: 96,
    lastCheckpointId: "CHK-1042-88C",
    checkpointTimestamp: "2026-07-28 20:44:01",
    hash: "0x3f1e92d88c7a10b44e211234567890abc",
  },
  {
    id: "STU-84923",
    name: "Elena Rostova",
    candidateNumber: "CN-2026-611D",
    examSubject: "Autonomous Systems AI",
    currentQuestion: 31,
    totalQuestions: 40,
    status: "stable",
    riskScore: 18,
    latency: 22,
    cpuLoad: 31,
    battery: 64,
    stateDelta: 280,
    lastCheckpointId: "CHK-1042-94D",
    checkpointTimestamp: "2026-07-28 20:44:11",
    hash: "0xc991e2b44a701e9b2c3d1234567894567",
  },
  {
    id: "STU-84924",
    name: "Devon Thorne",
    candidateNumber: "CN-2026-505E",
    examSubject: "Compiler Construction",
    currentQuestion: 18,
    totalQuestions: 40,
    status: "stable",
    riskScore: 28,
    latency: 35,
    cpuLoad: 42,
    battery: 45,
    stateDelta: 190,
    lastCheckpointId: "CHK-1042-90E",
    checkpointTimestamp: "2026-07-28 20:43:40",
    hash: "0x1a2b3c4d5e6f7a8b9c0d123456789efgh",
  },
];

export const generateMockTelemetry = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = new Date();

  for (let i = 10; i >= 0; i--) {
    const timeStr = new Date(now.getTime() - i * 3000).toLocaleTimeString("en-US", {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
    });
    points.push({
      time: timeStr,
      latency: Math.floor(12 + Math.random() * 20),
      cpu: Math.floor(20 + Math.random() * 25),
      riskScore: Math.floor(8 + Math.random() * 15),
    });
  }

  return points;
};

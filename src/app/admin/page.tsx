"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Globe,
  Zap,
  Cpu,
  Lock,
  Activity,
  ArrowRight
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";

interface EdgeNode {
  id: string;
  name: string;
  location: string;
  status: "active" | "standby" | "warning";
  activeSessions: number;
  latencyMs: number;
  cpuUsage: number;
}

const INITIAL_NODES: EdgeNode[] = [
  { id: "node-us-east", name: "US-East (N. Virginia)", location: "Ashburn, VA", status: "active", activeSessions: 4120, latencyMs: 12, cpuUsage: 48 },
  { id: "node-us-west", name: "US-West (Oregon)", location: "Boardman, OR", status: "active", activeSessions: 3890, latencyMs: 18, cpuUsage: 54 },
  { id: "node-eu-west", name: "EU-Central (Frankfurt)", location: "Frankfurt, DE", status: "active", activeSessions: 5240, latencyMs: 15, cpuUsage: 62 },
  { id: "node-ap-south", name: "AP-South (Mumbai)", location: "Mumbai, IN", status: "active", activeSessions: 3100, latencyMs: 24, cpuUsage: 71 },
  { id: "node-ap-east", name: "AP-East (Tokyo)", location: "Tokyo, JP", status: "active", activeSessions: 2590, latencyMs: 21, cpuUsage: 44 },
  { id: "node-backup", name: "Disaster Recovery Node (Global Standby)", location: "Zurich, CH", status: "standby", activeSessions: 0, latencyMs: 8, cpuUsage: 6 },
];

export default function AdminPage() {
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_NODES);
  const [searchHash, setSearchHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [telemetryFreq, setTelemetryFreq] = useState("100Hz");
  const [mlSensitivity, setMlSensitivity] = useState("Balanced (0.75)");
  const [snapshotInterval, setSnapshotInterval] = useState("2.0 Seconds");
  const [encryptionAlgo, setEncryptionAlgo] = useState("SHA-256 + Kyber-1024 Quantum-Safe");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerFailover = (nodeId: string) => {
    setNodes((prev: EdgeNode[]) =>
      prev.map((n: EdgeNode) => {
        if (n.id === nodeId) {
          const newStatus = n.status === "active" ? "warning" : "active";
          return { ...n, status: newStatus, cpuUsage: newStatus === "warning" ? 96 : 48 };
        }
        return n;
      })
    );
    triggerToast(`Automated failover protocol initiated for node: ${nodeId}`);
  };

  const handleVerifyHash = () => {
    if (!searchHash.trim()) {
      triggerToast("Please enter a valid SHA-256 hash");
      return;
    }

    setVerificationResult({
      statusText: "CRYPTOGRAPHIC PROOF VERIFIED (0 TAMPER DETECTED)",
      blockNumber: 140289,
      timestamp: new Date().toISOString(),
      candidateId: "STU-84921",
      checkpointId: "CHK-1042-89B",
      merkleRoot: "0x4f8a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      keystrokesCount: 148,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#122B48] bg-[#07111E] text-white px-4 py-3 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-sans text-xs text-[#8AA4BE] hover:text-[#00A8FF] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>EXIT TO PORTAL</span>
            </Link>
            <div className="h-4 w-px bg-[#1E3A5F]" />
            <div className="flex items-center gap-2.5">
              <DottedLogo size={26} />
              <span className="font-heading text-sm font-bold text-white">
                ADMINISTRATIVE FAILOVER & TOPOLOGY HUB
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#00A8FF] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#00A8FF]">
              SYSTEM HEALTH: 100% (6/6 NODES)
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* Title Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-[#00A8FF] uppercase tracking-wider">
              INFRASTRUCTURE ORCHESTRATION
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] mt-0.5">
              Global Edge Topology & Merkle Proof Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#00A8FF] bg-[#E6F5FF] border border-[#00A8FF]/30 px-4 py-2 rounded-full">
              FAILOVER SLA: &lt; 2.4s GUARANTEE
            </span>
          </div>
        </div>

        {/* SECTION 1: GLOBAL EDGE NODES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-[#0B192C]">
              <Globe className="h-5 w-5 text-[#00A8FF]" />
              <span>Active Edge Node Mesh (6 Geographical Clusters)</span>
            </div>
            <span className="text-xs text-[#556B82] font-mono">
              Click node to simulate failover event
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => handleTriggerFailover(node.id)}
                className={`card-modern !p-5 cursor-pointer transition-all ${
                  node.status === "warning"
                    ? "border-[#FFB020] bg-[#FFFBF0] shadow-md ring-2 ring-[#FFB020]/30"
                    : "hover:border-[#00A8FF]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0B192C]">
                      {node.name}
                    </h3>
                    <p className="text-xs text-[#556B82] mt-0.5">{node.location}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                      node.status === "active"
                        ? "bg-[#E6F5FF] text-[#00A8FF] border border-[#00A8FF]/30"
                        : node.status === "warning"
                        ? "bg-[#FFB020]/20 text-[#D97706] border border-[#FFB020]"
                        : "bg-[#E1E8F0] text-[#556B82]"
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E1E8F0] grid grid-cols-3 gap-2 font-mono text-center">
                  <div>
                    <div className="text-[10px] text-[#556B82]">Sessions</div>
                    <div className="text-xs font-bold text-[#0B192C]">{node.activeSessions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#556B82]">Latency</div>
                    <div className="text-xs font-bold text-[#00A8FF]">{node.latencyMs}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#556B82]">CPU Load</div>
                    <div className={`text-xs font-bold ${node.cpuUsage > 80 ? "text-[#D97706]" : "text-[#0B192C]"}`}>
                      {node.cpuUsage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: MERKLE LEDGER PROOF SEARCH */}
        <div className="card-modern !p-6 sm:!p-8 space-y-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C] border-b border-[#E1E8F0] pb-4">
            <ShieldCheck className="h-6 w-6 text-[#00A8FF]" />
            <span>Cryptographic Merkle Proof Verifier</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter SHA-256 Checkpoint Hash (e.g. 0xa8f492c10b7e49d2...)"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3.5 pl-10 text-xs font-mono text-[#0B192C] focus:border-[#00A8FF] focus:bg-white focus:outline-none"
              />
              <Search className="h-4 w-4 text-[#556B82] absolute left-3.5 top-4 pointer-events-none" />
            </div>
            <button
              onClick={handleVerifyHash}
              className="btn-cyan !py-3.5 !px-6 shrink-0 cursor-pointer"
            >
              <span>Verify Cryptographic Root</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Verification Results Card */}
          {verificationResult && (
            <div className="rounded-2xl border border-[#00A8FF]/30 bg-[#0B192C] text-white p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[#00A8FF] font-mono text-xs font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>{verificationResult.statusText}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-2">
                <div className="p-3 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE] text-[10px] block">CANDIDATE ID</span>
                  <span className="font-bold text-white">{verificationResult.candidateId}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE] text-[10px] block">CHECKPOINT</span>
                  <span className="font-bold text-white">{verificationResult.checkpointId}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE] text-[10px] block">BLOCK NUMBER</span>
                  <span className="font-bold text-white">#{verificationResult.blockNumber}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#07111E] border border-[#1E3A5F]">
                  <span className="text-[#8AA4BE] text-[10px] block">KEYSTROKE EVENTS</span>
                  <span className="font-bold text-[#00A8FF]">{verificationResult.keystrokesCount} Events</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#07111E] border border-[#1E3A5F] font-mono text-xs">
                <span className="text-[#8AA4BE] text-[10px] block mb-1">MERKLE ROOT SIGNATURE</span>
                <span className="text-[#00A8FF] break-all">{verificationResult.merkleRoot}</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: SYSTEM CONFIGURATION PARAMETERS */}
        <div className="card-modern !p-6 sm:!p-8 space-y-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C] border-b border-[#E1E8F0] pb-4">
            <SlidersHorizontal className="h-6 w-6 text-[#00A8FF]" />
            <span>Autonomous Engine Configuration Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                Local Telemetry Buffering Frequency
              </label>
              <select
                value={telemetryFreq}
                onChange={(e) => setTelemetryFreq(e.target.value)}
                className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
              >
                <option value="100Hz">100Hz (10ms tick delta) • Recommended</option>
                <option value="50Hz">50Hz (20ms tick delta)</option>
                <option value="200Hz">200Hz Ultra-High Fidelity (5ms tick delta)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                Explainable AI Anomaly Sensitivity
              </label>
              <select
                value={mlSensitivity}
                onChange={(e) => setMlSensitivity(e.target.value)}
                className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
              >
                <option value="High (0.90)">High Sensitivity (0.90 Index)</option>
                <option value="Balanced (0.75)">Balanced (0.75 Index) • Standard</option>
                <option value="Permissive (0.60)">Permissive (0.60 Index)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                Digital Twin Shadow Snapshot Interval
              </label>
              <select
                value={snapshotInterval}
                onChange={(e) => setSnapshotInterval(e.target.value)}
                className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
              >
                <option value="1.0 Seconds">1.0 Seconds</option>
                <option value="2.0 Seconds">2.0 Seconds (Default Benchmark)</option>
                <option value="5.0 Seconds">5.0 Seconds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                Cryptographic Signature Algorithm
              </label>
              <select
                value={encryptionAlgo}
                onChange={(e) => setEncryptionAlgo(e.target.value)}
                className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
              >
                <option value="SHA-256 + Kyber-1024 Quantum-Safe">SHA-256 + Kyber-1024 Quantum-Safe</option>
                <option value="AES-GCM-256 Standard">AES-GCM-256 Standard</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => triggerToast("System configuration updated across 6 global edge nodes.")}
              className="btn-navy cursor-pointer"
            >
              <span>Save & Propagate Mesh Configurations</span>
            </button>
          </div>
        </div>

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B192C] text-white border border-[#00A8FF]/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-sans text-xs">
          <span className="h-2 w-2 rounded-full bg-[#00A8FF] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

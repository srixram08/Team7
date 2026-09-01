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
  Globe
} from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";

interface EdgeNode {
  id: string;
  name: string;
  location: string;
  status: "active" | "standby" | "warning";
  activeSessions: number;
  latencyMs: number;
  cpuUsage: number;
}

interface VerificationResult {
  verified: boolean;
  hash: string;
  candidateId: string;
  checkpointId: string;
  blockNumber: number;
  timestamp: string;
  merkleRoot: string;
  statusText: string;
}

const INITIAL_NODES: EdgeNode[] = [
  { id: "node-us-east", name: "US-East-1 (Virginia)", location: "North America", status: "active", activeSessions: 4120, latencyMs: 12, cpuUsage: 34 },
  { id: "node-us-west", name: "US-West-2 (Oregon)", location: "North America", status: "active", activeSessions: 2850, latencyMs: 18, cpuUsage: 29 },
  { id: "node-eu-central", name: "EU-Central-1 (Frankfurt)", location: "Europe", status: "active", activeSessions: 5200, latencyMs: 22, cpuUsage: 45 },
  { id: "node-ap-south", name: "AP-South-1 (Mumbai)", location: "Asia Pacific", status: "active", activeSessions: 3900, latencyMs: 16, cpuUsage: 38 },
  { id: "node-ap-northeast", name: "AP-Northeast-1 (Tokyo)", location: "Asia Pacific", status: "active", activeSessions: 1980, latencyMs: 28, cpuUsage: 22 },
  { id: "node-sa-east", name: "SA-East-1 (São Paulo)", location: "South America", status: "warning", activeSessions: 890, latencyMs: 84, cpuUsage: 78 },
];

export default function AdminPage() {
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_NODES);
  const [searchHash, setSearchHash] = useState("0xa8f492c10b7e49d29f8c12a3456789abcdef");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>({
    verified: true,
    hash: "0xa8f492c10b7e49d29f8c12a3456789abcdef",
    candidateId: "STU-84920 (Alex Chen)",
    checkpointId: "CHK-1042-89B",
    blockNumber: 140289,
    timestamp: "2026-07-28 20:44:09 UTC",
    merkleRoot: "0x892a01f92e817c34b1049281a8b9e0f",
    statusText: "TAMPER-PROOF VALIDATED (SHA-256 Chain Unbroken)"
  });

  // Config State
  const [telemetryFreq, setTelemetryFreq] = useState("100Hz");
  const [mlSensitivity, setMlSensitivity] = useState("Balanced (0.75)");
  const [snapshotInterval, setSnapshotInterval] = useState("2.0 Seconds");
  const [encryptionAlgo, setEncryptionAlgo] = useState("SHA-256 + Kyber-1024 Quantum-Safe");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyHash = () => {
    if (!searchHash.trim()) return;
    setVerificationResult({
      verified: true,
      hash: searchHash.trim(),
      candidateId: "STU-" + Math.floor(10000 + Math.random() * 90000),
      checkpointId: "CHK-1042-" + Math.floor(10 + Math.random() * 90) + "X",
      blockNumber: 140000 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      merkleRoot: "0x" + Math.random().toString(16).substring(2, 18),
      statusText: "CRYPTOGRAPHIC PROOF VERIFIED (Zero Tampering Detected)"
    });
    triggerToast("Hash verification completed: 100% Chain Integrity");
  };

  const handleTriggerFailover = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: n.status === "warning" ? "active" : "warning", cpuUsage: n.status === "warning" ? 35 : 85 };
      }
      return n;
    }));
    triggerToast(`Edge failover simulation executed for node: ${nodeId}`);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E8FCEF] flex flex-col scanlines">
      {/* Header */}
      <header className="border-b border-[#0A3D24] bg-[#0B120E] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs text-[#7FA98F] hover:text-[#00FF7F] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </Link>
            <div className="h-4 w-px bg-[#0A3D24]" />
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-[#00FF7F]" />
              <span className="font-heading font-bold text-sm text-[#E8FCEF]">
                ADMINISTRATIVE SYSTEM COMMAND CENTER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-[#7FA98F]">
            <span className="flex items-center gap-1.5 text-[#00FF7F]">
              <span className="h-2 w-2 rounded-full bg-[#00FF7F] pulse-dot" />
              6 NODES ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="rounded-lg border border-[#00FF7F] bg-[#0B120E] p-3 text-center font-mono text-xs text-[#00FF7F] shadow-[0_0_20px_rgba(0,255,127,0.3)] animate-pulse">
            {toastMessage}
          </div>
        )}

        {/* Section 1: Global Edge Topology Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-heading font-bold text-base text-[#E8FCEF]">
              <Globe className="h-4 w-4 text-[#00FF7F]" />
              GLOBAL EDGE NODE TOPOLOGY & FAILOVER MESH
            </div>
            <span className="font-mono text-xs text-[#7FA98F]">
              Total Active Candidates: <strong className="text-[#00FF7F]">18,940</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <GlassCard key={node.id} className="p-4 space-y-3 border-[#0A3D24]">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#E8FCEF]">{node.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      node.status === "active"
                        ? "bg-[#0A3D24] text-[#00FF7F]"
                        : "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40"
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] bg-[#05070A] p-2.5 rounded border border-[#0A3D24]">
                  <div>
                    <div className="text-[#7FA98F] text-[9px] uppercase">Latency</div>
                    <div className="text-[#00FF7F] font-bold">{node.latencyMs} ms</div>
                  </div>
                  <div>
                    <div className="text-[#7FA98F] text-[9px] uppercase">CPU Load</div>
                    <div className={node.cpuUsage > 70 ? "text-[#FFB020]" : "text-[#00FF7F]"}>
                      {node.cpuUsage}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[#7FA98F] text-[9px] uppercase">Sessions</div>
                    <div className="text-[#E8FCEF] font-bold">{node.activeSessions}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerFailover(node.id)}
                  className="w-full py-1.5 rounded border border-[#0A3D24] bg-[#0B120E] font-mono text-[11px] text-[#7FA98F] hover:text-[#00FF7F] hover:border-[#00FF7F]/40 transition-colors cursor-pointer"
                >
                  Simulate Node Stress / Failover
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Section 2: Cryptographic Audit Ledger Inspector & System Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Cryptographic Ledger Verifier */}
          <div className="lg:col-span-7 space-y-4">
            <GlassCard className="p-5 space-y-4 border-[#0A3D24]">
              <div className="flex items-center gap-2 border-b border-[#0A3D24] pb-3">
                <ShieldCheck className="h-5 w-5 text-[#00FF7F]" />
                <h3 className="font-heading font-bold text-base text-[#E8FCEF]">
                  CRYPTOGRAPHIC LEDGER & SHA-256 HASH VERIFIER
                </h3>
              </div>

              <p className="font-sans text-xs text-[#7FA98F] leading-relaxed">
                Paste any AROEP candidate checkpoint hash to verify cryptographic chain integrity, zero tamper status, and immutable block timestamp.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                  placeholder="Paste transaction / checkpoint hash 0x..."
                  className="flex-1 rounded-lg border border-[#0A3D24] bg-[#05070A] px-3 py-2 font-mono text-xs text-[#00FF7F] focus:border-[#00FF7F] focus:outline-none"
                />
                <GlowButton variant="primary" size="sm" onClick={handleVerifyHash} icon={<Search className="h-4 w-4" />}>
                  Verify Hash
                </GlowButton>
              </div>

              {/* Verification Output Card */}
              {verificationResult && (
                <div className="rounded-lg border border-[#00FF7F]/40 bg-[#05070A] p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#00FF7F] font-bold border-b border-[#0A3D24] pb-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00FF7F]" />
                    {verificationResult.statusText}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-[#7FA98F]">Candidate ID:</span>
                      <div className="text-[#E8FCEF] font-semibold">{verificationResult.candidateId}</div>
                    </div>
                    <div>
                      <span className="text-[#7FA98F]">Checkpoint ID:</span>
                      <div className="text-[#00FF7F] font-semibold">{verificationResult.checkpointId}</div>
                    </div>
                    <div>
                      <span className="text-[#7FA98F]">Block Number:</span>
                      <div className="text-[#E8FCEF]">{verificationResult.blockNumber}</div>
                    </div>
                    <div>
                      <span className="text-[#7FA98F]">Ledger Timestamp:</span>
                      <div className="text-[#E8FCEF]">{verificationResult.timestamp}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#0A3D24]">
                    <span className="text-[#7FA98F] text-[10px]">Merkle Tree Root:</span>
                    <div className="text-[#00FF7F] text-[11px] font-mono break-all">
                      {verificationResult.merkleRoot}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column: Platform Tuning Parameters */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-5 space-y-4 border-[#0A3D24]">
              <div className="flex items-center gap-2 border-b border-[#0A3D24] pb-3">
                <SlidersHorizontal className="h-5 w-5 text-[#00FF7F]" />
                <h3 className="font-heading font-bold text-base text-[#E8FCEF]">
                  ENGINE CONFIGURATION
                </h3>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Telemetry Stream Frequency */}
                <div className="space-y-1.5">
                  <label className="text-[#7FA98F] flex justify-between">
                    <span>Telemetry Buffer Frequency:</span>
                    <span className="text-[#00FF7F] font-bold">{telemetryFreq}</span>
                  </label>
                  <select
                    value={telemetryFreq}
                    onChange={(e) => setTelemetryFreq(e.target.value)}
                    className="w-full rounded border border-[#0A3D24] bg-[#05070A] p-2 text-[#E8FCEF] focus:border-[#00FF7F] focus:outline-none cursor-pointer"
                  >
                    <option value="50Hz">50Hz (Standard)</option>
                    <option value="100Hz">100Hz (High Precision - Default)</option>
                    <option value="200Hz">200Hz (Ultra High-Definition Telemetry)</option>
                  </select>
                </div>

                {/* ML Anomaly Sensitivity */}
                <div className="space-y-1.5">
                  <label className="text-[#7FA98F] flex justify-between">
                    <span>ML Risk Sensitivity Threshold:</span>
                    <span className="text-[#00FF7F] font-bold">{mlSensitivity}</span>
                  </label>
                  <select
                    value={mlSensitivity}
                    onChange={(e) => setMlSensitivity(e.target.value)}
                    className="w-full rounded border border-[#0A3D24] bg-[#05070A] p-2 text-[#E8FCEF] focus:border-[#00FF7F] focus:outline-none cursor-pointer"
                  >
                    <option value="Relaxed (0.90)">Relaxed (0.90 Threshold)</option>
                    <option value="Balanced (0.75)">Balanced (0.75 Threshold - Recommended)</option>
                    <option value="Strict (0.50)">Strict (0.50 Paranoia Mode)</option>
                  </select>
                </div>

                {/* State Snapshot Sync Interval */}
                <div className="space-y-1.5">
                  <label className="text-[#7FA98F] flex justify-between">
                    <span>State Snapshot Sync Interval:</span>
                    <span className="text-[#00FF7F] font-bold">{snapshotInterval}</span>
                  </label>
                  <select
                    value={snapshotInterval}
                    onChange={(e) => setSnapshotInterval(e.target.value)}
                    className="w-full rounded border border-[#0A3D24] bg-[#05070A] p-2 text-[#E8FCEF] focus:border-[#00FF7F] focus:outline-none cursor-pointer"
                  >
                    <option value="1.0 Second">1.0 Second (Real-Time Synchronous)</option>
                    <option value="2.0 Seconds">2.0 Seconds (Standard Checkpoint)</option>
                    <option value="5.0 Seconds">5.0 Seconds (Low Bandwidth Mode)</option>
                  </select>
                </div>

                {/* Encryption Algorithm */}
                <div className="space-y-1.5">
                  <label className="text-[#7FA98F] flex justify-between">
                    <span>Cryptographic Engine Standard:</span>
                  </label>
                  <select
                    value={encryptionAlgo}
                    onChange={(e) => setEncryptionAlgo(e.target.value)}
                    className="w-full rounded border border-[#0A3D24] bg-[#05070A] p-2 text-[#00FF7F] focus:border-[#00FF7F] focus:outline-none cursor-pointer"
                  >
                    <option value="SHA-256 + Kyber-1024 Quantum-Safe">SHA-256 + Kyber-1024 Quantum-Safe</option>
                    <option value="ECDSA P-256 + AES-GCM-256">ECDSA P-256 + AES-GCM-256</option>
                  </select>
                </div>

                <div className="pt-2">
                  <GlowButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => triggerToast("System Parameters successfully applied & distributed to 6 edge nodes!")}
                  >
                    Save & Distribute Settings
                  </GlowButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

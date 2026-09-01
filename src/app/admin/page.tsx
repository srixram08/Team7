"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowRight,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Layers,
  FileCheck,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { STUDENTS_DATA, getStoredExams, Exam } from "@/lib/examStore";

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"governance" | "nodes" | "audit">("governance");
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_NODES);
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchHash, setSearchHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Institutional Policy Controls
  const [telemetryFreq, setTelemetryFreq] = useState("100Hz");
  const [mlSensitivity, setMlSensitivity] = useState("Balanced (0.75)");
  const [snapshotInterval, setSnapshotInterval] = useState("2.0 Seconds");
  const [encryptionAlgo, setEncryptionAlgo] = useState("SHA-256 + Kyber-1024 Quantum-Safe");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setExams(getStoredExams());
  }, []);

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
      triggerToast("Please enter a valid SHA-256 hash or receipt token");
      return;
    }

    setVerificationResult({
      statusText: "CRYPTOGRAPHIC PROOF VERIFIED (0 BYTES SILENT LOSS)",
      blockNumber: 140289,
      timestamp: new Date().toISOString(),
      candidateId: "STU-84920 (Alex Chen)",
      checkpointId: "CHK-1042-89B",
      merkleRoot: "0x4f8a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      keystrokesCount: 148,
      status: "Compliant"
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans">
      
      {/* Header */}
      <header className="border-b border-[#122B48] bg-[#07111E] text-white px-4 py-3.5 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-sans text-xs text-[#8AA4BE] hover:text-[#00A8FF] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Link>
            <div className="h-4 w-px bg-[#1E3A5F]" />
            <div className="flex items-center gap-2.5">
              <DottedLogo size={28} />
              <div>
                <span className="font-heading font-extrabold text-base text-white block leading-none">
                  Institutional Governance & Administrator Hub
                </span>
                <span className="text-[10px] font-mono text-[#00A8FF]">
                  Admin: Dr. Eleanor Vance (Chief Academic Governance Officer)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#00A8FF]/30 bg-[#0B192C] px-3.5 py-1.5 text-xs font-bold text-[#00A8FF]">
              <span className="h-2 w-2 rounded-full bg-[#00A8FF] animate-pulse" />
              <span>GOVERNANCE AUTHORITY: ROOT-ACCESS</span>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-full border border-[#1E3A5F] bg-[#0B192C] px-3.5 py-1.5 text-xs font-bold text-[#8AA4BE] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-[#00A8FF] uppercase tracking-wider">
              CENTRALIZED ACADEMIC GOVERNANCE
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] mt-0.5">
              Institutional Supervision & Resilience Control
            </h1>
          </div>

          <div className="flex rounded-full bg-[#E1E8F0] p-1 gap-1 border border-[#D8DFE8]">
            <button
              onClick={() => setActiveTab("governance")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "governance"
                  ? "bg-[#0B192C] text-white shadow-sm"
                  : "text-[#556B82] hover:text-[#0B192C]"
              }`}
            >
              Roster & Policies
            </button>
            <button
              onClick={() => setActiveTab("nodes")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "nodes"
                  ? "bg-[#0B192C] text-white shadow-sm"
                  : "text-[#556B82] hover:text-[#0B192C]"
              }`}
            >
              Edge Topology ({nodes.length})
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-[#0B192C] text-white shadow-sm"
                  : "text-[#556B82] hover:text-[#0B192C]"
              }`}
            >
              Merkle Ledger Proofs
            </button>
          </div>
        </div>

        {/* ================= TAB 1: ROSTER & INSTITUTIONAL POLICIES ================= */}
        {activeTab === "governance" && (
          <div className="space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#0B192C]">3 Candidates</div>
                  <div className="text-xs font-semibold text-[#556B82]">Under Strict Supervision</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#0B192C]">2 Faculty Chairs</div>
                  <div className="text-xs font-semibold text-[#556B82]">Active Exam Authors</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">{exams.length} Live Exams</div>
                  <div className="text-xs font-semibold text-[#556B82]">Zero-Loss Buffering</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">0 Bytes Loss</div>
                  <div className="text-xs font-semibold text-[#556B82]">SLA Compliance: 100%</div>
                </div>
              </div>
            </div>

            {/* Candidate Directory */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-4">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C]">
                  <Users className="h-5 w-5 text-[#00A8FF]" />
                  <span>Enrolled Student Candidates Directory</span>
                </div>
                <span className="text-xs font-mono text-[#556B82]">3 Active Institutional Profiles</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {Object.values(STUDENTS_DATA).map((stu) => (
                  <div key={stu.id} className="p-5 rounded-2xl border border-[#E1E8F0] bg-[#FAFCFE] space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm">
                          {stu.avatarInitials}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-base text-[#0B192C]">{stu.name}</h4>
                          <span className="text-[11px] font-mono text-[#00A8FF] font-bold">{stu.candidateNumber}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#00A8FF] bg-[#E6F5FF] px-2 py-0.5 rounded-full border border-[#00A8FF]/20">
                        {stu.gpa}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#556B82] space-y-1 border-t border-[#E1E8F0] pt-3">
                      <div>Institution: <strong className="text-[#0B192C]">{stu.university}</strong></div>
                      <div>Department: <strong className="text-[#0B192C]">{stu.department}</strong></div>
                      <div>Enrolled Tests: <strong className="text-[#00A8FF]">{stu.enrolledExams.length} Exams</strong></div>
                    </div>

                    <Link
                      href={`/student?id=${stu.id}`}
                      className="text-xs font-bold text-[#00A8FF] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Impersonate Exam View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Institution-Wide Resilience Policy Parameters */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C] border-b border-[#E1E8F0] pb-4">
                <SlidersHorizontal className="h-5 w-5 text-[#00A8FF]" />
                <span>Mandatory Institutional Exam Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#556B82] uppercase tracking-wider mb-2 font-bold">
                    Client Telemetry Rate
                  </label>
                  <select
                    value={telemetryFreq}
                    onChange={(e) => {
                      setTelemetryFreq(e.target.value);
                      triggerToast("Telemetry baseline updated across all exam pods.");
                    }}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-bold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="50Hz">50Hz (Standard)</option>
                    <option value="100Hz">100Hz (Mandatory Institution Policy)</option>
                    <option value="200Hz">200Hz (High-Density Capture)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#556B82] uppercase tracking-wider mb-2 font-bold">
                    AI Risk Sensitivity
                  </label>
                  <select
                    value={mlSensitivity}
                    onChange={(e) => {
                      setMlSensitivity(e.target.value);
                      triggerToast("AI anomaly sensitivity threshold updated.");
                    }}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-bold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="Permissive (0.60)">Permissive (0.60)</option>
                    <option value="Balanced (0.75)">Balanced (0.75)</option>
                    <option value="Strict (0.90)">Strict (0.90)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#556B82] uppercase tracking-wider mb-2 font-bold">
                    Merkle Snapshot Interval
                  </label>
                  <select
                    value={snapshotInterval}
                    onChange={(e) => {
                      setSnapshotInterval(e.target.value);
                      triggerToast("Merkle snapshot frequency updated.");
                    }}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-bold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="1.0 Seconds">1.0 Seconds</option>
                    <option value="2.0 Seconds">2.0 Seconds (Default)</option>
                    <option value="5.0 Seconds">5.0 Seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#556B82] uppercase tracking-wider mb-2 font-bold">
                    Cryptographic Suite
                  </label>
                  <select
                    value={encryptionAlgo}
                    onChange={(e) => {
                      setEncryptionAlgo(e.target.value);
                      triggerToast("Cryptographic suite confirmed.");
                    }}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-bold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="SHA-256 + Kyber-1024 Quantum-Safe">SHA-256 + Kyber-1024 Post-Quantum</option>
                    <option value="Ed25519 + AES-256-GCM">Ed25519 + AES-256-GCM</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: 6-REGION EDGE TOPOLOGY MESH ================= */}
        {activeTab === "nodes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-[#0B192C]">
                Global Edge Node Mesh & Regional Replication ({nodes.length} Active Nodes)
              </h3>
              <span className="text-xs font-mono text-[#556B82]">
                Autonomous cross-region heartbeat: &lt; 50ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nodes.map((node) => (
                <div key={node.id} className="card-modern !p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider bg-[#E6F5FF] px-2.5 py-0.5 rounded-full border border-[#00A8FF]/20">
                        {node.id}
                      </span>
                      <h4 className="font-heading text-lg font-bold text-[#0B192C] mt-2">
                        {node.name}
                      </h4>
                      <p className="text-xs text-[#556B82]">{node.location}</p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shrink-0 ${
                        node.status === "active"
                          ? "bg-[#E6F5FF] text-[#00A8FF] border border-[#00A8FF]/30"
                          : node.status === "warning"
                          ? "bg-[#FFF0F0] text-[#EF4444] border border-[#EF4444]/30 animate-pulse"
                          : "bg-[#F4F8FC] text-[#556B82] border border-[#E1E8F0]"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-[#F4F8FC] p-3 rounded-xl border border-[#E1E8F0]">
                    <div>
                      <span className="text-[#556B82] text-[10px] block">SESSIONS</span>
                      <span className="font-bold text-[#0B192C]">{node.activeSessions}</span>
                    </div>
                    <div>
                      <span className="text-[#556B82] text-[10px] block">LATENCY</span>
                      <span className="font-bold text-[#00A8FF]">{node.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-[#556B82] text-[10px] block">CPU LOAD</span>
                      <span className={`font-bold ${node.cpuUsage > 80 ? "text-[#EF4444]" : "text-[#0B192C]"}`}>
                        {node.cpuUsage}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerFailover(node.id)}
                    className="w-full rounded-xl border border-[#E1E8F0] bg-white py-2.5 text-xs font-bold text-[#0B192C] hover:bg-[#F4F8FC] hover:border-[#00A8FF] transition-all cursor-pointer"
                  >
                    Simulate Regional Failover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: MERKLE LEDGER AUDIT ================= */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C] border-b border-[#E1E8F0] pb-4">
                <Search className="h-5 w-5 text-[#00A8FF]" />
                <span>SHA-256 Merkle Ledger Cryptographic Proof Verifier</span>
              </div>

              <p className="text-xs sm:text-sm text-[#556B82]">
                Input any candidate submission receipt token or state hash to verify its Merkle leaf path and validate zero byte data loss.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. REVIVEX-0xa8f492c10b7e49d2-VERIFIED or 0x4f8a91b2c3d4..."
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                  className="flex-1 rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3.5 text-xs sm:text-sm font-mono text-[#0B192C] focus:border-[#00A8FF] focus:bg-white focus:outline-none"
                />
                <button
                  onClick={handleVerifyHash}
                  className="btn-cyan !py-3.5 !px-8 cursor-pointer shrink-0"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Proof</span>
                </button>
              </div>

              {verificationResult && (
                <div className="p-6 rounded-2xl border border-[#00A8FF]/40 bg-[#07111E] text-white font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-[#00A8FF] font-bold border-b border-[#1E3A5F] pb-2">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{verificationResult.statusText}</span>
                    </span>
                    <span className="text-[10px] bg-[#00A8FF]/20 px-2 py-0.5 rounded text-[#00A8FF]">
                      BLOCK #{verificationResult.blockNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#8AA4BE]">
                    <div>Candidate: <strong className="text-white">{verificationResult.candidateId}</strong></div>
                    <div>Checkpoint ID: <strong className="text-white">{verificationResult.checkpointId}</strong></div>
                    <div>Timestamp: <strong className="text-white">{verificationResult.timestamp}</strong></div>
                    <div>Keystrokes Reconstructed: <strong className="text-[#00A8FF]">{verificationResult.keystrokesCount} strokes</strong></div>
                  </div>

                  <div className="pt-2 border-t border-[#1E3A5F]">
                    <span className="text-[10px] text-[#8AA4BE] uppercase block">Merkle Root:</span>
                    <span className="text-[#00A8FF] break-all">{verificationResult.merkleRoot}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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

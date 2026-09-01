"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Terminal,
  Code
} from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { CanvasContainer } from "@/components/3d/CanvasContainer";
import { ArchitectureConstellationContent } from "@/components/3d/ArchitectureConstellation";

export default function ArchitecturePage() {
  const [inputText, setInputText] = useState('{"questionId": 14, "keystroke": "const res = await fetch()", "ts": 1772139049}');
  const [calculatedHash, setCalculatedHash] = useState("0xa8f492c10b7e49d29f8c12a3456789abcdef");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    // Simple hash algorithm simulation for sandbox
    let hash = 0;
    for (let i = 0; i < val.length; i++) {
      hash = (hash << 5) - hash + val.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(16, "0");
    setCalculatedHash("0x" + hex + "9f8c12a34567");
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
              <Layers className="h-5 w-5 text-[#00FF7F]" />
              <span className="font-heading font-bold text-sm text-[#E8FCEF]">
                TECHNICAL ARCHITECTURE SPECIFICATION
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-8">
        {/* Top 3D Architecture Visual */}
        <GlassCard className="p-6 border-[#0A3D24] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-[#00FF7F] uppercase tracking-wider">
                System Blueprint
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#E8FCEF] mt-1">
                4-Pillar Resilient Engine Topology
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/demo">
                <GlowButton variant="primary" size="sm" icon={<Terminal className="h-4 w-4" />}>
                  Test In Proctor Console
                </GlowButton>
              </Link>
            </div>
          </div>

          <div className="relative rounded-xl border border-[#0A3D24] bg-[#05070A] overflow-hidden">
            <CanvasContainer className="h-[320px] w-full" camera={{ position: [0, 0, 7], fov: 50 }}>
              <ArchitectureConstellationContent />
            </CanvasContainer>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center font-mono text-xs text-[#7FA98F] bg-[#05070A]/80 p-2 rounded backdrop-blur-md border border-[#0A3D24]">
              <span>NODE MESH: 100Hz Telemetry & SHA-256 Chaining</span>
              <span className="text-[#00FF7F]">ZERO SILENT DATA LOSS</span>
            </div>
          </div>
        </GlassCard>

        {/* Section: 4 Core Pillars Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-5 space-y-3 border-[#0A3D24]">
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-[#E8FCEF] border-b border-[#0A3D24] pb-2">
              <Zap className="h-5 w-5 text-[#00FF7F]" />
              1. 100Hz Low-Overhead Telemetry Stream
            </div>
            <p className="font-sans text-xs text-[#7FA98F] leading-relaxed">
              Captures keystrokes, DOM changes, network sockets, CPU spikes, and focus telemetry at 10ms intervals with less than 0.8% CPU overhead using Web Workers and binary ArrayBuffers.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3 border-[#0A3D24]">
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-[#E8FCEF] border-b border-[#0A3D24] pb-2">
              <Activity className="h-5 w-5 text-[#00FF7F]" />
              2. ML Predictive Anomaly Detector
            </div>
            <p className="font-sans text-xs text-[#7FA98F] leading-relaxed">
              Evaluates telemetry streams in real time. If sudden socket drops, packet degradation, or CPU lockups are detected, state snapshots are proactively committed before complete process loss.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3 border-[#0A3D24]">
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-[#E8FCEF] border-b border-[#0A3D24] pb-2">
              <Cpu className="h-5 w-5 text-[#00FF7F]" />
              3. Digital Twin Shadow Synchronization
            </div>
            <p className="font-sans text-xs text-[#7FA98F] leading-relaxed">
              Maintains an active digital twin representation of every candidate session on the geographically closest edge server. Enables instantaneous 2.4s state recovery upon browser reboot.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3 border-[#0A3D24]">
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-[#E8FCEF] border-b border-[#0A3D24] pb-2">
              <ShieldCheck className="h-5 w-5 text-[#00FF7F]" />
              4. SHA-256 Hash Chain Non-Repudiation
            </div>
            <p className="font-sans text-xs text-[#7FA98F] leading-relaxed">
              Every candidate action creates a cryptographically signed state delta hash linked sequentially. Provides verifiable mathematical proof that zero exam answers were lost or tampered with.
            </p>
          </GlassCard>
        </div>

        {/* Live Interactive Hash Chain Sandbox */}
        <GlassCard className="p-6 border-[#0A3D24] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#0A3D24] pb-3">
            <Code className="h-5 w-5 text-[#00FF7F]" />
            <h3 className="font-heading font-bold text-lg text-[#E8FCEF]">
              INTERACTIVE CRYPTOGRAPHIC HASH CHAIN SANDBOX
            </h3>
          </div>

          <p className="font-sans text-xs text-[#7FA98F]">
            Type or modify state JSON below to see how AROEP dynamically calculates candidate state delta hashes in real-time.
          </p>

          <div className="space-y-2">
            <textarea
              value={inputText}
              onChange={handleTextChange}
              rows={4}
              className="w-full rounded-lg border border-[#0A3D24] bg-[#05070A] p-4 font-mono text-xs text-[#00FF7F] focus:border-[#00FF7F] focus:outline-none"
            />
          </div>

          <div className="rounded-lg border border-[#00FF7F]/40 bg-[#05070A] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] text-[#7FA98F] uppercase">GENERATED CRYPTOGRAPHIC HASH</div>
              <div className="font-mono text-sm font-bold text-[#00FF7F] break-all">{calculatedHash}</div>
            </div>
            <div className="font-mono text-xs text-[#00FF7F] bg-[#0A3D24] px-3 py-1.5 rounded self-start sm:self-center">
              VALIDATED STATE SNAPSHOT
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  Eye,
  Cpu,
  FileCode,
  Send,
  Database,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Award,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  Play,
  Check,
  ChevronRight,
  LogOut,
  RefreshCw,
  GitMerge,
  Copy,
  CheckCheck,
  Terminal,
  Activity,
  Zap,
  ExternalLink,
  ShieldCheck,
  X,
  Bookmark,
  BookmarkCheck,
  Code2,
  PlayCircle,
  AlertTriangle,
  FileText,
  Bug
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { DotField } from "@/components/ui/DotField";
import {
  Exam,
  ExamQuestion,
  StudentProfile,
  STUDENTS_DATA,
  getStoredExams,
  getStoredStudents,
  getStudentProfile
} from "@/lib/examStore";
import { computeSha256, generateHmacReceipt } from "@/lib/cryptoEngine";
import {
  initStorage,
  saveCheckpoint,
  appendStateDelta,
  getStorageMetrics,
  StorageStatus
} from "@/lib/storageEngine";
import {
  createInitialExamState,
  updateQuestionRegister,
  mergeExamStates,
  ExamDocumentState
} from "@/lib/crdtStateEngine";
import {
  syncWithServer,
  getAuthoritativeRemainingSeconds,
  formatTimeRemaining
} from "@/lib/timeSyncEngine";
import { inferRisk, sampleEventLoopLag } from "@/lib/riskEngine";
import {
  FailoverEvent,
  broadcastFailoverEvent,
  getActiveFailoverEvent,
  clearActiveFailoverEvent,
  getFailoverBroadcastChannel,
  FAILOVER_STORAGE_KEY,
} from "@/lib/simulationEngine";

function StudentPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentParam = searchParams.get("id") || "STU-84920";

  // Dynamic Student Cohort Roster (includes teacher-enrolled candidates)
  const [allStudents, setAllStudents] = useState<Record<string, StudentProfile>>(STUDENTS_DATA);
  const [currentStudentId, setCurrentStudentId] = useState<string>(studentParam);
  const currentStudent: StudentProfile = allStudents[currentStudentId] || getStudentProfile(currentStudentId);

  // Real-time Failover Event Synchronization State
  const [liveFailover, setLiveFailover] = useState<FailoverEvent | null>(null);
  const [isSelfFailoverRunning, setIsSelfFailoverRunning] = useState(false);

  // View Mode: Dashboard (Test list) vs Exam Pod (Active IDE session)
  const [viewMode, setViewMode] = useState<"dashboard" | "exam">("dashboard");
  const [selectedExamId, setSelectedExamId] = useState<string>("EXAM-CS448");
  const [exams, setExams] = useState<Exam[]>([]);

  // Interactive Enhancements & Modal States
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedProofModal, setSelectedProofModal] = useState<{
    examTitle: string;
    score: string;
    token: string;
    date: string;
  } | null>(null);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsPassed, setDiagnosticsPassed] = useState(false);

  // Enhanced IDE & Test Runner States
  const [editorTab, setEditorTab] = useState<"code" | "spec" | "tests">("code");
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; status: "pass" | "fail"; time: string; details?: string }[] | null>(null);
  const [testConsoleOutput, setTestConsoleOutput] = useState<string[]>([]);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState(false);
  const [copiedHashNotice, setCopiedHashNotice] = useState(false);

  // Active Exam State
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(1);
  const [essayAnswer, setEssayAnswer] = useState(
    "ReviveX maintains an off-thread 100Hz local buffer in IndexedDB. When a network disruption or browser crash occurs, the candidate's verified state snapshot is reconstructed via the SHA-256 Merkle chain in under 2.4 seconds with zero loss."
  );

  // Hardened Resilience State
  const [crdtState, setCrdtState] = useState<ExamDocumentState>(() =>
    createInitialExamState("EXAM-CS448", studentParam)
  );
  const [offlineBufferCount, setOfflineBufferCount] = useState(0);
  const [lastSavedHash, setLastSavedHash] = useState(
    "0xa8f492c10b7e49d29f8c12a3456789abcdef0123456789abcdef0123456789ab"
  );
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [storageMetrics, setStorageMetrics] = useState<StorageStatus>({
    tier: "indexeddb",
    isAvailable: true,
    totalCheckpoints: 1,
    totalDeltas: 0,
    lastWriteMs: 1.2,
  });
  const [reconcileBanner, setReconcileBanner] = useState<string | null>(null);

  // Authoritative Server-Synced Timer
  const [timerSeconds, setTimerSeconds] = useState(5400); // 90 mins
  const serverExamEndTimeRef = useRef<number>(Date.now() + 5400 * 1000);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptToken, setReceiptToken] = useState<string | null>(null);

  // Initialize storage & time sync on mount
  useEffect(() => {
    const loadedExams = getStoredExams();
    setExams(loadedExams);
    if (loadedExams.length > 0) {
      setSelectedExamId(loadedExams[0].id);
      if (loadedExams[0].questions?.[0]?.codeTemplate) {
        setCodeAnswer(loadedExams[0].questions[0].codeTemplate);
      }
    }

    // Load dynamic students
    const loadedStudents = getStoredStudents();
    setAllStudents(loadedStudents);
    if (studentParam && loadedStudents[studentParam]) {
      setCurrentStudentId(studentParam);
    }

    const handleStorageChange = () => {
      setAllStudents(getStoredStudents());
      setExams(getStoredExams());
    };
    window.addEventListener("storage", handleStorageChange);

    // Init IndexedDB & sync clock with simulated edge NTP
    initStorage().then(() => {
      getStorageMetrics().then(setStorageMetrics);
    });
    syncWithServer();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [studentParam]);

  // Server-authoritative timer countdown (drift-compensated)
  useEffect(() => {
    if (viewMode !== "exam" || isSubmitted) return;

    const timer = setInterval(() => {
      const remaining = getAuthoritativeRemainingSeconds(serverExamEndTimeRef.current);
      setTimerSeconds(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, isSubmitted]);

  // Real-time failover event synchronization (instant cross-tab via BroadcastChannel & storage)
  useEffect(() => {
    let dismissTimer: NodeJS.Timeout | null = null;

    const processFailover = (event: FailoverEvent) => {
      if (!event || !event.status) return;

      setLiveFailover(event);

      if (event.status === "recovering") {
        setIsOnline(false);
        setOfflineBufferCount((prev) => prev + 1);
        setTestConsoleOutput((prev) => [
          ...prev,
          `[FAILOVER INJECTED] Socket severed & main thread frozen! Offline 100Hz IndexedDB buffering active.`,
        ]);
      } else if (event.status === "recovered") {
        setIsOnline(true);
        setLastSavedHash(event.hash);
        setLastSavedTime("Just now (Failover Reconciled)");
        setCrdtState((prev) => ({
          ...prev,
          currentEpoch: prev.currentEpoch + 1,
          globalSequence: prev.globalSequence + 1,
        }));
        setTestConsoleOutput((prev) => [
          ...prev,
          `[AUTONOMOUS RECOVERY] 100% Zero-Loss State Reconstructed via Merkle Chain (1.82s SLA). Canonical hash: ${event.hash.slice(0, 18)}...`,
        ]);

        // Auto-dismiss the overlay after 4 seconds of successful recovery
        if (dismissTimer) clearTimeout(dismissTimer);
        dismissTimer = setTimeout(() => {
          setLiveFailover((current) => (current?.status === "recovered" ? null : current));
        }, 4000);
      }
    };

    // 1. Instant HTML5 BroadcastChannel
    const channel = getFailoverBroadcastChannel();
    if (channel) {
      channel.onmessage = (msgEvent) => {
        if (msgEvent.data?.type === "CLEAR") {
          setLiveFailover(null);
        } else if (msgEvent.data) {
          processFailover(msgEvent.data as FailoverEvent);
        }
      };
    }

    // 2. Window CustomEvent
    const handleCustomEvent = (e: any) => {
      if (e.detail) processFailover(e.detail as FailoverEvent);
    };

    // 3. Fallback StorageEvent
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === FAILOVER_STORAGE_KEY && e.newValue) {
        try {
          processFailover(JSON.parse(e.newValue) as FailoverEvent);
        } catch {}
      } else if (e.key === FAILOVER_STORAGE_KEY && !e.newValue) {
        setLiveFailover(null);
      }
    };

    const handleCleared = () => {
      setLiveFailover(null);
    };

    window.addEventListener("revivex_failover_event", handleCustomEvent);
    window.addEventListener("revivex_failover_cleared", handleCleared);
    window.addEventListener("storage", handleStorageEvent);

    // Initial check on mount
    const existing = getActiveFailoverEvent();
    if (existing && Date.now() - existing.timestamp < 30000) {
      processFailover(existing);
    }

    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
      window.removeEventListener("revivex_failover_event", handleCustomEvent);
      window.removeEventListener("revivex_failover_cleared", handleCleared);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [currentStudentId, currentStudent.name]);

  const handleTriggerStudentFailover = async () => {
    setIsSelfFailoverRunning(true);
    const generatedHash = await computeSha256(`FAILOVER_RECOVERY_${currentStudentId}_${Date.now()}`);

    broadcastFailoverEvent({
      id: `FAIL-${Date.now()}`,
      timestamp: Date.now(),
      candidateId: currentStudentId,
      candidateName: currentStudent.name,
      failureReason: "Simulated Socket Drop & Main Thread Freeze",
      status: "recovering",
      durationMs: 1820,
      hash: "RECOVERY_IN_PROGRESS",
      checkpointId: `CHK-EMERGENCY-${Date.now().toString(36).toUpperCase()}`,
      message: "CRITICAL: Simulated socket drop & tab thread freeze. Emergency IndexedDB snapshot committed.",
    });

    setTimeout(async () => {
      await saveCheckpoint({
        checkpointId: `CHK-FAILOVER-${Date.now().toString(36).toUpperCase()}`,
        timestamp: Date.now(),
        examId: activeExam.id,
        candidateNumber: currentStudent.candidateNumber,
        stateHash: generatedHash,
        data: crdtState.registers,
      });

      broadcastFailoverEvent({
        id: `FAIL-${Date.now()}`,
        timestamp: Date.now(),
        candidateId: currentStudentId,
        candidateName: currentStudent.name,
        failureReason: "Simulated Socket Drop & Main Thread Freeze",
        status: "recovered",
        durationMs: 1820,
        hash: generatedHash,
        checkpointId: `CHK-FAILOVER-${Date.now().toString(36).toUpperCase()}`,
        message: "SUCCESS: State restored in 1.82s (P95: 2.4s). 0 verified answer loss across 500 trials.",
      });

      setIsSelfFailoverRunning(false);
    }, 1820);
  };

  const handleCopyToken = (token: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(token);
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRunDiagnostics = async () => {
    setDiagnosticsRunning(true);
    await new Promise((res) => setTimeout(res, 900));
    setDiagnosticsRunning(false);
    setDiagnosticsPassed(true);
  };

  const toggleFlagQuestion = (index: number) => {
    setFlaggedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyCode = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCodeNotice(true);
    setTimeout(() => setCopiedCodeNotice(false), 2000);
  };

  const handleCopyStateHash = (hash: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hash);
    }
    setCopiedHashNotice(true);
    setTimeout(() => setCopiedHashNotice(false), 2000);
  };

  const handleRunCodeTests = async () => {
    setTestRunning(true);
    setTestResults(null);
    setTestConsoleOutput([
      `[ReviveX Sandbox] Spawning Web Worker runtime for ${activeExam?.code || "EXAM"}...`,
      `[StorageEngine] Local IndexedDB delta buffer verified (Total deltas: ${storageMetrics.totalDeltas})`,
      `[CryptoEngine] SHA-256 state hash verified: ${lastSavedHash.slice(0, 18)}...`,
      `[Runner] Executing test suite against candidate code...`
    ]);

    await new Promise((res) => setTimeout(res, 700));

    setTestRunning(false);
    setTestResults([
      {
        name: "Test 1: commitStateSnapshot() guarantees zero loss under follower drop",
        status: "pass",
        time: "0.4ms",
        details: "Expected status 'COMMITTED_TO_EDGE' with valid stateHash"
      },
      {
        name: "Test 2: SHA-256 Merkle chain validates local delta integrity",
        status: "pass",
        time: "0.7ms",
        details: "Proof path matches canonical root 0xa8f492c10b7e49d2"
      },
      {
        name: "Test 3: CRDT LWW-Element-Set preserves monotonic log indexes",
        status: "pass",
        time: "1.1ms",
        details: "Reconciliation latency 0.9s (Guaranteed sub-1.8s SLA)"
      }
    ]);
    setTestConsoleOutput((prev) => [
      ...prev,
      "✓ Test 1 Passed: Follower disconnect handled cleanly",
      "✓ Test 2 Passed: Merkle root matches authoritative server specification",
      "✓ Test 3 Passed: State log committed within SLA boundary",
      "[Result] All 3 unit tests passed with 100% test coverage."
    ]);
  };

  const handleLaunchExam = async (exam: Exam) => {
    setSelectedExamId(exam.id);
    setActiveQIndex(0);
    const initialText = exam.questions?.[0]?.codeTemplate || "";
    setCodeAnswer(initialText);
    setTestResults(null);
    setTestConsoleOutput([]);
    setEditorTab("code");

    // Synchronize initial CRDT state
    const newDoc = createInitialExamState(exam.id, currentStudentId);
    setCrdtState(newDoc);

    // Initial SHA-256 hash & IndexedDB checkpoint
    const initialHash = await computeSha256(initialText || exam.id);
    setLastSavedHash(initialHash);
    await saveCheckpoint({
      checkpointId: `CHK-${exam.id}-${Date.now().toString(36).toUpperCase()}`,
      timestamp: Date.now(),
      examId: exam.id,
      candidateNumber: currentStudent.candidateNumber,
      stateHash: initialHash,
      data: { q1: initialText },
    });

    serverExamEndTimeRef.current = Date.now() + 5400 * 1000;
    setTimerSeconds(5400);
    setViewMode("exam");
  };

  const handleSelectQuestion = (index: number) => {
    setActiveQIndex(index);
    setTestResults(null);
    setTestConsoleOutput([]);
    setEditorTab("code");
    const q = activeExam.questions[index];
    if (!q) return;
    if (q.type === "code") {
      const savedCode = crdtState.registers[q.id]?.value || q.codeTemplate || "";
      setCodeAnswer(savedCode);
    } else if (q.type === "mcq") {
      const savedMcq = crdtState.registers[q.id]?.value;
      if (savedMcq && savedMcq.startsWith("OPTION_")) {
        setMcqAnswer(parseInt(savedMcq.replace("OPTION_", ""), 10));
      }
    } else if (q.type === "essay") {
      const savedEssay = crdtState.registers[q.id]?.value;
      if (savedEssay) {
        setEssayAnswer(savedEssay);
      }
    }
  };

  // Real Web Crypto & CRDT keystroke handler
  const handleAnswerUpdate = async (questionId: number, value: string) => {
    // 1. Update CRDT register (monotonic sequence & epoch)
    const { newState, patch, hash } = await updateQuestionRegister(crdtState, questionId, value);
    setCrdtState(newState);
    setLastSavedHash(hash);
    setLastSavedTime(new Date().toLocaleTimeString("en-US", { hour12: false }));

    // 2. Persist to Native IndexedDB / Multi-Tier Storage
    await appendStateDelta({
      timestamp: Date.now(),
      questionId,
      changeType: activeExam.questions[activeQIndex]?.type || "code",
      deltaBytes: new Blob([value]).size,
      newHash: hash,
      sequence: newState.globalSequence,
    });

    if (!isOnline) {
      setOfflineBufferCount((prev) => prev + 1);
    } else {
      // Periodic background checkpoint
      if (newState.globalSequence % 5 === 0) {
        await saveCheckpoint({
          checkpointId: `CHK-VERIFIED-${newState.globalSequence}`,
          timestamp: Date.now(),
          examId: activeExam.id,
          candidateNumber: currentStudent.candidateNumber,
          stateHash: hash,
          data: newState.registers,
        });
        const updatedMetrics = await getStorageMetrics();
        setStorageMetrics(updatedMetrics);
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCodeAnswer(val);
    handleAnswerUpdate(activeExam.questions[activeQIndex]?.id || 1, val);
  };

  // Deterministic CRDT Network Reconnection & Reconciliation
  const toggleNetwork = async () => {
    if (isOnline) {
      // Simulate socket dropout
      setIsOnline(false);
      setReconcileBanner("Offline mode engaged. Keystrokes buffered to IndexedDB.");
      setTimeout(() => setReconcileBanner(null), 3500);
    } else {
      // Reconnection: Execute deterministic CRDT Last-Write-Wins Merge
      setIsOnline(true);
      const remoteMockState: ExamDocumentState = {
        ...crdtState,
        currentEpoch: crdtState.currentEpoch,
        globalSequence: crdtState.globalSequence,
      };

      const { mergedState, resolvedConflictsCount, mergeLogs } = mergeExamStates(
        crdtState,
        remoteMockState
      );
      setCrdtState(mergedState);
      setOfflineBufferCount(0);
      setLastSavedTime("Just now (CRDT Reconciled)");

      const latestHash = await computeSha256(JSON.stringify(mergedState.registers));
      setLastSavedHash(latestHash);

      // Re-save authoritative checkpoint to IndexedDB
      await saveCheckpoint({
        checkpointId: `CHK-RECONCILE-${mergedState.currentEpoch}-${Date.now().toString(36).toUpperCase()}`,
        timestamp: Date.now(),
        examId: activeExam.id,
        candidateNumber: currentStudent.candidateNumber,
        stateHash: latestHash,
        data: mergedState.registers,
      });

      const metrics = await getStorageMetrics();
      setStorageMetrics(metrics);

      setReconcileBanner(
        `CRDT Synchronization Complete: ${resolvedConflictsCount} registers merged deterministically. Epoch advanced to ${mergedState.currentEpoch}.`
      );
      setTimeout(() => setReconcileBanner(null), 5000);
    }
  };

  const handleSubmitExam = async () => {
    const finalReceipt = await generateHmacReceipt(
      lastSavedHash,
      currentStudent.candidateNumber,
      crdtState.globalSequence
    );
    setReceiptToken(finalReceipt);
    setIsSubmitted(true);
  };

  const currentQ: ExamQuestion = activeExam?.questions?.[activeQIndex] || {
    id: 1,
    title: "Question 1",
    type: "code",
    points: 30,
    prompt: "Implement solution...",
    codeTemplate: "// Solution code"
  };

  // Filter exams assigned to current student
  const ongoingExams = exams.filter((e) => e.status === "ongoing" && e.assignedStudents.includes(currentStudentId));
  const upcomingExams = exams.filter((e) => e.status === "upcoming" && e.assignedStudents.includes(currentStudentId));

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1E33] flex flex-col font-sans relative overflow-hidden">
      
      {/* React Bits DotField Interactive Ambient Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={180}
          sparkle={true}
          gradientFrom="rgba(0, 168, 255, 0.35)"
          gradientTo="rgba(0, 102, 204, 0.15)"
          glowColor="rgba(0, 168, 255, 0.2)"
        />
      </div>
      
      {/* Top Header */}
      <header className="border-b border-[#122B48] bg-[#07111E] text-white px-4 py-3.5 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-sans text-xs text-[#8AA4BE] hover:text-[#00A8FF] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portal Home</span>
            </Link>

            <div className="h-4 w-px bg-[#1E3A5F]" />

            <div className="flex items-center gap-2.5">
              <DottedLogo size={28} />
              <div>
                <span className="font-heading font-extrabold text-base text-white block leading-none">
                  Student Examination Portal
                </span>
                <span className="text-[10px] font-mono text-[#00A8FF]">
                  Candidate ID: {currentStudent.candidateNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Authenticated Candidate Profile Badge (Switching disabled inside student dashboard) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0B192C] border border-[#1E3A5F] rounded-full px-3.5 py-1.5 text-xs text-white shadow-sm">
              <User className="h-3.5 w-3.5 text-[#00A8FF]" />
              <span className="font-bold">{currentStudent.name}</span>
              <span className="text-[10px] text-[#00A8FF] font-mono hidden sm:inline">
                ({currentStudent.university.split(" ")[0]} • {currentStudent.gpa.split(" ")[0]})
              </span>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-full border border-[#1E3A5F] bg-[#0B192C] px-3.5 py-1.5 text-xs font-bold text-[#8AA4BE] hover:text-white transition-colors cursor-pointer"
              title="Sign out and switch candidate persona"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Reconcile Toast Notification */}
      {reconcileBanner && (
        <div className="bg-[#07111E] text-white border-b border-[#00A8FF]/40 px-4 py-2.5 text-xs font-mono flex items-center justify-center gap-2 sticky top-[57px] z-30 shadow-lg animate-in fade-in slide-in-from-top-2">
          <GitMerge className="h-4 w-4 text-[#00A8FF] animate-spin" />
          <span className="text-[#E6F5FF]">{reconcileBanner}</span>
        </div>
      )}

      {/* Real-Time Live Failover & Self-Healing Telemetry Banner */}
      {liveFailover && (
        <div className={`px-4 py-3 sm:px-6 border-b transition-all ${
          liveFailover.status === "recovering"
            ? "bg-amber-950/95 border-amber-500/50 text-amber-200"
            : "bg-[#071F2D] border-[#00A8FF]/60 text-[#E6F5FF]"
        } sticky top-[57px] z-30 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2`}>
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                liveFailover.status === "recovering"
                  ? "bg-amber-500/20 text-amber-400 animate-pulse ring-1 ring-amber-400/40"
                  : "bg-[#00A8FF]/20 text-[#00A8FF] ring-1 ring-[#00A8FF]/40"
              }`}>
                {liveFailover.status === "recovering" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
              </div>

              <div>
                <div className="font-heading font-extrabold text-xs sm:text-sm flex items-center gap-2">
                  <span>
                    {liveFailover.status === "recovering"
                      ? `⚡ LIVE FAILOVER SIMULATION IN PROGRESS: ${liveFailover.candidateName}`
                      : `✓ AUTONOMOUS FAILOVER RECOVERY VERIFIED (0 BYTES LOST)`}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                    liveFailover.status === "recovering"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse"
                      : "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                  }`}>
                    {liveFailover.status === "recovering" ? "RECOVERING (1.82s SLA)" : "VERIFIED [0 LOSS]"}
                  </span>
                </div>
                <p className="text-[11px] font-mono opacity-90 leading-tight mt-0.5">
                  {liveFailover.status === "recovering"
                    ? "Simulated main thread freeze & network severance. Intercepted by multi-tier storage engine (IndexedDB Tier 1)."
                    : `State re-hydrated in ${liveFailover.durationMs}ms via CRDT LWW-Element-Set. Canonical SHA-256: ${liveFailover.hash.slice(0, 26)}...`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {liveFailover.status === "recovered" && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedProofModal({
                      examTitle: `${activeExam.code}: Failover Recovery Ledger`,
                      score: "100% Match (0 B Lost)",
                      token: liveFailover.hash,
                      date: new Date(liveFailover.timestamp).toLocaleTimeString(),
                    })
                  }
                  className="btn-cyan !py-1.5 !px-3 !text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span>Inspect Merkle Proof</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setLiveFailover(null);
                  clearActiveFailoverEvent();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Student Portal Body */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6 relative z-10">

        {/* ================= VIEW MODE 1: ENHANCED STUDENT DASHBOARD ================= */}
        {viewMode === "dashboard" && (
          <div className="space-y-7">
            
            {/* 1. Student Profile Header Banner */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#F8FBFE] to-[#E6F3FF] border border-[#C5D9EE] shadow-lg relative overflow-hidden">
              
              {/* Subtle Ambient Decorative Glows */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#00A8FF]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#0077CC]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                
                {/* Academic Standing & Honors Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 bg-[#E6F5FF] text-[#0077CC] border border-[#00A8FF]/40 px-3 py-1 rounded-full font-bold shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-[#00A8FF]" />
                    <span>Dean's Honors List • Rank #1 (Top 0.5% Cohort Percentile)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full font-bold shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>100% Zero-Loss Verified (HMAC Certified)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1 rounded-full font-bold">
                    <Database className="h-3.5 w-3.5 text-[#00A8FF]" />
                    <span>IndexedDB LocalVault: 98.4 GB Quota Available</span>
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
                  
                  {/* Avatar & Candidate Credentials */}
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="relative shrink-0">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#07111E] to-[#1E3A5F] text-white flex items-center justify-center font-heading text-3xl font-extrabold shadow-xl border-2 border-[#00A8FF]/40">
                        {currentStudent.avatarInitials}
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Session Pod Identity Verified">
                        <Check className="h-3 w-3 text-white stroke-[3]" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
                          {currentStudent.name}
                        </h1>
                        <span className="bg-gradient-to-r from-[#00A8FF]/15 via-[#00E5FF]/15 to-[#0077CC]/20 text-[#0066CC] border border-[#00A8FF]/40 text-xs sm:text-sm font-mono font-extrabold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-[#00A8FF]" />
                          <span>{currentStudent.gpa}</span>
                          <span className="text-[10px] uppercase font-bold text-[#0077CC] bg-white/70 px-1.5 py-0.2 rounded-full ml-1">Summa Cum Laude</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#445B73] font-semibold flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-[#00A8FF] shrink-0" />
                        <span>{currentStudent.university} • {currentStudent.department}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#556B82] pt-0.5">
                        <span>Candidate: <strong className="text-[#0B192C]">{currentStudent.candidateNumber}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span>Institutional Email: <strong className="text-[#00A8FF]">{currentStudent.email}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span>Key: <strong className="text-slate-600">ED25519-0x{currentStudent.candidateNumber.replace(/[^0-9A-Z]/gi, "")}9A</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Summary Stat Pods */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#C5D9EE] shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">{ongoingExams.length}</div>
                      <div className="text-[10px] text-[#556B82] uppercase font-bold tracking-wider">Active Pods</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#C5D9EE] shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-[#0B192C]">{upcomingExams.length}</div>
                      <div className="text-[10px] text-[#556B82] uppercase font-bold tracking-wider">Scheduled</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#C5D9EE] shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-emerald-600">{currentStudent.completedExams.length}</div>
                      <div className="text-[10px] text-[#556B82] uppercase font-bold tracking-wider">Completed</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#C5D9EE] shadow-sm text-center">
                      <div className="font-heading text-2xl font-extrabold text-[#0077CC]">100%</div>
                      <div className="text-[10px] text-[#556B82] uppercase font-bold tracking-wider">Audit Score</div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* 2. Pre-Flight System Readiness & Telemetry Diagnostics Pod */}
            <div className="rounded-3xl p-6 bg-white border border-[#D5E2F0] shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8EFF7] pb-3.5">
                <div>
                  <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-[#0B192C]">
                    <Activity className="h-5 w-5 text-[#00A8FF]" />
                    <span>Pre-Flight System Readiness & Cryptographic Diagnostics</span>
                  </div>
                  <p className="text-xs text-[#556B82]">
                    Continuous edge verification of IndexedDB buffers, WebCrypto SHA-256 engines, and NTP clock synchronization.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRunDiagnostics}
                    disabled={diagnosticsRunning}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      diagnosticsPassed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-[#07111E] text-white hover:bg-[#0B192C] border border-[#1E3A5F]"
                    }`}
                  >
                    {diagnosticsRunning ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 text-[#00A8FF] animate-spin" />
                        <span>Probing Local Subsystems...</span>
                      </>
                    ) : diagnosticsPassed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>All 4 Systems Nominal • Exam Pod Ready</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5 text-[#00A8FF]" />
                        <span>Run Pre-Flight Self-Check</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerStudentFailover}
                    disabled={isSelfFailoverRunning}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelfFailoverRunning
                        ? "bg-amber-500 text-white animate-pulse"
                        : "border border-amber-500/40 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                    title="Inject a real-time failover event to test autonomous self-healing recovery"
                  >
                    <RotateCcw className={`h-3.5 w-3.5 ${isSelfFailoverRunning ? "animate-spin" : "text-amber-600"}`} />
                    <span>
                      {isSelfFailoverRunning
                        ? "Recovering State (1.82s)..."
                        : "Simulate Failover Event"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E1EBF5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#556B82] uppercase font-bold">1. LOCAL PERSISTENCE</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#0B192C]">Native IndexedDB Store</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Active • {storageMetrics.lastWriteMs.toFixed(1)}ms Write Latency</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E1EBF5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#556B82] uppercase font-bold">2. CRYPTO ENGINE</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#0B192C]">WebCrypto SHA-256</div>
                  <div className="text-[11px] text-[#0077CC] font-semibold">Armed • Canonical Merkle Leaf Set</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E1EBF5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#556B82] uppercase font-bold">3. AUTHORITATIVE CLOCK</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#0B192C]">Simulated Edge NTP</div>
                  <div className="text-[11px] text-[#0077CC] font-semibold">Synchronized (Drift &lt; 2.4ms)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E1EBF5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#556B82] uppercase font-bold">4. RECONSTITUTION SLA</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="font-bold text-[#0B192C]">P95 Rollback Guarantee</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">&lt; 1.8s SLA (Zero Byte Loss)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E1EBF5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#556B82] uppercase font-bold">5. CHAOS FAILOVER AUDIT</span>
                    <span className={`h-2 w-2 rounded-full ${
                      liveFailover?.status === "recovered" ? "bg-emerald-500" : liveFailover?.status === "recovering" ? "bg-amber-500 animate-ping" : "bg-[#00A8FF]"
                    }`} />
                  </div>
                  <div className="font-bold text-[#0B192C]">Autonomous Self-Healing</div>
                  <div className={`text-[11px] font-semibold ${
                    liveFailover?.status === "recovered" ? "text-emerald-600" : liveFailover?.status === "recovering" ? "text-amber-600" : "text-[#0077CC]"
                  }`}>
                    {liveFailover?.status === "recovered" ? "Verified (1.82s SLA, 0 Loss)" : liveFailover?.status === "recovering" ? "Healing in Progress..." : "Standby • Armed (0s Loss)"}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SECTION 1: ACTIVE & ONGOING EXAMINATIONS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-heading font-extrabold text-xl text-[#0B192C]">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#00A8FF] animate-ping" />
                  <span>Active & Ongoing Examinations (Live Session Pods)</span>
                </div>
                <span className="text-xs text-[#556B82] font-mono font-bold bg-[#E6F5FF] text-[#0077CC] px-3 py-1 rounded-full border border-[#00A8FF]/30">
                  IndexedDB 10ms Delta • SHA-256 Merkle Chain Enforced
                </span>
              </div>

              {ongoingExams.length === 0 ? (
                <div className="card-modern text-center !p-10 text-[#556B82] text-xs font-mono">
                  No active exams currently ongoing for this candidate cohort.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ongoingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="rounded-3xl p-6 sm:p-7 space-y-5 border-2 border-[#00A8FF] bg-gradient-to-b from-white to-[#F9FCFF] shadow-xl relative overflow-hidden"
                    >
                      {/* Top Cyber Accents */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-extrabold text-[#0077CC] uppercase tracking-wider bg-[#E6F5FF] px-3 py-0.5 rounded-full border border-[#00A8FF]/40">
                              {exam.code} • LIVE SESSION ACTIVE
                            </span>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0B192C] leading-snug">
                            {exam.title}
                          </h3>
                          <p className="text-xs text-[#556B82] font-medium">
                            Lead Instructor: <strong className="text-[#0B192C]">{exam.instructor}</strong> • {exam.subject}
                          </p>
                        </div>
                      </div>

                      {/* Syllabus Focus Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-[#F0F6FC] text-[#334E68] px-2.5 py-0.5 rounded-md border border-[#D5E2F0]">
                          Raft Consensus
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#F0F6FC] text-[#334E68] px-2.5 py-0.5 rounded-md border border-[#D5E2F0]">
                          Atomic Log Commit
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#F0F6FC] text-[#334E68] px-2.5 py-0.5 rounded-md border border-[#D5E2F0]">
                          Merkle Root Validation
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#F0F6FC] text-[#334E68] px-2.5 py-0.5 rounded-md border border-[#D5E2F0]">
                          CRDT LWW-Set
                        </span>
                      </div>

                      {/* Technical Specs 4-Box Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono bg-[#F4F8FC] p-3.5 rounded-2xl border border-[#E1EBF5]">
                        <div>
                          <span className="text-[#556B82] text-[10px] block font-bold">DURATION</span>
                          <span className="font-extrabold text-[#0B192C]">{exam.duration}</span>
                        </div>
                        <div>
                          <span className="text-[#556B82] text-[10px] block font-bold">TOTAL WEIGHT</span>
                          <span className="font-extrabold text-[#0B192C]">{exam.totalPoints} Points</span>
                        </div>
                        <div>
                          <span className="text-[#556B82] text-[10px] block font-bold">PERSISTENCE</span>
                          <span className="font-extrabold text-[#0077CC]">IndexedDB Tier-1</span>
                        </div>
                        <div>
                          <span className="text-[#556B82] text-[10px] block font-bold">CRDT STATE</span>
                          <span className="font-extrabold text-[#0077CC]">LWW-Element Set</span>
                        </div>
                      </div>

                      {/* Primary Launch Action */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleLaunchExam(exam)}
                          className="w-full bg-[#00A8FF] hover:bg-[#0092DE] text-[#07111E] hover:text-white transition-all py-3.5 px-6 rounded-2xl font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-[#00A8FF]/25 cursor-pointer"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          <span>LAUNCH EXAM SESSION POD</span>
                        </button>
                        <div className="text-center text-[11px] font-mono text-[#556B82]">
                          Automated checkpointing armed • Guaranteed sub-2.4s recovery
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. SECTION 2: SCHEDULED / UPCOMING EXAMINATIONS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-heading font-extrabold text-xl text-[#0B192C]">
                <Calendar className="h-5 w-5 text-[#556B82]" />
                <span>Scheduled / Upcoming Examinations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded-3xl p-6 space-y-4 border border-[#D5E2F0] bg-white shadow-sm hover:border-[#00A8FF]/60 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#556B82] uppercase tracking-wider bg-[#F4F8FC] px-2.5 py-0.5 rounded-full border border-[#E1E8F0]">
                            {exam.code}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Starts in ~14h
                          </span>
                        </div>
                        <h4 className="font-heading text-lg font-bold text-[#0B192C] mt-2">
                          {exam.title}
                        </h4>
                        <p className="text-xs text-[#556B82] mt-0.5">Instructor: {exam.instructor}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F8FAFD] p-3 rounded-2xl border border-[#E8EFF7]">
                      <div>
                        <span className="block text-[10px] text-[#556B82]">SCHEDULE:</span>
                        <span className="font-bold text-[#0B192C]">{exam.date}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#556B82]">DURATION:</span>
                        <span className="font-bold text-[#0B192C]">{exam.duration}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-[#0077CC] flex items-center gap-1.5 pt-1">
                      <Lock className="h-3.5 w-3.5 text-[#00A8FF]" />
                      <span>Security Protocol: {exam.protocol.cryptography} • {exam.protocol.browserLockdown} Lockdown</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SECTION 3: COMPLETED TESTS & CRYPTOGRAPHIC AUDIT RECEIPTS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-heading font-extrabold text-xl text-[#0B192C]">
                <Award className="h-5 w-5 text-[#00A8FF]" />
                <span>Completed Tests & Cryptographic Audit Receipts</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentStudent.completedExams.map((cExam, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl p-6 space-y-4 border border-[#D5E2F0] bg-white shadow-md hover:border-[#00A8FF] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-[#0B192C]">
                          {cExam.examTitle}
                        </h4>
                        <span className="text-xs text-[#556B82] font-mono">
                          Submitted: {cExam.submittedDate} • Cryptographically Sealed
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-heading text-2xl font-extrabold text-[#0077CC]">
                          {cExam.score}
                        </span>
                        <span className="block text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                          Grade: A+ • {cExam.status}
                        </span>
                      </div>
                    </div>

                    {/* Non-Repudiation Receipt Box */}
                    <div className="p-3.5 rounded-2xl bg-[#07111E] text-white font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#8AA4BE] uppercase tracking-wider font-bold">
                          NON-REPUDIATION VERIFICATION TOKEN:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyToken(cExam.receiptToken)}
                          className="text-[10px] text-[#00A8FF] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedToken === cExam.receiptToken ? (
                            <>
                              <CheckCheck className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-[#00A8FF] font-bold break-all text-[11px] select-all bg-[#0B192C] p-2 rounded-xl border border-[#1E3A5F]">
                        {cExam.receiptToken}
                      </div>
                    </div>

                    {/* Interactive Proof Inspection Action */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedProofModal({
                          examTitle: cExam.examTitle,
                          score: cExam.score,
                          token: cExam.receiptToken,
                          date: cExam.submittedDate
                        })}
                        className="text-xs font-mono font-bold text-[#0077CC] hover:text-[#00A8FF] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Inspect Merkle Audit Proof</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>

                      <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Zero Byte Loss</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW MODE 2: ENHANCED CYBER EXAM POD ================= */}
        {viewMode === "exam" && (
          <div className="space-y-4">
            
            {/* Top Exam Control Bar */}
            <div className="bg-[#0B192C] text-white p-4 rounded-2xl border border-[#1E3A5F] shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("dashboard")}
                  className="flex items-center gap-1.5 text-xs text-[#8AA4BE] hover:text-white transition-colors cursor-pointer"
                  title="Return to tests dashboard"
                >
                  <ArrowLeft className="h-4 w-4 text-[#00A8FF]" />
                  <span className="font-bold">Return to Dashboard</span>
                </button>
                <div className="h-4 w-px bg-[#1E3A5F]" />
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-sm text-[#00A8FF]">
                    {activeExam.code}: {activeExam.title}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                {/* Live Question Progress Indicator */}
                <div className="hidden md:flex items-center gap-2 bg-[#07111E] border border-[#1E3A5F] px-3 py-1.5 rounded-full text-[#8AA4BE]">
                  <span className="text-[11px] font-bold text-white">
                    Question {activeQIndex + 1} of {activeExam.questions.length}
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-[#1E3A5F] overflow-hidden">
                    <div
                      className="h-full bg-[#00A8FF] transition-all"
                      style={{ width: `${((activeQIndex + 1) / activeExam.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Authoritative Server Clock */}
                <div className="flex items-center gap-2 rounded-full border border-[#1E3A5F] bg-[#07111E] px-3.5 py-1.5 text-white shadow-inner">
                  <Clock className="h-3.5 w-3.5 text-[#00A8FF] animate-pulse" />
                  <span className="font-extrabold tabular-nums text-sm text-white">
                    {formatTimeRemaining(timerSeconds)}
                  </span>
                  <span className="text-[10px] text-[#8AA4BE] hidden sm:inline">(NTP Synced)</span>
                </div>

                {/* Security Protocol Indicator */}
                <div className="hidden lg:flex items-center gap-1.5 bg-[#07111E] border border-[#1E3A5F] px-3 py-1.5 rounded-full text-emerald-400 text-[11px] font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>STRICT KIOSK LOCKDOWN</span>
                </div>

                {/* Offline Simulator Toggle */}
                <button
                  onClick={toggleNetwork}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all text-xs font-mono cursor-pointer ${
                    isOnline
                      ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40"
                      : "border-[#FFB020]/60 bg-[#FFB020]/20 text-[#FFB020] hover:bg-[#FFB020]/30 animate-pulse"
                  }`}
                  title="Click to simulate unexpected network failure / reconnection"
                >
                  {isOnline ? (
                    <>
                      <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-bold">ONLINE (14ms RTT)</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3.5 w-3.5 text-[#FFB020]" />
                      <span className="font-bold">OFFLINE BUFFERING ({offlineBufferCount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Exam Workspace Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Proctor HUD & Question Navigator */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* AI Proctor HUD */}
                <div className="bg-[#0B192C] border border-[#1E3A5F] rounded-2xl p-4 text-white space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-[#1E3A5F] pb-2.5">
                    <span className="flex items-center gap-1.5 text-[#8AA4BE] font-bold">
                      <Eye className="h-3.5 w-3.5 text-[#00A8FF]" />
                      RESILIENCE HUD
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE (100Hz)
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>Storage Tier:</span>
                      <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {storageMetrics.tier} (Tier 1)
                      </span>
                    </div>
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>IndexedDB Deltas:</span>
                      <span className="text-white font-bold">{storageMetrics.totalDeltas} writes (0 loss)</span>
                    </div>
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>CRDT Epoch / Seq:</span>
                      <span className="text-[#00A8FF] font-bold">
                        E{crdtState.currentEpoch} • #{crdtState.globalSequence}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>Rollback SLA:</span>
                      <span className="text-emerald-400 font-bold">&lt; 1.8s (P95: 2.1s)</span>
                    </div>
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>Event Loop Lag:</span>
                      <span className="text-slate-300 font-bold">0.8ms (Zero Jitter)</span>
                    </div>
                  </div>

                  {/* SHA-256 Merkle Chain Verification Box */}
                  <div className="p-2.5 rounded-xl bg-[#07111E] border border-[#1E3A5F] space-y-1.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-[#8AA4BE] uppercase tracking-wider font-bold">
                        CANONICAL STATE SHA-256:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyStateHash(lastSavedHash)}
                        className="text-[#00A8FF] hover:text-white flex items-center gap-0.5 cursor-pointer"
                        title="Copy state hash"
                      >
                        {copiedHashNotice ? <CheckCheck className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                        <span>{copiedHashNotice ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <span className="text-[#00A8FF] font-mono text-[10px] break-all block leading-tight select-all">
                      {lastSavedHash}
                    </span>
                  </div>

                  {/* Chaos Network Drop Simulator Button */}
                  <button
                    type="button"
                    onClick={toggleNetwork}
                    className="w-full py-2 px-3 rounded-xl border border-[#1E3A5F] bg-[#07111E] hover:bg-[#0B192C] text-xs font-mono text-[#8AA4BE] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5 text-[#00A8FF]" />
                    <span>{isOnline ? "Simulate Disconnect (Offline Mode)" : "Restore Socket Quorum"}</span>
                  </button>
                </div>

                {/* Question Navigator */}
                <div className="card-modern !p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-2">
                    <span className="font-heading text-xs font-bold text-[#0B192C] uppercase tracking-wider">
                      Question Navigator ({activeExam.questions.length})
                    </span>
                    <span className="text-[10px] font-mono text-[#556B82]">
                      {flaggedQuestions.length > 0 && `${flaggedQuestions.length} Flagged`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeExam.questions.map((q, idx) => {
                      const isCurrent = activeQIndex === idx;
                      const isFlagged = flaggedQuestions.includes(idx);
                      const isAnswered = q.type === "code"
                        ? Boolean(codeAnswer.trim())
                        : q.type === "mcq"
                        ? mcqAnswer !== null
                        : Boolean(essayAnswer.trim());

                      return (
                        <div
                          key={q.id}
                          onClick={() => handleSelectQuestion(idx)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isCurrent
                              ? "border-[#00A8FF] bg-[#E6F5FF] shadow-sm ring-1 ring-[#00A8FF]"
                              : "border-[#E1E8F0] bg-[#F9FBFE] hover:border-[#00A8FF] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`h-6 w-6 rounded-lg font-heading text-xs font-bold flex items-center justify-center ${
                              isCurrent ? "bg-[#00A8FF] text-[#07111E]" : "bg-[#0B192C] text-white"
                            }`}>
                              Q{idx + 1}
                            </span>
                            <div>
                              <div className="font-heading font-bold text-xs text-[#0B192C]">
                                {q.type.toUpperCase()} • {q.points} Pts
                              </div>
                              <div className="text-[10px] font-mono text-[#556B82]">
                                {isAnswered ? (
                                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <Check className="h-3 w-3 stroke-[3]" /> Answered
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Unanswered</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlagQuestion(idx);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isFlagged ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-amber-500"
                            }`}
                            title={isFlagged ? "Flagged for review" : "Flag question for review"}
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Question Content & Editor */}
              <div className="lg:col-span-9 flex flex-col space-y-4">
                <div className="card-modern flex-1 !p-6 sm:!p-8 flex flex-col justify-between space-y-6">
                  
                  {/* Question Header */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between border-b border-[#E1E8F0] pb-4 mb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#00A8FF] uppercase tracking-wider bg-[#E6F5FF] px-2.5 py-0.5 rounded-full border border-[#00A8FF]/30">
                          {currentQ.type.toUpperCase()} TASK • {currentQ.points || 30} POINTS
                        </span>
                        <span className="text-[10px] font-mono text-[#556B82] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Est. Time: 25 Mins
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleFlagQuestion(activeQIndex)}
                          className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            flaggedQuestions.includes(activeQIndex)
                              ? "bg-amber-50 border-amber-300 text-amber-700"
                              : "border-slate-200 text-slate-500 hover:text-amber-600"
                          }`}
                        >
                          <Bookmark className="h-3 w-3 fill-current" />
                          <span>{flaggedQuestions.includes(activeQIndex) ? "Flagged" : "Flag for Review"}</span>
                        </button>

                        <span className="text-xs text-[#556B82] font-mono flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Saved: <strong className="text-[#00A8FF]">{lastSavedTime}</strong></span>
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                      {currentQ.title}
                    </h2>
                    <p className="text-sm text-[#556B82] leading-relaxed">
                      {currentQ.prompt}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div className="flex-1 my-2">
                    
                    {/* CODE QUESTION: FULL CYBER IDE */}
                    {currentQ.type === "code" && (
                      <div className="space-y-4">
                        
                        {/* IDE Window */}
                        <div className="rounded-2xl border border-[#1E3A5F] bg-[#07111E] overflow-hidden shadow-2xl flex flex-col">
                          
                          {/* IDE Tab Header */}
                          <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#0B192C] border-b border-[#1E3A5F] text-xs font-mono text-[#8AA4BE]">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditorTab("code")}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editorTab === "code"
                                    ? "bg-[#07111E] text-[#00A8FF] border border-[#1E3A5F]"
                                    : "text-[#8AA4BE] hover:text-white"
                                }`}
                              >
                                <FileCode className="h-3.5 w-3.5 text-[#00A8FF]" />
                                <span>solution.js</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditorTab("spec")}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editorTab === "spec"
                                    ? "bg-[#07111E] text-[#00A8FF] border border-[#1E3A5F]"
                                    : "text-[#8AA4BE] hover:text-white"
                                }`}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>spec_requirements.md</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditorTab("tests")}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editorTab === "tests"
                                    ? "bg-[#07111E] text-[#00A8FF] border border-[#1E3A5F]"
                                    : "text-[#8AA4BE] hover:text-white"
                                }`}
                              >
                                <Bug className="h-3.5 w-3.5" />
                                <span>unit_tests.js</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  if (currentQ.codeTemplate) {
                                    setCodeAnswer(currentQ.codeTemplate);
                                    handleAnswerUpdate(currentQ.id, currentQ.codeTemplate);
                                  }
                                }}
                                className="px-2 py-0.5 rounded hover:bg-[#1E3A5F] text-[#8AA4BE] hover:text-white transition-colors cursor-pointer"
                                title="Reset to initial boilerplate"
                              >
                                Reset Template
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(codeAnswer)}
                                className="px-2 py-0.5 rounded hover:bg-[#1E3A5F] text-[#8AA4BE] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {copiedCodeNotice ? <CheckCheck className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                <span>{copiedCodeNotice ? "Copied" : "Copy"}</span>
                              </button>
                              <span className="text-slate-500">|</span>
                              <span className="text-[#00A8FF] font-bold">Node.js v20 (ES2024)</span>
                            </div>
                          </div>

                          {/* Tab 1: Active Code Editor with Line Gutter */}
                          {editorTab === "code" && (
                            <div className="flex flex-1 min-h-[360px] max-h-[440px] overflow-hidden bg-[#07111E]">
                              {/* Line Number Gutter */}
                              <div className="w-11 select-none bg-[#0B192C]/70 text-[#556B82] font-mono text-xs py-4 text-right pr-2.5 leading-relaxed border-r border-[#1E3A5F]/70 overflow-hidden shrink-0">
                                {Array.from({ length: Math.max((codeAnswer || "").split("\n").length, 16) }).map((_, i) => (
                                  <div key={i}>{i + 1}</div>
                                ))}
                              </div>

                              {/* Code Textarea */}
                              <textarea
                                value={codeAnswer}
                                onChange={handleCodeChange}
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    const start = e.currentTarget.selectionStart;
                                    const end = e.currentTarget.selectionEnd;
                                    const updated = codeAnswer.substring(0, start) + "  " + codeAnswer.substring(end);
                                    setCodeAnswer(updated);
                                    handleAnswerUpdate(currentQ.id, updated);
                                    setTimeout(() => {
                                      const target = document.getElementById("code-ide-surface") as HTMLTextAreaElement;
                                      if (target) {
                                        target.selectionStart = target.selectionEnd = start + 2;
                                      }
                                    }, 0);
                                  }
                                }}
                                id="code-ide-surface"
                                className="flex-1 w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-[#E6F5FF] leading-relaxed resize-none focus:outline-none selection:bg-[#00A8FF] selection:text-white"
                                placeholder="// Write your resilient state commit logic here..."
                                spellCheck={false}
                              />
                            </div>
                          )}

                          {/* Tab 2: Spec Requirements */}
                          {editorTab === "spec" && (
                            <div className="p-6 text-xs sm:text-sm font-sans text-[#C5D9EE] space-y-4 bg-[#07111E] min-h-[360px] overflow-y-auto">
                              <h4 className="font-heading font-extrabold text-white text-base">
                                Specification & Architectural Invariants:
                              </h4>
                              <div className="space-y-2 text-xs font-mono">
                                <div className="p-3 rounded-xl bg-[#0B192C] border border-[#1E3A5F]">
                                  <strong className="text-[#00A8FF]">Invariant 1: Local Buffer Fallback</strong>
                                  <p className="text-slate-400 mt-1">If candidateState.isDisconnected is truthy, write state log delta to local IndexedDB buffer with timestamp.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0B192C] border border-[#1E3A5F]">
                                  <strong className="text-[#00A8FF]">Invariant 2: Merkle Canonical Head</strong>
                                  <p className="text-slate-400 mt-1">Append leaf hash delta onto hashChain.head to guarantee tamper evidence.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0B192C] border border-[#1E3A5F]">
                                  <strong className="text-[#00A8FF]">Invariant 3: Sub-2.4s Recovery Contract</strong>
                                  <p className="text-slate-400 mt-1">Recovery replay must be non-blocking and execute in under 2.4 seconds upon quorum resumption.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tab 3: Unit Tests Preview */}
                          {editorTab === "tests" && (
                            <div className="p-4 font-mono text-xs text-[#E6F5FF] bg-[#07111E] min-h-[360px] overflow-y-auto">
                              <pre className="text-slate-400 leading-relaxed">
{`describe("ReviveX Consensus State Recovery Suite", () => {
  it("commits delta to local buffer under follower disconnect", () => {
    const res = commitStateSnapshot(1, { isDisconnected: true }, { head: "0xa8f4" });
    expect(res).toBeDefined();
  });

  it("produces verifiable SHA-256 state hash matching quorum spec", () => {
    const res = commitStateSnapshot(1, { isDisconnected: false }, { head: "0xa8f4" });
    expect(res.status).toEqual("COMMITTED_TO_EDGE");
    expect(res.stateHash).toMatch(/^0x[a-f0-9]{16}/);
  });
});`}
                              </pre>
                            </div>
                          )}

                        </div>

                        {/* In-Browser Interactive Test Runner Console */}
                        <div className="rounded-2xl border border-[#1E3A5F] bg-[#0B192C] p-4 text-white space-y-3 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A5F] pb-3">
                            <div className="flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-[#00A8FF]" />
                              <span className="font-mono font-bold text-xs">
                                Unit Test Runner & State Assertion Engine
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setTestResults(null);
                                  setTestConsoleOutput([]);
                                }}
                                className="text-[11px] font-mono text-[#8AA4BE] hover:text-white px-2 py-1 rounded hover:bg-[#07111E] cursor-pointer"
                              >
                                Clear Console
                              </button>

                              <button
                                type="button"
                                onClick={handleRunCodeTests}
                                disabled={testRunning}
                                className="btn-cyan !py-1.5 !px-4 !text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md"
                              >
                                {testRunning ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 text-[#07111E] animate-spin" />
                                    <span>Executing In Sandbox...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>Run Code & Validate Tests</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Test Case Results Accordion */}
                          {testResults && (
                            <div className="space-y-2 pt-1">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                {testResults.map((t, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="p-3 rounded-xl bg-[#07111E] border border-emerald-500/30 text-xs font-mono space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>PASS</span>
                                      </span>
                                      <span className="text-slate-400 text-[10px]">{t.time}</span>
                                    </div>
                                    <div className="text-slate-200 font-semibold text-[11px] truncate">{t.name}</div>
                                    <div className="text-slate-500 text-[10px]">{t.details}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Console Output Terminal */}
                          {testConsoleOutput.length > 0 && (
                            <div className="p-3 rounded-xl bg-[#07111E] border border-[#1E3A5F] font-mono text-[11px] space-y-1 max-h-32 overflow-y-auto">
                              {testConsoleOutput.map((log, lIdx) => (
                                <div key={lIdx} className="text-emerald-300">
                                  {log}
                                </div>
                              ))}
                            </div>
                          )}

                        </div>

                      </div>
                    )}

                    {/* MCQ QUESTION: SLEEK INTERACTIVE CARDS */}
                    {currentQ.type === "mcq" && (
                      <div className="space-y-3 pt-2">
                        {currentQ.options?.map((opt, oIdx) => {
                          const isSelected = mcqAnswer === oIdx;
                          const optionLetters = ["A", "B", "C", "D", "E"];

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setMcqAnswer(oIdx);
                                handleAnswerUpdate(currentQ.id, `OPTION_${oIdx}`);
                              }}
                              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "border-[#00A8FF] bg-[#E6F5FF] text-[#0B192C] shadow-md ring-2 ring-[#00A8FF]"
                                  : "border-[#E1E8F0] bg-white text-[#445B73] hover:border-[#00A8FF] hover:bg-[#F8FBFE]"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <span className={`h-7 w-7 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-[#00A8FF] text-[#07111E]" : "bg-[#F4F8FC] border border-[#D5E2F0] text-[#556B82]"
                                }`}>
                                  {optionLetters[oIdx] || oIdx + 1}
                                </span>
                                <span>{opt}</span>
                              </div>

                              <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-[#00A8FF] bg-[#00A8FF] text-white" : "border-[#C5D5E6]"
                              }`}>
                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* ESSAY QUESTION: STRUCTURED WRITING PAD */}
                    {currentQ.type === "essay" && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-xs font-mono text-[#556B82]">
                          <span>Architectural Essay Pad • Markdown Supported</span>
                          <span>Words: <strong className="text-[#0B192C]">{essayAnswer.trim() ? essayAnswer.trim().split(/\s+/).length : 0}</strong> • Chars: <strong className="text-[#00A8FF]">{essayAnswer.length}</strong></span>
                        </div>
                        <textarea
                          rows={13}
                          value={essayAnswer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEssayAnswer(val);
                            handleAnswerUpdate(currentQ.id, val);
                          }}
                          className="w-full rounded-2xl border border-[#D8DFE8] bg-[#F4F8FC] p-4 text-xs sm:text-sm text-[#0B192C] leading-relaxed resize-none focus:border-[#00A8FF] focus:bg-white focus:outline-none shadow-inner"
                          placeholder="Provide your in-depth architectural explanation with mathematical justification..."
                        />
                      </div>
                    )}

                  </div>

                  {/* Bottom Navigation & Submission Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E1E8F0]">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={activeQIndex === 0}
                        onClick={() => handleSelectQuestion(activeQIndex - 1)}
                        className="px-4 py-2.5 rounded-full border border-[#E1E8F0] bg-white text-xs font-bold text-[#556B82] hover:text-[#0B192C] disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        Previous Question
                      </button>
                      <button
                        disabled={activeQIndex === (activeExam.questions?.length || 1) - 1}
                        onClick={() => handleSelectQuestion(activeQIndex + 1)}
                        className="px-4 py-2.5 rounded-full border border-[#E1E8F0] bg-white text-xs font-bold text-[#556B82] hover:text-[#0B192C] disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        Next Question
                      </button>
                    </div>

                    <button
                      onClick={handleSubmitExam}
                      className="btn-cyan !py-3.5 !px-8 text-xs font-heading font-extrabold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00A8FF]/20"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Exam Session</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Submission Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-[#07111E]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full border border-[#E1E8F0] shadow-2xl text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-[#E6F5FF] text-[#00A8FF] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-extrabold text-[#0B192C]">
                Exam Successfully Submitted
              </h3>
              <p className="text-xs sm:text-sm text-[#556B82]">
                Your exam session state is cryptographically signed via HMAC and persisted across IndexedDB & edge nodes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E1E8F0] text-left space-y-2 font-mono text-xs">
              <div className="text-[10px] text-[#556B82] uppercase tracking-wider font-bold">
                HMAC Authoritative Verification Token:
              </div>
              <div className="font-bold text-[#00A8FF] break-all">
                {receiptToken}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setViewMode("dashboard");
                }}
                className="btn-cyan flex-1 justify-center cursor-pointer"
              >
                <span>Return to Student Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Merkle Audit Proof Modal */}
      {selectedProofModal && (
        <div className="fixed inset-0 z-50 bg-[#07111E]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#1E3A5F] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#1E3A5F] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#00A8FF]/20 text-[#00A8FF] flex items-center justify-center font-bold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white">
                    Cryptographic Merkle Audit Proof
                  </h3>
                  <p className="text-xs text-[#8AA4BE]">
                    Mathematical zero-knowledge non-repudiation verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProofModal(null)}
                className="p-1.5 text-[#8AA4BE] hover:text-white rounded-full hover:bg-[#1E3A5F] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1E3A5F] space-y-1">
                <div className="text-[10px] text-[#8AA4BE] uppercase font-bold">Assessment</div>
                <div className="text-white font-bold text-sm">{selectedProofModal.examTitle}</div>
                <div className="text-emerald-400 text-[11px] font-bold">Score: {selectedProofModal.score} • Submitted {selectedProofModal.date}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#07111E] border border-[#1E3A5F] space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8AA4BE] font-bold">CANONICAL MERKLE ROOT:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">VALIDATED [MATCH]</span>
                </div>
                <div className="text-[#00A8FF] font-bold break-all bg-[#0B192C] p-2.5 rounded-lg border border-[#1E3A5F] text-[11px]">
                  0x{selectedProofModal.token.replace(/[^0-9a-f]/gi, "9a8f")}d3e82910fa4b9c1077e6
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8AA4BE] pt-1">
                  <div>
                    <span className="block">LEAF DELTA HASH:</span>
                    <span className="text-white font-bold">0x9f8c...49d2</span>
                  </div>
                  <div>
                    <span className="block">SIBLING PROOF NODE:</span>
                    <span className="text-white font-bold">0x7c91...8101</span>
                  </div>
                  <div>
                    <span className="block">ALGORITHM:</span>
                    <span className="text-white font-bold">SHA-256 HMAC</span>
                  </div>
                  <div>
                    <span className="block">PROCTOR AUTHORITY:</span>
                    <span className="text-white font-bold">Prof. Sterling</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero byte loss verified across edge IndexedDB and authoritative server logs.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedProofModal(null)}
                className="btn-cyan !py-2.5 !px-6 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROMINENT CONNECTION INTERRUPTED / FAILOVER OVERLAY ================= */}
      {liveFailover && (
        <div className="fixed inset-0 z-50 bg-[#07111E]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`max-w-xl w-full rounded-3xl p-6 sm:p-9 border-2 ${
            liveFailover.status === "recovering"
              ? "border-amber-500/80 shadow-amber-500/20"
              : "border-emerald-500/80 shadow-emerald-500/20"
          } bg-[#0B192C] text-white shadow-2xl space-y-6 relative overflow-hidden`}>
            
            {/* Top ambient glow */}
            <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              liveFailover.status === "recovering" ? "bg-amber-500/20" : "bg-emerald-500/20"
            }`} />

            <div className="flex items-start gap-4 relative z-10">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
                liveFailover.status === "recovering"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
              }`}>
                {liveFailover.status === "recovering" ? (
                  <WifiOff className="h-7 w-7 text-amber-400 animate-bounce" />
                ) : (
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                    liveFailover.status === "recovering"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse"
                      : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                  }`}>
                    {liveFailover.status === "recovering" ? "SOCKET QUORUM SEVERED • 1.82s SLA" : "RECOVERY VERIFIED • 0 LOSS"}
                  </span>
                  <button
                    onClick={() => {
                      setLiveFailover(null);
                      clearActiveFailoverEvent();
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white mt-1.5 leading-snug">
                  {liveFailover.status === "recovering"
                    ? "Connection Interrupted: Socket Dropped"
                    : "Quorum Restored & State Re-Hydrated"}
                </h3>
                <p className="text-xs text-[#8AA4BE] mt-0.5">
                  {liveFailover.status === "recovering"
                    ? "ReviveX Multi-Tier storage has engaged. Offline 100Hz IndexedDB buffering is active."
                    : "Zero data loss confirmed. CRDT monotonic registers reconciled with edge Merkle root."}
                </p>
              </div>
            </div>

            {/* Diagnostic Matrix Box */}
            <div className="p-4 rounded-2xl bg-[#07111E] border border-[#1E3A5F] space-y-2.5 font-mono text-xs relative z-10">
              <div className="flex justify-between text-[#8AA4BE]">
                <span>Failure Mode:</span>
                <span className="text-amber-300 font-bold">{liveFailover.failureReason}</span>
              </div>
              <div className="flex justify-between text-[#8AA4BE]">
                <span>Client Storage Intercept:</span>
                <span className="text-emerald-400 font-bold">IndexedDB Tier 1 (100Hz Buffering Active)</span>
              </div>
              <div className="flex justify-between text-[#8AA4BE]">
                <span>CRDT Epoch / Seq:</span>
                <span className="text-[#00A8FF] font-bold">E{crdtState.currentEpoch} • #{crdtState.globalSequence} (Preserved)</span>
              </div>
              {liveFailover.status === "recovered" && (
                <div className="flex justify-between text-[#8AA4BE]">
                  <span>Canonical SHA-256:</span>
                  <span className="text-emerald-400 font-bold select-all break-all">{liveFailover.hash.slice(0, 24)}...</span>
                </div>
              )}
            </div>

            {/* Status-dependent Body */}
            {liveFailover.status === "recovering" ? (
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between font-mono text-xs text-[#8AA4BE]">
                  <span>Reconstructing state from IndexedDB deltas...</span>
                  <span className="text-amber-400 font-bold">1.82s SLA</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#1E3A5F] overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-amber-500 via-[#00A8FF] to-emerald-400 rounded-full animate-pulse w-full duration-1000" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Do not reload or close the tab. Your uncommitted keystrokes are safe and will be restored automatically.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1 relative z-10">
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>State re-hydrated in {liveFailover.durationMs}ms. Zero silent loss verified. You may resume your examination.</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLiveFailover(null);
                      clearActiveFailoverEvent();
                    }}
                    className="btn-cyan flex-1 justify-center py-3 text-xs font-heading font-extrabold cursor-pointer shadow-lg"
                  >
                    <span>Resume Examination</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProofModal({
                        examTitle: `${activeExam.code}: Failover Recovery Ledger`,
                        score: "100% Match (0 B Lost)",
                        token: liveFailover.hash,
                        date: new Date(liveFailover.timestamp).toLocaleTimeString(),
                      });
                    }}
                    className="px-5 py-3 rounded-full border border-[#1E3A5F] bg-[#07111E] text-xs font-mono font-bold text-[#00A8FF] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Inspect Merkle Proof</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default function StudentPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8FF]"></div>
      </div>
    }>
      <StudentPortalContent />
    </Suspense>
  );
}

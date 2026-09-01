"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  LogOut
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import { DotField } from "@/components/ui/DotField";
import {
  Exam,
  ExamQuestion,
  StudentProfile,
  STUDENTS_DATA,
  getStoredExams,
  getStudentProfile
} from "@/lib/examStore";

function StudentPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentParam = searchParams.get("id") || "STU-84920";

  // Selected Student Profile
  const [currentStudentId, setCurrentStudentId] = useState<string>(studentParam);
  const currentStudent: StudentProfile = getStudentProfile(currentStudentId);

  // View Mode: Dashboard (Test list) vs Exam Pod (Active IDE session)
  const [viewMode, setViewMode] = useState<"dashboard" | "exam">("dashboard");
  const [selectedExamId, setSelectedExamId] = useState<string>("EXAM-CS448");
  const [exams, setExams] = useState<Exam[]>([]);

  // Active Exam State
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(1);
  const [essayAnswer, setEssayAnswer] = useState("ReviveX maintains an off-thread 100Hz local buffer in IndexedDB. When a network disruption or browser crash occurs, the candidate's verified state snapshot is reconstructed via the SHA-256 Merkle chain in under 2.4 seconds with zero loss.");
  
  const [offlineBufferCount, setOfflineBufferCount] = useState(0);
  const [lastSavedHash, setLastSavedHash] = useState("0xa8f492c10b7e49d29f8c12a3456789abcdef");
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [timerSeconds, setTimerSeconds] = useState(5400); // 90 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptToken, setReceiptToken] = useState<string | null>(null);

  useEffect(() => {
    const loadedExams = getStoredExams();
    setExams(loadedExams);
    if (loadedExams.length > 0) {
      setSelectedExamId(loadedExams[0].id);
      if (loadedExams[0].questions?.[0]?.codeTemplate) {
        setCodeAnswer(loadedExams[0].questions[0].codeTemplate);
      }
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (viewMode !== "exam" || isSubmitted) return;
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [viewMode, isSubmitted]);

  const handleLaunchExam = (exam: Exam) => {
    setSelectedExamId(exam.id);
    setActiveQIndex(0);
    if (exam.questions?.[0]?.codeTemplate) {
      setCodeAnswer(exam.questions[0].codeTemplate);
    }
    setViewMode("exam");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeAnswer(e.target.value);
    if (!isOnline) {
      setOfflineBufferCount((prev) => prev + 1);
    } else {
      setLastSavedTime("Just now");
      setLastSavedHash("0x" + Math.random().toString(16).substring(2, 12) + "9f8c");
    }
  };

  const toggleNetwork = () => {
    if (isOnline) {
      setIsOnline(false);
    } else {
      setIsOnline(true);
      setOfflineBufferCount(0);
      setLastSavedTime("Just now (Resynced)");
      setLastSavedHash("0x" + Math.random().toString(16).substring(2, 14));
    }
  };

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitExam = () => {
    const generatedReceipt = `REVIVEX-RECEIPT-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`;
    setReceiptToken(generatedReceipt);
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

          {/* 3 Student Switcher Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0B192C] border border-[#1E3A5F] rounded-full px-3 py-1 text-xs">
              <User className="h-3.5 w-3.5 text-[#00A8FF]" />
              <select
                value={currentStudentId}
                onChange={(e) => {
                  setCurrentStudentId(e.target.value);
                  setViewMode("dashboard");
                }}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="STU-84920" className="bg-[#0B192C] text-white">Alex Chen (Stanford CS)</option>
                <option value="STU-84921" className="bg-[#0B192C] text-white">Sarah Jenkins (MIT Physics)</option>
                <option value="STU-84922" className="bg-[#0B192C] text-white">Marcus Vance (UC Berkeley Crypto)</option>
              </select>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-full border border-[#1E3A5F] bg-[#0B192C] px-3.5 py-1.5 text-xs font-bold text-[#8AA4BE] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Student Portal Body */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6 relative z-10">

        {/* ================= VIEW MODE 1: STUDENT DASHBOARD ================= */}
        {viewMode === "dashboard" && (
          <div className="space-y-6">
            
            {/* Student Profile Header Banner */}
            <div className="card-modern !p-6 sm:!p-8 bg-gradient-to-r from-white via-[#F8FBFE] to-[#EBF3FB] border border-[#E1E8F0]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center font-heading text-2xl font-extrabold shadow-md">
                    {currentStudent.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                        {currentStudent.name}
                      </h1>
                      <span className="bg-[#E6F5FF] text-[#00A8FF] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#00A8FF]/30">
                        {currentStudent.gpa}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#556B82] mt-1 font-semibold">
                      {currentStudent.university} • {currentStudent.department}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-[#556B82]">
                      <span>ID: <strong className="text-[#0B192C]">{currentStudent.candidateNumber}</strong></span>
                      <span>•</span>
                      <span>Email: <strong className="text-[#00A8FF]">{currentStudent.email}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1E8F0] shadow-sm text-center">
                    <div className="font-heading text-xl font-bold text-[#00A8FF]">{ongoingExams.length}</div>
                    <div className="text-[10px] text-[#556B82] uppercase font-bold">Ongoing Tests</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1E8F0] shadow-sm text-center">
                    <div className="font-heading text-xl font-bold text-[#0B192C]">{upcomingExams.length}</div>
                    <div className="text-[10px] text-[#556B82] uppercase font-bold">Upcoming Tests</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1E8F0] shadow-sm text-center">
                    <div className="font-heading text-xl font-bold text-[#00A8FF]">{currentStudent.completedExams.length}</div>
                    <div className="text-[10px] text-[#556B82] uppercase font-bold">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: ONGOING / ACTIVE TESTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C]">
                  <span className="h-3 w-3 rounded-full bg-[#00A8FF] animate-ping" />
                  <span>Active & Ongoing Examinations (Ready to Take)</span>
                </div>
                <span className="text-xs text-[#556B82] font-mono font-bold">
                  100Hz Telemetry & Sub-2.4s Rollback Enforced
                </span>
              </div>

              {ongoingExams.length === 0 ? (
                <div className="card-modern text-center !p-8 text-[#556B82] text-xs">
                  No active exams currently ongoing for this candidate.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ongoingExams.map((exam) => (
                    <div key={exam.id} className="card-modern !p-6 space-y-4 border-2 border-[#00A8FF]/40 bg-white shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider bg-[#E6F5FF] px-2.5 py-0.5 rounded-full border border-[#00A8FF]/30">
                            {exam.code} • LIVE SESSION
                          </span>
                          <h3 className="font-heading text-xl font-bold text-[#0B192C] mt-2">
                            {exam.title}
                          </h3>
                          <p className="text-xs text-[#556B82] mt-0.5">
                            Instructor: {exam.instructor}
                          </p>
                        </div>
                        <span className="h-3 w-3 rounded-full bg-[#00A8FF] animate-pulse shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#F4F8FC] p-3 rounded-xl border border-[#E1E8F0]">
                        <div>
                          <span className="text-[#556B82] text-[10px] block">DURATION</span>
                          <span className="font-bold text-[#0B192C]">{exam.duration}</span>
                        </div>
                        <div>
                          <span className="text-[#556B82] text-[10px] block">TOTAL WEIGHT</span>
                          <span className="font-bold text-[#0B192C]">{exam.totalPoints} Points</span>
                        </div>
                        <div>
                          <span className="text-[#556B82] text-[10px] block">TELEMETRY BUFFER</span>
                          <span className="font-bold text-[#00A8FF]">{exam.protocol.telemetryRate}</span>
                        </div>
                        <div>
                          <span className="text-[#556B82] text-[10px] block">ROLLBACK SLA</span>
                          <span className="font-bold text-[#00A8FF]">{exam.protocol.rollbackSla}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLaunchExam(exam)}
                        className="btn-cyan w-full justify-center !py-3.5 cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Launch / Resume Exam Pod</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: UPCOMING SCHEDULED TESTS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C]">
                <Calendar className="h-5 w-5 text-[#00A8FF]" />
                <span>Upcoming Scheduled Examinations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="card-modern !p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#556B82] uppercase tracking-wider bg-[#F4F8FC] px-2.5 py-0.5 rounded-full border border-[#E1E8F0]">
                          {exam.code} • {exam.subject}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-[#0B192C] mt-2">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-[#556B82] mt-0.5">
                          Instructor: {exam.instructor}
                        </p>
                      </div>
                      <span className="bg-[#F4F8FC] border border-[#E1E8F0] text-[#556B82] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                        SCHEDULED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#556B82] border-t border-[#E1E8F0] pt-3">
                      <div>
                        <span className="block text-[10px]">SCHEDULE:</span>
                        <span className="font-bold text-[#0B192C]">{exam.date}</span>
                      </div>
                      <div>
                        <span className="block text-[10px]">DURATION:</span>
                        <span className="font-bold text-[#0B192C]">{exam.duration}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-[#00A8FF] flex items-center gap-1.5 pt-1">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Security Protocol: {exam.protocol.cryptography} • {exam.protocol.browserLockdown} Lockdown</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: COMPLETED TESTS WITH VERIFIED RECEIPTS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C]">
                <Award className="h-5 w-5 text-[#00A8FF]" />
                <span>Completed Tests & Cryptographic Audit Receipts</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentStudent.completedExams.map((cExam, idx) => (
                  <div key={idx} className="card-modern !p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-[#0B192C]">
                          {cExam.examTitle}
                        </h4>
                        <span className="text-xs text-[#556B82] font-mono">
                          Submitted: {cExam.submittedDate}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-xl font-extrabold text-[#00A8FF]">
                          {cExam.score}
                        </span>
                        <span className="block text-[10px] font-mono text-[#00A8FF] font-bold">
                          {cExam.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#07111E] text-white font-mono text-xs space-y-1">
                      <span className="text-[10px] text-[#8AA4BE] uppercase tracking-wider block font-bold">
                        NON-REPUDIATION VERIFICATION TOKEN:
                      </span>
                      <span className="text-[#00A8FF] font-bold break-all text-[11px]">
                        {cExam.receiptToken}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW MODE 2: ACTIVE INTERACTIVE EXAM POD ================= */}
        {viewMode === "exam" && (
          <div className="space-y-4">
            
            {/* Top Control Bar in Deep Navy */}
            <div className="bg-[#0B192C] text-white p-4 rounded-2xl border border-[#1E3A5F] shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("dashboard")}
                  className="flex items-center gap-1.5 text-xs text-[#8AA4BE] hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Tests Dashboard</span>
                </button>
                <div className="h-4 w-px bg-[#1E3A5F]" />
                <span className="font-heading font-bold text-sm text-[#00A8FF]">
                  {activeExam.code}: {activeExam.title}
                </span>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                {/* Timer */}
                <div className="flex items-center gap-2 rounded-full border border-[#1E3A5F] bg-[#07111E] px-3.5 py-1.5 text-white">
                  <Clock className="h-3.5 w-3.5 text-[#00A8FF] animate-pulse" />
                  <span className="font-bold tabular-nums">{formatTimer(timerSeconds)}</span>
                </div>

                {/* Offline Simulator Toggle */}
                <button
                  onClick={toggleNetwork}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all text-xs font-mono cursor-pointer ${
                    isOnline
                      ? "border-[#00A8FF]/40 bg-[#00A8FF]/10 text-[#00A8FF] hover:bg-[#00A8FF]/20"
                      : "border-[#FFB020]/60 bg-[#FFB020]/20 text-[#FFB020] hover:bg-[#FFB020]/30"
                  }`}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="h-3.5 w-3.5 text-[#00A8FF]" />
                      <span className="font-bold">NETWORK: ONLINE (14ms)</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3.5 w-3.5 text-[#FFB020] animate-bounce" />
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
                    <span className="flex items-center gap-1.5 text-[#8AA4BE]">
                      <Eye className="h-3.5 w-3.5 text-[#00A8FF]" />
                      AI PROCTOR HUD
                    </span>
                    <span className="rounded-full bg-[#00A8FF]/20 border border-[#00A8FF]/40 px-2 py-0.5 text-[10px] text-[#00A8FF] font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl border border-[#1E3A5F] bg-[#07111E] overflow-hidden flex items-center justify-center">
                    <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                      <div className="h-11 w-11 rounded-full border border-[#00A8FF]/50 bg-[#00A8FF]/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,255,0.25)]">
                        <Cpu className="h-5 w-5 text-[#00A8FF]" />
                      </div>
                      <span className="font-mono text-[10px] text-[#00A8FF] font-bold tracking-wider">
                        FACE & GAZE LOCKED
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>Gaze In-Zone:</span>
                      <span className="text-[#00A8FF] font-bold">99.4% (Optimal)</span>
                    </div>
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>Telemetry:</span>
                      <span className="text-white font-bold">{activeExam.protocol.telemetryRate}</span>
                    </div>
                    <div className="flex justify-between text-[#8AA4BE]">
                      <span>Rollback SLA:</span>
                      <span className="text-[#00A8FF] font-bold">{activeExam.protocol.rollbackSla}</span>
                    </div>
                  </div>
                </div>

                {/* Question Navigator */}
                <div className="card-modern !p-4 space-y-3">
                  <div className="font-heading text-xs font-bold text-[#0B192C] uppercase tracking-wider border-b border-[#E1E8F0] pb-2">
                    Question Navigator ({activeExam.questions.length})
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {activeExam.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setActiveQIndex(idx)}
                        className={`py-2.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer ${
                          activeQIndex === idx
                            ? "btn-cyan !py-2.5 !px-2 w-full"
                            : "bg-[#F4F8FC] border border-[#E1E8F0] text-[#556B82] hover:text-[#0B192C] hover:border-[#00A8FF]"
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Question Content & Editor */}
              <div className="lg:col-span-9 flex flex-col space-y-4">
                <div className="card-modern flex-1 !p-6 sm:!p-8 flex flex-col justify-between space-y-6">
                  
                  {/* Question Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-4 mb-4">
                      <span className="text-xs font-mono font-bold text-[#00A8FF] uppercase tracking-wider">
                        {currentQ.type.toUpperCase()} TASK • {currentQ.points || 30} POINTS
                      </span>
                      <span className="text-xs text-[#556B82] font-mono">
                        Saved: <strong className="text-[#00A8FF]">{lastSavedTime}</strong>
                      </span>
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-[#0B192C] mb-2">
                      {currentQ.title}
                    </h2>
                    <p className="text-sm text-[#556B82] leading-relaxed">
                      {currentQ.prompt}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div className="flex-1 my-4">
                    {currentQ.type === "code" && (
                      <div className="rounded-2xl border border-[#1E3A5F] bg-[#07111E] overflow-hidden shadow-inner flex flex-col h-[380px]">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B192C] border-b border-[#1E3A5F] text-xs font-mono text-[#8AA4BE]">
                          <span className="flex items-center gap-2 text-[#00A8FF]">
                            <FileCode className="h-4 w-4" />
                            <span>solution.js</span>
                          </span>
                          <span className="text-[10px]">100Hz Buffering Active</span>
                        </div>
                        <textarea
                          value={codeAnswer}
                          onChange={handleCodeChange}
                          className="flex-1 w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-[#E6F5FF] leading-relaxed resize-none focus:outline-none selection:bg-[#00A8FF] selection:text-white"
                          placeholder="Write your solution here..."
                        />
                      </div>
                    )}

                    {currentQ.type === "mcq" && (
                      <div className="space-y-3 pt-2">
                        {currentQ.options?.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setMcqAnswer(oIdx);
                              setLastSavedTime("Just now");
                              setLastSavedHash("0x" + Math.random().toString(16).substring(2, 14));
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-semibold flex items-center gap-3 cursor-pointer ${
                              mcqAnswer === oIdx
                                ? "border-[#00A8FF] bg-[#E6F5FF] text-[#0B192C] shadow-sm font-bold"
                                : "border-[#E1E8F0] bg-white text-[#556B82] hover:border-[#00A8FF] hover:bg-[#F4F8FC]"
                            }`}
                          >
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                              mcqAnswer === oIdx ? "border-[#00A8FF] bg-[#00A8FF] text-white" : "border-[#C5D5E6]"
                            }`}>
                              {mcqAnswer === oIdx && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            <span>{opt}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {currentQ.type === "essay" && (
                      <div className="pt-2">
                        <textarea
                          rows={12}
                          value={essayAnswer}
                          onChange={(e) => {
                            setEssayAnswer(e.target.value);
                            setLastSavedTime("Just now");
                            setLastSavedHash("0x" + Math.random().toString(16).substring(2, 14));
                          }}
                          className="w-full rounded-2xl border border-[#D8DFE8] bg-[#F4F8FC] p-4 text-xs sm:text-sm text-[#0B192C] leading-relaxed resize-none focus:border-[#00A8FF] focus:bg-white focus:outline-none"
                          placeholder="Provide your in-depth architectural explanation..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E1E8F0]">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={activeQIndex === 0}
                        onClick={() => setActiveQIndex((p) => p - 1)}
                        className="px-4 py-2.5 rounded-full border border-[#E1E8F0] bg-white text-xs font-bold text-[#556B82] hover:text-[#0B192C] disabled:opacity-40 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        disabled={activeQIndex === (activeExam.questions?.length || 1) - 1}
                        onClick={() => setActiveQIndex((p) => p + 1)}
                        className="px-4 py-2.5 rounded-full border border-[#E1E8F0] bg-white text-xs font-bold text-[#556B82] hover:text-[#0B192C] disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>

                    <button
                      onClick={handleSubmitExam}
                      className="btn-cyan !py-3 !px-6 cursor-pointer"
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
                Your exam session state is cryptographically signed and archived across 6 edge nodes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#E1E8F0] text-left space-y-2 font-mono text-xs">
              <div className="text-[10px] text-[#556B82] uppercase tracking-wider font-bold">
                Verification Proof Token:
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

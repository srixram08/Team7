"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  BookOpen,
  Users,
  ShieldCheck,
  Zap,
  Clock,
  FileCode,
  CheckCircle2,
  Sliders,
  Send,
  Layers,
  Sparkles,
  Calendar,
  Lock,
  Database,
  Trash2,
  ArrowRight,
  LogOut
} from "lucide-react";
import { DottedLogo } from "@/components/ui/DottedLogo";
import {
  Exam,
  ExamQuestion,
  SecurityProtocol,
  getStoredExams,
  saveExam,
  STUDENTS_DATA
} from "@/lib/examStore";

export default function TeacherPortalPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeTab, setActiveTab] = useState<"manage" | "create">("manage");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Exam Form State
  const [examTitle, setExamTitle] = useState("");
  const [courseCode, setCourseCode] = useState("CS-580");
  const [subject, setSubject] = useState("Distributed Systems");
  const [duration, setDuration] = useState("90 Minutes");
  const [examDate, setExamDate] = useState("Today (Live)");
  const [examStatus, setExamStatus] = useState<"ongoing" | "upcoming">("ongoing");
  const [totalPoints, setTotalPoints] = useState(100);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([
    "STU-84920",
    "STU-84921",
    "STU-84922"
  ]);

  // Protocol Settings
  const [protocol, setProtocol] = useState<SecurityProtocol>({
    telemetryRate: "100Hz",
    browserLockdown: "Strict",
    aiRiskSensitivity: "Balanced (0.75)",
    rollbackSla: "2.4s Guaranteed",
    cryptography: "SHA-256 Merkle Chain",
    autoSaveInterval: "10ms Delta"
  });

  // Dynamic Questions State
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 1,
      title: "Question 1: Fault-Tolerant Distributed State Logging",
      type: "code",
      points: 50,
      prompt: "Implement an atomic state log replication function that guarantees zero silent byte loss under unexpected socket failure.",
      codeTemplate: `function replicateStateLog(logEntry, activeQuorum) {\n  // Buffer 100Hz local telemetry to IndexedDB\n  return { status: "COMMITTED", stateHash: "0x9a8f4c21e0b7" };\n}`
    },
    {
      id: 2,
      title: "Question 2: Cryptographic State Proofs",
      type: "mcq",
      points: 50,
      prompt: "What mathematical structure prevents retrospective answer modification in ReviveX?",
      options: [
        "Unsigned HTTP cookies",
        "SHA-256 State Delta Merkle Hash Chaining",
        "Client-side LocalStorage cache",
        "Manual proctor spreadsheet logs"
      ],
      correctOption: 1
    }
  ]);

  useEffect(() => {
    setExams(getStoredExams());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddQuestion = (type: "code" | "mcq" | "essay") => {
    const newQ: ExamQuestion = {
      id: questions.length + 1,
      title: `Question ${questions.length + 1}: ${type.toUpperCase()} Assessment`,
      type,
      points: 25,
      prompt: "Enter question prompt and evaluation requirements...",
      ...(type === "code"
        ? { codeTemplate: `function solution() {\n  // Write solution here\n}` }
        : {}),
      ...(type === "mcq"
        ? {
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctOption: 0
          }
        : {})
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length <= 1) {
      triggerToast("An exam must contain at least 1 question.");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handlePublishExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) {
      triggerToast("Please provide an Exam Title.");
      return;
    }

    const newExam: Exam = {
      id: `EXAM-${courseCode.replace(/[^A-Z0-9]/gi, "").toUpperCase()}-${Date.now().toString().slice(-4)}`,
      code: courseCode,
      title: examTitle,
      subject,
      instructor: "Prof. Robert Sterling",
      date: examDate,
      time: examStatus === "ongoing" ? "Active Now" : "Scheduled Session",
      duration,
      status: examStatus,
      totalPoints,
      assignedStudents: assignedStudentIds,
      protocol,
      questions
    };

    saveExam(newExam);
    setExams(getStoredExams());
    triggerToast(`Exam "${examTitle}" published & assigned to ${assignedStudentIds.length} candidate(s)!`);
    setActiveTab("manage");

    // Reset Form
    setExamTitle("");
  };

  const toggleStudentAssignment = (stuId: string) => {
    if (assignedStudentIds.includes(stuId)) {
      setAssignedStudentIds(assignedStudentIds.filter((id) => id !== stuId));
    } else {
      setAssignedStudentIds([...assignedStudentIds, stuId]);
    }
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
                  Teacher Assessment & Protocol Studio
                </span>
                <span className="text-[10px] font-mono text-[#00A8FF]">
                  Instructor: Prof. Robert Sterling (Chair of Systems & Computing)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#00A8FF]/30 bg-[#0B192C] px-3.5 py-1.5 text-xs font-bold text-[#00A8FF]">
              <span className="h-2 w-2 rounded-full bg-[#00A8FF] animate-pulse" />
              <span>Faculty ID: FAC-2026-901</span>
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

      {/* Main Studio Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 space-y-6">
        
        {/* Top Header & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-mono text-xs font-bold text-[#00A8FF] uppercase tracking-wider">
              FACULTY ASSESSMENT MANAGEMENT
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B192C] mt-0.5">
              Examination Creation & Resilience Orchestration
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-full bg-[#E1E8F0] p-1 gap-1 border border-[#D8DFE8]">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all cursor-pointer ${
                activeTab === "manage"
                  ? "bg-[#0B192C] text-white shadow-sm"
                  : "text-[#556B82] hover:text-[#0B192C]"
              }`}
            >
              Manage Active Tests ({exams.length})
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-5 py-2 rounded-full font-heading text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "create"
                  ? "btn-cyan !py-2 !px-5"
                  : "text-[#556B82] hover:text-[#0B192C]"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Create New Test</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MANAGE EXISTING EXAMS */}
        {activeTab === "manage" && (
          <div className="space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#0B192C]">{exams.length} Exams</div>
                  <div className="text-xs font-semibold text-[#556B82]">Published Under Faculty</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#0B192C]">3 Candidates</div>
                  <div className="text-xs font-semibold text-[#556B82]">Enrolled (Active Roster)</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">100% Verified</div>
                  <div className="text-xs font-semibold text-[#556B82]">SHA-256 Ledger Integrity</div>
                </div>
              </div>

              <div className="card-modern !p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] border border-[#00A8FF]/20 flex items-center justify-center text-[#00A8FF] shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[#00A8FF]">100Hz Buffering</div>
                  <div className="text-xs font-semibold text-[#556B82]">Enforced Protocol</div>
                </div>
              </div>
            </div>

            {/* List of Published Exams */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-[#0B192C]">
                  Assigned Examination Modules
                </h3>
                <span className="text-xs text-[#556B82] font-mono">
                  Students see ongoing tests live in their Exam Pod
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {exams.map((exam) => (
                  <div key={exam.id} className="card-modern !p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider bg-[#E6F5FF] px-2.5 py-0.5 rounded-full border border-[#00A8FF]/20">
                          {exam.code} • {exam.subject}
                        </span>
                        <h4 className="font-heading text-lg font-bold text-[#0B192C] mt-2 line-clamp-2">
                          {exam.title}
                        </h4>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shrink-0 ${
                          exam.status === "ongoing"
                            ? "bg-[#E6F5FF] text-[#00A8FF] border border-[#00A8FF]/30"
                            : "bg-[#F4F8FC] text-[#556B82] border border-[#E1E8F0]"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#556B82] space-y-1.5 border-t border-[#E1E8F0] pt-3">
                      <div className="flex justify-between">
                        <span>Duration / Points:</span>
                        <span className="font-bold text-[#0B192C]">{exam.duration} • {exam.totalPoints} Pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions Count:</span>
                        <span className="font-bold text-[#0B192C]">{exam.questions.length} Questions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned Roster:</span>
                        <span className="font-bold text-[#00A8FF]">{exam.assignedStudents.length} Students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resilience Protocol:</span>
                        <span className="font-bold text-[#0B192C]">{exam.protocol.telemetryRate} • {exam.protocol.rollbackSla}</span>
                      </div>
                    </div>

                    {/* Assigned Student Avatars */}
                    <div className="pt-2 border-t border-[#E1E8F0] flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        {exam.assignedStudents.map((stuId) => {
                          const stu = STUDENTS_DATA[stuId];
                          return (
                            <div
                              key={stuId}
                              title={stu?.name || stuId}
                              className="h-7 w-7 rounded-full bg-[#0B192C] text-white border-2 border-white flex items-center justify-center text-[10px] font-bold"
                            >
                              {stu?.avatarInitials || "ST"}
                            </div>
                          );
                        })}
                      </div>

                      <Link
                        href="/student"
                        className="text-xs font-bold text-[#00A8FF] hover:underline flex items-center gap-1"
                      >
                        <span>Preview in Pod</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CREATE & ASSIGN NEW TEST */}
        {activeTab === "create" && (
          <form onSubmit={handlePublishExam} className="space-y-6">
            
            {/* Step 1: Basic Info Card */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C] border-b border-[#E1E8F0] pb-4">
                <BookOpen className="h-5 w-5 text-[#00A8FF]" />
                <span>Step 1: Examination Identification & Metadata</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus, Raft State Engines & Byzantine Faults"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CS-580"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Subject / Field
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="60 Minutes">60 Minutes (1.0 Hour)</option>
                    <option value="90 Minutes">90 Minutes (1.5 Hours)</option>
                    <option value="120 Minutes">120 Minutes (2.0 Hours)</option>
                    <option value="180 Minutes">180 Minutes (3.0 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Deployment State
                  </label>
                  <select
                    value={examStatus}
                    onChange={(e) => setExamStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="ongoing">Ongoing (Live Now for Students)</option>
                    <option value="upcoming">Upcoming (Scheduled)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Dynamic Question Builder */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-[#E1E8F0] pb-4 gap-3">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C]">
                  <FileCode className="h-5 w-5 text-[#00A8FF]" />
                  <span>Step 2: Questions & Coding Challenges ({questions.length})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddQuestion("code")}
                    className="px-3.5 py-1.5 rounded-full border border-[#00A8FF] text-[#00A8FF] hover:bg-[#E6F5FF] text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add Code IDE Task
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddQuestion("mcq")}
                    className="px-3.5 py-1.5 rounded-full border border-[#0B192C] text-[#0B192C] hover:bg-[#F4F8FC] text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add MCQ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddQuestion("essay")}
                    className="px-3.5 py-1.5 rounded-full border border-[#556B82] text-[#556B82] hover:bg-[#F4F8FC] text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add Essay
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl border border-[#E1E8F0] bg-[#FAFCFE] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-full bg-[#00A8FF] text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[idx].title = e.target.value;
                            setQuestions(updated);
                          }}
                          className="font-heading font-bold text-base text-[#0B192C] bg-transparent border-b border-transparent hover:border-[#00A8FF] focus:border-[#00A8FF] focus:outline-none"
                        />
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#E6F5FF] text-[#00A8FF] font-bold">
                          {q.type.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 font-mono text-xs text-[#556B82]">
                          <span>Points:</span>
                          <input
                            type="number"
                            value={q.points}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].points = parseInt(e.target.value) || 0;
                              setQuestions(updated);
                            }}
                            className="w-14 rounded-lg border border-[#D8DFE8] bg-white p-1 text-center font-bold text-[#0B192C]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="p-1.5 text-[#556B82] hover:text-[#EF4444] transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#556B82] uppercase tracking-wider mb-1">
                        Question Prompt
                      </label>
                      <textarea
                        rows={2}
                        value={q.prompt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].prompt = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full rounded-xl border border-[#D8DFE8] bg-white p-3 text-xs text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                      />
                    </div>

                    {q.type === "code" && (
                      <div>
                        <label className="block text-[11px] font-mono font-bold text-[#00A8FF] uppercase tracking-wider mb-1">
                          Initial Code Template (Starter Code in IDE)
                        </label>
                        <textarea
                          rows={4}
                          value={q.codeTemplate || ""}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[idx].codeTemplate = e.target.value;
                            setQuestions(updated);
                          }}
                          className="w-full rounded-xl border border-[#1E3A5F] bg-[#07111E] p-3 text-xs font-mono text-[#E6F5FF] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Security & Resilience Protocol Configurator */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C] border-b border-[#E1E8F0] pb-4">
                <ShieldCheck className="h-5 w-5 text-[#00A8FF]" />
                <span>Step 3: Security & Autonomous Resilience Protocol</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Client Telemetry Buffering
                  </label>
                  <select
                    value={protocol.telemetryRate}
                    onChange={(e) => setProtocol({ ...protocol, telemetryRate: e.target.value as any })}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="100Hz">100Hz (10ms tick delta) • Standard</option>
                    <option value="50Hz">50Hz (20ms tick delta)</option>
                    <option value="200Hz">200Hz Ultra-High Density (5ms delta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Browser Lockdown Mode
                  </label>
                  <select
                    value={protocol.browserLockdown}
                    onChange={(e) => setProtocol({ ...protocol, browserLockdown: e.target.value as any })}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="Strict">Strict (Focus loss detection + auto snapshot)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Automated Rollback SLA
                  </label>
                  <select
                    value={protocol.rollbackSla}
                    onChange={(e) => setProtocol({ ...protocol, rollbackSla: e.target.value as any })}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="2.4s Guaranteed">2.4s Guaranteed Recovery</option>
                    <option value="1.8s Ultra-Fast">1.8s Ultra-Fast Edge Sync</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    Cryptographic Ledger
                  </label>
                  <select
                    value={protocol.cryptography}
                    onChange={(e) => setProtocol({ ...protocol, cryptography: e.target.value as any })}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="SHA-256 Merkle Chain">SHA-256 Merkle Chaining</option>
                    <option value="Kyber-1024 Post-Quantum">Kyber-1024 Post-Quantum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-2">
                    AI Anomaly Sensitivity
                  </label>
                  <select
                    value={protocol.aiRiskSensitivity}
                    onChange={(e) => setProtocol({ ...protocol, aiRiskSensitivity: e.target.value as any })}
                    className="w-full rounded-xl border border-[#D8DFE8] bg-[#F4F8FC] p-3 text-xs font-semibold text-[#0B192C] focus:border-[#00A8FF] focus:outline-none"
                  >
                    <option value="Balanced (0.75)">Balanced (0.75 Index)</option>
                    <option value="High (0.90)">High Sensitivity (0.90 Index)</option>
                    <option value="Permissive (0.60)">Permissive (0.60 Index)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Assign to Students Roster */}
            <div className="card-modern !p-6 sm:!p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-4">
                <div className="flex items-center gap-2 font-heading font-bold text-xl text-[#0B192C]">
                  <Users className="h-5 w-5 text-[#00A8FF]" />
                  <span>Step 4: Student Roster Assignment ({assignedStudentIds.length} Selected)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAssignedStudentIds(["STU-84920", "STU-84921", "STU-84922"])}
                  className="text-xs font-bold text-[#00A8FF] hover:underline cursor-pointer"
                >
                  Select All Students
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.values(STUDENTS_DATA).map((stu) => {
                  const isAssigned = assignedStudentIds.includes(stu.id);
                  return (
                    <div
                      key={stu.id}
                      onClick={() => toggleStudentAssignment(stu.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isAssigned
                          ? "border-[#00A8FF] bg-[#E6F5FF] shadow-sm ring-1 ring-[#00A8FF]"
                          : "border-[#E1E8F0] bg-white hover:border-[#00A8FF]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0B192C] text-white font-bold flex items-center justify-center text-xs">
                          {stu.avatarInitials}
                        </div>
                        <div>
                          <div className="font-heading font-bold text-sm text-[#0B192C]">
                            {stu.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#556B82]">
                            {stu.candidateNumber} • {stu.university.split(" ")[0]}
                          </div>
                        </div>
                      </div>

                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isAssigned ? "bg-[#00A8FF] border-[#00A8FF] text-white" : "border-[#C5D5E6]"
                      }`}>
                        {isAssigned && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("manage")}
                className="px-6 py-3.5 rounded-full border border-[#E1E8F0] bg-white font-heading text-xs font-bold text-[#556B82] hover:text-[#0B192C] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-cyan !py-3.5 !px-8 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Publish Test & Broadcast to Students</span>
              </button>
            </div>

          </form>
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

# 🚀 ReviveX — Autonomous Self-Healing Examination Platform

> **Predict failure. Preserve state. Verify integrity. Recover automatically.**

ReviveX is an AI-driven resilience platform for high-stakes online examinations. Instead of waiting for an examination session to fail and then restoring a periodic autosave, ReviveX continuously monitors session health, predicts elevated failure risk, dynamically increases state protection, and automatically recovers the latest **verified and consistent examination state**.

The key idea is:

```text
Traditional Exam System
        ↓
Failure
        ↓
Detect
        ↓
Restore Last Save


ReviveX
        ↓
Monitor
        ↓
Predict Risk
        ↓
Adaptive Protection
        ↓
Failure
        ↓
Verify
        ↓
Autonomous Recovery
```

---

# 🧠 What Makes ReviveX Different?

The system is organized around **four intelligence levels**:

### Level 1 — Preserve
Always protect the candidate's local state immediately on the client side.
```text
User Action
    ↓
Local State Engine
    ↓
IndexedDB
```

### Level 2 — Predict
Determine whether the session is becoming unstable using real-time telemetry.
```text
Telemetry
   ↓
Risk Engine
   ↓
Low / Medium / High / Critical
```

### Level 3 — Prepare
Protection becomes more aggressive as risk increases.
```text
Low Risk
   ↓
Normal Checkpointing

Medium Risk
   ↓
Frequent Checkpointing

High Risk
   ↓
Server Synchronization

Critical Risk
   ↓
Shadow Session Activation
```

### Level 4 — Recover
When failure occurs:
```text
Failure
   ↓
Checkpoint Discovery
   ↓
Integrity Verification (SHA-256)
   ↓
Consistency Verification
   ↓
Rollback
   ↓
Audit Log Creation
```

> **Core Philosophy**: Risk-adaptive autonomous recovery rather than simply AI-powered autosave.

---

# 🏗️ ReviveX — Phased Architecture

---

## 🟢 PHASE 1 — Resilient Exam Core

### Goal
Build a completely functional examination platform **without AI**. This is the rock-solid foundation that works independently.

### Architecture
```text
Student Browser
      │
      ▼
Exam Interface
      │
      ▼
Local State Engine
      │
      ▼
IndexedDB
      │
      ▼
Checkpoint Manager
      │
      ▼
Exam Server
```

### Features
* Student authentication & authorization
* Exam creation & question delivery
* Answer editor (Code, MCQ, Free Text)
* Synchronized exam timer
* Question navigation & flag system
* Local state persistence via IndexedDB
* Automatic periodic checkpoints
* Reconnection handling & offline mode
* Server state synchronization
* Final submission system

### Simulated Failure Scenarios
* Browser refresh / page reload
* Abrupt network disconnection
* Server drop / timeout
* Accidental tab closure
* Temporary offline operation

### Deliverable
> **Student loses connection → reconnects → answers are instantly recovered.**

---

## 🟡 PHASE 2 — Integrity & Verified Rollback

Make recovery **cryptographically trustworthy and consistent**.

### Architecture
```text
Checkpoint
    ↓
Canonical Serialization
    ↓
SHA-256 Hash
    ↓
Checkpoint Metadata
    ↓
Server
```

Each checkpoint data structure contains:
```text
Checkpoint ID
Session ID
Sequence Number
Timestamp
Exam State Payload
SHA-256 Hash
Session Token / Signature
```

### Recovery Pipeline
```text
Failure Detected
       ↓
Find candidate checkpoints
       ↓
Verify SHA-256 integrity
       ↓
Check sequence consistency
       ↓
Check session authentication
       ↓
Select latest valid checkpoint
       ↓
Restore state
       ↓
Create audit event
```

> **Key Rule**: *"Restore latest verified consistent checkpoint"* rather than merely *"Restore latest checkpoint"*.

### Audit Log Schema
Every recovery produces an unalterable audit record:
```text
Recovery ID
Session ID
Failure Type
Checkpoint Used
Risk Level
Recovery Reason
Timestamp
Integrity Status
Recovery Result
```

### Deliverable
> **Cryptographically verified, tamper-evident rollback engine.**

---

## 🟠 PHASE 3 — Predictive Failure Intelligence

Introduce explainable AI to detect anomalies before catastrophic failure occurs.

### Telemetry Signals Collected
```text
Network latency (RTT)
Packet loss / jitter
Request failure rate
Server response time
Reconnect frequency
Heartbeat failures
Browser memory pressure
CPU utilization
Sync queue size
Checkpoint delay
```

### Telemetry Pipeline
```text
Telemetry Collector
        ↓
Feature Extraction
        ↓
Risk Model (Logistic Regression / Random Forest)
        ↓
Failure Probability (0.0 - 1.0)
        ↓
Risk Classification (LOW / MEDIUM / HIGH / CRITICAL)
```

### Explainable Risk Output
```json
{
  "risk_score": 0.82,
  "risk_level": "HIGH",
  "reasons": [
    "network_latency_spike (>350ms)",
    "packet_loss_elevated (18%)",
    "reconnect_attempts_exceeded (3)"
  ]
}
```

---

## 🔵 PHASE 4 — Adaptive Protection Engine

Instead of applying uniform checkpointing overhead to every student, protection scales dynamically with risk.

### Risk-Adaptive Policy
| Risk Level | Protection Trigger | Action Taken |
| :--- | :--- | :--- |
| 🟢 **Low** | Baseline | Normal periodic checkpoint |
| 🟡 **Medium** | Elevated telemetry anomalies | Increased checkpoint frequency |
| 🟠 **High** | Sustained packet loss / latency | Aggressive server synchronization |
| 🔴 **Critical** | Imminent disconnect detected | On-demand shadow session activation |

### Hysteresis & Cooldown Controller
To prevent thrashing and false positives:
```text
Risk detected
     ↓
Risk persists?
     ↓
3 consecutive risky readings
     ↓
Activate escalated protection
     ↓
[Upon normal readings]
     ↓
Cooldown period observed
     ↓
Return to standard policy
```

### Deliverable
> **Stable students consume minimal resources; unstable sessions automatically receive escalated state protection.**

---

## 🟣 PHASE 5 — On-Demand Shadow Session

An efficient, scalable replica pattern activated only when failure probability is elevated.

> **On-Demand Shadow Session**: A synchronized lightweight replica of the examination session state used for rapid recovery during elevated-risk conditions.

### Selective Scalability
```text
1,000 Concurrent Students
       │
       ▼
Risk Monitoring
       │
       ├── 970 LOW (97%) ──→ No Shadow (Baseline)
       ├──  20 MEDIUM (2%) ──→ Enhanced Checkpointing
       └──  10 HIGH (1%) ──→ Shadow Session Activated
```

### Architecture
```text
                  Exam Session
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        Primary State      Shadow State (Replica)
              │                 │
              └────────┬────────┘
                       │
                 State Hash
                       │
                Consistency Check
```

When primary session crashes:
```text
Primary Failure ──→ Shadow Session ──→ Verify State ──→ Instant Recovery ──→ Resume Exam
```

---

## 🔴 PHASE 6 — Fault Injection Lab & Evaluation

An integrated **Admin Fault Injection Lab** for live demonstration and scientific benchmarking.

### Admin Fault Injection Controls
```text
┌────────────────────────────────────────┐
│         FAULT INJECTION LAB            │
├────────────────────────────────────────┤
│  [ Network Drop ]      [ High Latency ]│
│  [ Packet Loss ]       [ Server Drop ] │
│  [ Socket Disconnect ] [ Crash Sim ]   │
│  [ State Corruption ]                  │
└────────────────────────────────────────┘
```

### Purposes:
1. **Live Demonstration**: Deterministically induce failures during evaluation.
2. **ML Dataset Generation**: Generate labeled telemetry data (`Fault Injection → Telemetry Stream → Failure Label → ML Training`).

---

# 📊 End-to-End System Architecture

```text
                         ┌─────────────────────┐
                         │    Student Client   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Exam State Engine  │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
               IndexedDB                    Telemetry Engine
                     │                             │
                     │                             ▼
                     │                     Risk Prediction
                     │                             │
                     │                             ▼
                     │                     Risk Controller
                     │                             │
                     │               ┌─────────────┼─────────────┐
                     │               ▼             ▼             ▼
                     │             LOW          MEDIUM         HIGH
                     │               │             │             │
                     │          Normal Save    Fast Save    Shadow Session
                     │               │             │             │
                     └───────────────┴─────────────┴─────────────┘
                                             │
                                             ▼
                                      Checkpoint Manager
                                             │
                                             ▼
                                      SHA-256 Verification
                                             │
                                             ▼
                                      Consistency Engine
                                             │
                                             ▼
                                       Rollback Engine
                                             │
                                             ▼
                                         Exam Server
                                             │
                                             ▼
                                        Audit System
```

---

# 🧪 Scientific Evaluation Framework

ReviveX measures real resilience by comparing baseline autosave vs. risk-adaptive verified rollback:

| Metric | Traditional Baseline | ReviveX Adaptive Recovery |
| :--- | :--- | :--- |
| **Answer / Code Loss** | Measured under fault injection | Zero verified data loss |
| **Recovery Duration** | Measured experimentally | Benchmarked under fault scenarios |
| **Checkpoint Overhead** | High continuous cost | Scaled dynamically by risk score |
| **False Recovery Rate** | Prone to stale state | Filtered by sequence & hash checks |
| **Corruption Detection** | Undetected until submission | Immediate SHA-256 rejection |
| **Bandwidth Overhead** | Static periodic upload | Optimized on-demand |

---

# 🖥️ Dashboards

### 👨‍🎓 Student Dashboard
Clean, distraction-free interface with passive protection status indicator:
```text
┌──────────────────────────────────────────┐
│             REVIVEX EXAM                 │
├──────────────────────────────────────────┤
│ Question 17 / 50          ⏱ Time: 42:18 │
│                                          │
│ Your Answer / Code Workspace:            │
│ [......................................] │
│                                          │
│ ● State Protected  ● Connection: Stable  │
│ [ Previous ]                 [ Next ]    │
└──────────────────────────────────────────┘
```

### 🛡️ Admin & Reliability Control Center
High-visibility proctor cockpit with real-time risk triage:
```text
┌────────────────────────────────────────────────────────┐
│                REVIVEX CONTROL CENTER                  │
├─────────────┬─────────────┬──────────────┬─────────────┤
│  Sessions   │   At Risk   │ Recoveries   │ Failed      │
│    1,240    │     17      │      43      │    0        │
├─────────────┴─────────────┴──────────────┴─────────────┤
│ LIVE TELEMETRY: Latency | Packet Loss | ML Risk Score  │
│ ACTIVE RECOVERY EVENTS & AUDIT TRAIL                   │
└────────────────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

* **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Three.js / R3F (3D constellation telemetry), IndexedDB (Dexie/idb)
* **Backend**: Node.js, Fastify / Express, WebSockets, PostgreSQL, Redis
* **AI / Risk Intelligence**: Python, FastAPI, Scikit-learn, Pandas (Explainable Logistic Regression & Decision Trees)
* **Integrity**: Web Crypto API (SHA-256 HMAC & Canonical JSON serialization)

---

# 🗺️ Implementation Progression

```text
Phase 1: Can we preserve state reliably?
    ↓
Phase 2: Can we recover it safely and verify cryptographic consistency?
    ↓
Phase 3: Can we continuously detect connection & runtime instability?
    ↓
Phase 4: Can we predict failure using explainable ML?
    ↓
Phase 5: Can we dynamically adapt protection frequency to risk?
    ↓
Phase 6: Can we maintain an on-demand recovery replica only when needed?
    ↓
Phase 7: Can we scientifically benchmark and prove the improvement?
```

---

# 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

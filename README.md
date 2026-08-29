<div align="center">

# ✦ CREWSENSE AI

### **Autonomous Workforce Intelligence & Team Optimization Platform**

*Observe → Analyze → Predict → Simulate → Recommend → Monitor*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Neo4j](https://img.shields.io/badge/Neo4j-Graph_Engine-008CC1?style=for-the-badge&logo=neo4j)](https://neo4j.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🌟 Executive Summary

**CrewSense AI** is a production-grade enterprise workforce intelligence system that transforms team management from reactive fire-fighting to proactive, data-driven optimization. 

Unlike conventional project management tools that only show task completion checklists, CrewSense AI operates as an **Autonomous Intelligence Layer**:
1. **Uncovers Shadow Work**: Detects hidden communication overhead, meeting bloat, and undocumented context-switching.
2. **Calculates True Effective Capacity**: Models actual productive coding/focus hours per employee.
3. **Graph Dependency Traversal**: Identifies single points of failure, bottleneck developers, and critical paths before deadlines slip.
4. **Interactive What-If Simulations**: Allows managers to simulate task reassignment, skill swaps, and scope changes with instant workload and risk delta recalculations.
5. **AI Agent Copilot**: Grounded conversational intelligence powered by Groq (Llama 3.3) and Google Gemini with direct tool calling and zero hallucinations.

---

## 🏗️ Architecture & Monorepo Structure

CrewSense AI is architected as a clean fullstack monorepo:

```
CrewSense-AI/
├── 📁 frontend/                     # Next.js 16 (App Router) + TypeScript + Tailwind v4
│   ├── 📁 src/
│   │   ├── 📁 app/                  # 23 Pages (Manager Command Center + Employee Hub)
│   │   ├── 📁 components/           # Neo-Brutalist UI system, interactive charts & drawers
│   │   ├── 📁 hooks/                # Real-time state hooks & notification polling
│   │   └── 📁 lib/                  # FastAPI typed client & resilient local engine fallback
│   ├── 📁 public/                   # Static assets & illustrations
│   └── 📄 package.json              # Frontend dependencies (@xyflow/react, recharts, framer-motion)
│
├── 📁 backend/                      # High-performance Python FastAPI async server
│   ├── 📁 app/
│   │   ├── 📁 api/routes/           # 60+ REST endpoints (Auth, Team, Projects, Workload, etc.)
│   │   ├── 📁 intelligence/         # 9 deterministic analytical computation engines
│   │   ├── 📁 agent/                # Multi-model AI agent with schema-validated tool calling
│   │   ├── 📁 models/               # SQLAlchemy async ORM relational models
│   │   ├── 📁 schemas/              # Pydantic request/response validation contracts
│   │   ├── 📁 db/                   # Neon PostgreSQL (SSL) + Neo4j Graph DB connectors
│   │   └── 📁 core/                 # JWT security, config, and structured JSON logging
│   ├── 📁 seed/                     # Seed pipeline: 24 employees, 6 projects, 57 tasks, 24 skills
│   ├── 📁 tests/                    # Pytest unit & integration test suite (100% passing)
│   └── 📄 requirements.txt          # Backend dependencies
│
├── 🐳 docker-compose.yml            # PostgreSQL & Neo4j local infrastructure
├── 📄 package.json                  # Root monorepo command runner
└── 📖 README.md                     # Documentation
```

---

## ⚡ Core Features & Intelligence Engines

### 1. 🔍 Deterministic Intelligence Suite
All numbers and risk scores are mathematically grounded by specialized calculation engines:
- **Workload Engine**: Computes assigned task hours, meeting overhead, and shadow work multipliers.
- **Shadow Work Engine**: Uncovers hidden coordination drag and context-switching penalties.
- **Effective Capacity Engine**: Derives actual productive bandwidth per employee.
- **Skill Engine & Matrix**: Skill proficiency matrix (1-5) and automated project team matching.
- **Bottleneck & Critical Path Engine**: Graph-based topological sort to calculate zero-float critical paths.
- **Risk Engine**: Multi-factor project delay probability and delivery risk modeling.
- **Optimization Engine**: Constraint-satisfaction algorithms suggesting optimal task transfers.

### 2. 🤖 AI Agent Copilot (Grounded Tool Calling)
- Powered by **Groq LLaMA 3.3 70B** and **Google Gemini 2.5 Flash**.
- Equipped with deterministic tools: `get_employee_workload`, `get_project_critical_path`, `run_simulation`, `get_team_skill_matrix`.
- Strictly enforces grounded facts — prevents hallucinated employee metrics.

### 3. 🧪 Interactive What-If Scenario Simulations
- Test team adjustments before applying them:
  - *What happens if we reassign Payment Integration from Rahul to Priya?*
  - *What happens if Arjun goes on leave for 5 days during sprint 4?*
- Live side-by-side comparison of **Workload Delta**, **Risk Delta**, and **Projected Completion Date**.

### 4. 🎨 Neo-Brutalism Design Aesthetics
- High-contrast, sharp border aesthetics with vibrant accents (`#FF9ECF` Pink, `#4F7DF9` Blue, `#FFE853` Yellow).
- Smooth micro-interactions powered by **Framer Motion**.
- Interactive dependency graph visualization using **React Flow / @xyflow/react**.
- Real-time responsive charts using **Recharts**.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: `v20+` & `npm`
- **Python**: `3.11+` or `3.13+`
- **PostgreSQL**: Cloud Neon database (configured) or local instance

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/ParthYendhe0679/CrewSense-AI-.git
cd CrewSense-AI-
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration (`backend/.env`)
Create `backend/.env` (or use `backend/.env.example`):
```env
APP_ENV=development

# PostgreSQL Database (Neon Cloud or Local)
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-broad-leaf-acac3aar.sa-east-1.aws.neon.tech/neondb?sslmode=require

# Neo4j Graph Database (Optional, fallback provided)
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=crewsense

# AI Providers (Optional - deterministic fallback operates without keys)
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Authentication
JWT_SECRET=crewsense-super-secure-production-jwt-secret-key-2026
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Configuration (`frontend/.env.local`)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

### Step 3: Install Dependencies

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Install backend dependencies
cd ../backend
pip install -r requirements.txt
cd ..
```

---

### Step 4: Seed the Database
Populate Neon PostgreSQL with the full enterprise dataset (24 employees, 6 projects, 57 tasks, 18 dependencies):
```bash
npm run seed:backend
```

---

### Step 5: Start the Fullstack Application

#### Terminal 1 — Start FastAPI Backend
```bash
npm run dev:backend
```
> API Server running at: **`http://localhost:8000`**  
> Interactive OpenAPI Docs: **`http://localhost:8000/docs`**

#### Terminal 2 — Start Next.js Frontend
```bash
npm run dev
```
> Web Application running at: **`http://localhost:3000`**

---

## 🔑 Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Manager** | `alex@crewsense.ai` | `demo123` | Full Manager Suite, Team Optimization, Simulation Engine |
| **Employee** | `rahul@crewsense.ai` | `demo123` | Personal Dashboard, Capacity View, Task Assignments |

---

## 🧪 Testing & Verification

Run the comprehensive pytest test suite covering auth, workload calculations, critical paths, risk engines, and candidate matching:

```bash
npm run test:backend
```

```
backend/tests/test_auth.py::test_demo_login_success PASSED
backend/tests/test_auth.py::test_login_invalid_password PASSED
backend/tests/test_dependencies.py::test_critical_path PASSED
backend/tests/test_risk.py::test_project_delivery_risk PASSED
backend/tests/test_simulation.py::test_simulation_api PASSED
backend/tests/test_simulation.py::test_agent_chat_api PASSED
backend/tests/test_skills.py::test_candidate_matching PASSED
backend/tests/test_skills.py::test_skill_gap_detection PASSED
backend/tests/test_workload.py::test_workload_calculation PASSED

======================= 9 passed in 1.03s =======================
```

---

## 🧭 Navigation & Page Directory

### Manager Command Center
- **Dashboard (`/manager/dashboard`)**: High-level KPIs, capacity breakdown, critical alerts, and live activity stream.
- **Workload Intelligence (`/manager/workload`)**: Workload distribution, shadow work analysis, and burnout prediction.
- **Team Roster (`/manager/team`)**: Detailed employee profiles, skill tags, and workload drawer.
- **Project Control (`/manager/projects`)**: Delivery risk forecasting, deadline tracking, and health metrics.
- **Task Management (`/manager/tasks`)**: Kanban board with risk indicators and AI re-assignment suggestions.
- **Critical Path Graph (`/manager/dependencies`)**: Interactive React Flow dependency diagram and bottleneck detection.
- **Skill Matrix (`/manager/skills`)**: Team-wide skill heatmaps, deficit alerts, and AI hiring suggestions.
- **What-If Simulations (`/manager/simulations`)**: Sandbox to simulate organizational changes and compare outcomes.
- **Recommendations (`/manager/recommendations`)**: Actionable AI optimizations with one-click approval workflows.
- **AI Copilot (`/manager/agent`)**: Natural language chat interface with deterministic reasoning tools.

### Employee Hub
- **My Dashboard (`/employee/dashboard`)**: Personal workload health, weekly focus breakdown, and meetings.
- **My Tasks (`/employee/tasks`)**: Priority-sorted tasks with deadline urgency.
- **My Projects (`/employee/projects`)**: Active project contributions and milestones.
- **My Profile (`/employee/profile`)**: Skill endorsements, proficiency levels, and availability preferences.
- **Notifications (`/employee/notifications`)**: Real-time assignment updates and capacity alerts.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with precision for modern high-velocity engineering teams.</sub>
</div>

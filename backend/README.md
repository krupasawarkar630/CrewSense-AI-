# CrewSense AI — Production Backend

CrewSense AI is an **AI Workforce Intelligence and Resource Optimization Agent**.

---

## Architecture Overview

- **Web Framework**: FastAPI (Async Python 3.10+)
- **Primary Database**: PostgreSQL (Async SQLAlchemy + asyncpg)
- **Relationship Database**: Neo4j (Graph traversal & critical path analysis)
- **AI Reasoning**: Groq API (Interactive speed) + Google Gemini API (Deep context)
- **Intelligence Engines**:
  1. `workload_engine.py` — Visible vs. Shadow vs. Effective vs. Projected Workload
  2. `shadow_work_engine.py` — Meetings, reviews, coordination, and context switching overhead
  3. `capacity_engine.py` — Dynamic headroom calculation
  4. `skill_engine.py` — Candidate matching & organizational skill gap detection
  5. `dependency_engine.py` — Pipeline graph & blocked state analysis
  6. `bottleneck_engine.py` — Downstream cascades and single points of failure
  7. `critical_path_engine.py` — Project DAG longest path computation
  8. `risk_engine.py` — Multi-factor project delivery risk & health score
  9. `optimization_engine.py` — Global heuristic team rebalancing

---

## Getting Started

### 1. Start Databases via Docker Compose
```bash
docker compose up -d
```

### 2. Install Python Dependencies
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and configure your keys:
```bash
cp .env.example .env
```

### 4. Seed the Database
```bash
python -m seed.seed_data
```

### 5. Run the Backend Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 6. Interactive Documentation
- OpenAPI Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc UI: [http://localhost:8000/redoc](http://localhost:8000/redoc)

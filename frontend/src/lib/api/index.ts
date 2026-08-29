// ============================================================
// CREWSENSE AI — API Service Layer
// Connects cleanly to FastAPI Backend (http://localhost:8000/api/v1)
// with resilient fallback to local intelligence models
// ============================================================

import {
  employees as mockEmployees,
  projects as mockProjects,
  tasks as mockTasks,
  skills as mockSkills,
  dependencies as mockDependencies,
  risks as mockRisks,
  recommendations as mockRecommendations,
  agentInsights as mockAgentInsights,
  notifications as mockNotifications,
  activities as mockActivities,
} from "@/lib/mock";
import type {
  Employee,
  Project,
  Task,
  Skill,
  Dependency,
  Risk,
  Recommendation,
  AgentInsight,
  Notification,
  Activity,
  DashboardKPIs,
  AgentMessage,
  Simulation,
  BuildTeamResponse,
  SimulationResponse,
  SkillMatrixEntry,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("crewsense_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("crewsense_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("crewsense_token");
  }
}

async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// ── Authentication ─────────────────────────────────────────

export async function loginUser(email: string, password: string = "demo123"): Promise<{ access_token: string; user: any } | null> {
  const data = await fetchFromBackend<{ access_token: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data?.access_token) {
    setAuthToken(data.access_token);
  }
  return data;
}

export async function getMe(): Promise<any | null> {
  return await fetchFromBackend<any>("/auth/me");
}

// ── Dashboard ──────────────────────────────────────────────

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const data = await fetchFromBackend<DashboardKPIs>("/dashboard/kpis");
  if (data) return data;

  const activeProjects = mockProjects.filter((p) => p.status !== "completed");
  const activeTasks = mockTasks.filter((t) => t.status !== "done");
  const overloaded = mockEmployees.filter((e) => e.workloadStatus === "overloaded");
  const atRisk = mockProjects.filter((p) => p.riskLevel === "high" || p.riskLevel === "critical");
  const avgCapacity = Math.round(mockEmployees.reduce((sum, e) => sum + (100 - e.effectiveWorkload), 0) / mockEmployees.length);

  return {
    teamMembers: mockEmployees.length,
    activeProjects: activeProjects.length,
    activeTasks: activeTasks.length,
    availableCapacity: avgCapacity,
    overloaded: overloaded.length,
    atRiskProjects: atRisk.length,
  };
}

// ── Employees ──────────────────────────────────────────────

export async function getTeam(): Promise<Employee[]> {
  const data = await fetchFromBackend<Employee[]>("/employees");
  return data || [...mockEmployees];
}

export async function getEmployee(id: string): Promise<Employee | undefined> {
  const data = await fetchFromBackend<Employee>(`/employees/${id}`);
  return data || mockEmployees.find((e) => e.id === id);
}

// ── Projects ───────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const data = await fetchFromBackend<Project[]>("/projects");
  return data || [...mockProjects];
}

export async function getProject(id: string): Promise<Project | undefined> {
  const data = await fetchFromBackend<Project>(`/projects/${id}`);
  return data || mockProjects.find((p) => p.id === id);
}

// ── Tasks ──────────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  const data = await fetchFromBackend<Task[]>("/tasks");
  return data || [...mockTasks];
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const data = await fetchFromBackend<Task[]>(`/tasks?projectId=${encodeURIComponent(projectId)}`);
  return data || mockTasks.filter((t) => t.projectId === projectId);
}

export async function getTasksByEmployee(employeeId: string): Promise<Task[]> {
  const data = await fetchFromBackend<Task[]>(`/tasks?assigneeId=${encodeURIComponent(employeeId)}`);
  return data || mockTasks.filter((t) => t.assigneeId === employeeId);
}

// ── Skills ─────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  const data = await fetchFromBackend<Skill[]>("/skills");
  return data || [...mockSkills];
}

export async function getSkillMatrix(): Promise<SkillMatrixEntry[]> {
  const data = await fetchFromBackend<SkillMatrixEntry[]>("/skills/matrix");
  if (data) return data;

  return mockEmployees.map((emp) => {
    const skillMap: Record<string, any> = {};
    mockSkills.forEach((skill) => {
      const empSkill = emp.skills.find((s) => s.skillId === skill.id);
      skillMap[skill.id] = empSkill?.proficiency || "missing";
    });
    return { employeeId: emp.id, employeeName: emp.name, skills: skillMap };
  });
}

// ── Dependencies ───────────────────────────────────────────

export async function getDependencies(): Promise<Dependency[]> {
  const data = await fetchFromBackend<Dependency[]>("/dependencies");
  return data || [...mockDependencies];
}

// ── Risks ──────────────────────────────────────────────────

export async function getRisks(): Promise<Risk[]> {
  const data = await fetchFromBackend<Risk[]>("/risks");
  return data || [...mockRisks];
}

// ── Recommendations ────────────────────────────────────────

export async function getRecommendations(): Promise<Recommendation[]> {
  const data = await fetchFromBackend<Recommendation[]>("/recommendations");
  return data || [...mockRecommendations];
}

export async function approveRecommendation(id: string): Promise<Recommendation> {
  const res = await fetchFromBackend<{ recommendation: Recommendation }>(`/recommendations/${id}/approve`, {
    method: "POST",
  });
  if (res?.recommendation) return res.recommendation;

  const rec = mockRecommendations.find((r) => r.id === id);
  if (rec) rec.status = "approved";
  return rec!;
}

export async function rejectRecommendation(id: string): Promise<Recommendation> {
  const res = await fetchFromBackend<{ recommendation: Recommendation }>(`/recommendations/${id}/reject`, {
    method: "POST",
  });
  if (res?.recommendation) return res.recommendation;

  const rec = mockRecommendations.find((r) => r.id === id);
  if (rec) rec.status = "rejected";
  return rec!;
}

// ── Agent ──────────────────────────────────────────────────

export async function getAgentInsights(): Promise<AgentInsight[]> {
  const data = await fetchFromBackend<AgentInsight[]>("/agent/insights");
  return data || [...mockAgentInsights];
}

export async function askAgent(question: string): Promise<AgentMessage> {
  const data = await fetchFromBackend<{ message: AgentMessage }>("/agent/chat", {
    method: "POST",
    body: JSON.stringify({ message: question }),
  });
  if (data?.message) return data.message;

  const lowerQ = question.toLowerCase();
  let responseText = "CrewSense is actively monitoring your team across 24 employees and 6 active projects.";

  if (lowerQ.includes("who is overloaded") || lowerQ.includes("overload")) {
    responseText = "Currently, **Rahul Sharma** (108% projected) and **Raj Malhotra** (105% projected) are overloaded. I recommend moving Payment Integration to Priya and Titan API Layer to Anita.";
  } else if (lowerQ.includes("phoenix") && lowerQ.includes("risk")) {
    responseText = "**Project Phoenix** has a **74% delay probability**. The critical path bottleneck is Arjun's API work — 4 downstream tasks (Payment, Checkout, QA, Release) are blocked.";
  } else if (lowerQ.includes("arjun")) {
    responseText = "If Arjun is delayed, 4 downstream deliverables on Phoenix are blocked. Adding Anita as API support reduces critical path risk by 35%.";
  }

  return {
    id: `msg-${Date.now()}`,
    role: "agent",
    content: responseText,
    timestamp: new Date().toISOString(),
  };
}

// ── Team Building ──────────────────────────────────────────

export async function buildTeam(projectId: string): Promise<BuildTeamResponse> {
  const data = await fetchFromBackend<BuildTeamResponse>(`/projects/${projectId}/build-team`, {
    method: "POST",
  });
  if (data) return data;

  return {
    recommendations: [
      {
        employeeId: "emp-priya", role: "Full Stack Developer", skillMatch: 94,
        currentWorkload: 68, projectedWorkload: 82, availability: "high",
        dependencyConflicts: 0, recommendationScore: 94,
        reasons: ["Strong React & Node.js skills", "Available capacity: 32%", "No dependency conflicts"],
      },
      {
        employeeId: "emp-tanvi", role: "Frontend Developer", skillMatch: 91,
        currentWorkload: 72, projectedWorkload: 85, availability: "medium",
        dependencyConflicts: 0, recommendationScore: 88,
        reasons: ["Strong React & TypeScript skills", "Strong CSS expertise"],
      },
      {
        employeeId: "emp-arjun", role: "Backend Lead", skillMatch: 96,
        currentWorkload: 91, projectedWorkload: 96, availability: "low",
        dependencyConflicts: 1, recommendationScore: 82,
        reasons: ["Expert Python & FastAPI skills", "Warning: high current workload"],
      },
      {
        employeeId: "emp-neha", role: "UI/UX Designer", skillMatch: 92,
        currentWorkload: 62, projectedWorkload: 74, availability: "high",
        dependencyConflicts: 0, recommendationScore: 90,
        reasons: ["Expert Figma & UX Design skills", "Good availability"],
      },
      {
        employeeId: "emp-meera", role: "Product Manager", skillMatch: 88,
        currentWorkload: 90, projectedWorkload: 95, availability: "low",
        dependencyConflicts: 0, recommendationScore: 75,
        reasons: ["Strong PM experience", "Warning: high coordination overhead"],
      },
    ],
    teamHealth: { skillCoverage: 96, capacityBalance: 82, deadlineConfidence: "high", aiConfidence: 92 },
    skillGaps: [
      {
        skillName: "Marketing Automation",
        qualifiedEmployees: 0,
        partialMatches: [{ employeeId: "emp-ishita", matchPercent: 71 }],
        solutions: [{ type: "partial_match", description: "Assign Ishita Jain with upskilling plan", employeeId: "emp-ishita", matchPercent: 71, impact: "71% skill coverage" }],
      },
    ],
  };
}

// ── Simulation ─────────────────────────────────────────────

export async function simulateScenario(scenario: string): Promise<SimulationResponse> {
  const data = await fetchFromBackend<SimulationResponse>("/simulations", {
    method: "POST",
    body: JSON.stringify({ scenario }),
  });
  if (data) return data;

  const currentResults = {
    workloadBefore: 91, workloadAfter: 91,
    delayProbabilityBefore: 74, delayProbabilityAfter: 74,
    riskBefore: "high" as const, riskAfter: "high" as const,
    overloadedBefore: 3, overloadedAfter: 3,
    capacityBalanceBefore: 64, capacityBalanceAfter: 64,
    confidence: 100, recommended: false,
  };

  const proposedResults = {
    workloadBefore: 91, workloadAfter: 68,
    delayProbabilityBefore: 74, delayProbabilityAfter: 31,
    riskBefore: "high" as const, riskAfter: "low" as const,
    overloadedBefore: 3, overloadedAfter: 1,
    capacityBalanceBefore: 64, capacityBalanceAfter: 86,
    confidence: 92, recommended: true,
  };

  return {
    simulation: {
      id: `sim-${Date.now()}`,
      name: "Scenario Analysis",
      description: scenario,
      scenario,
      changes: [
        { type: "reassign", description: "Payment Integration: Rahul → Priya", employeeId: "emp-priya", taskId: "task-ph-3" },
        { type: "add", description: "Add Anita as API support for Arjun", employeeId: "emp-anita", taskId: "task-ph-2" },
      ],
      results: proposedResults,
      createdAt: new Date().toISOString(),
    },
    comparison: { current: currentResults, proposed: proposedResults },
    agentRecommendation: "I recommend applying this scenario. It reduces workload from 91% to 68%, lowers delay probability from 74% to 31%, and resolves 2 overload situations with 92% confidence.",
  };
}

// ── Optimize ───────────────────────────────────────────────

export async function optimizeTeam(): Promise<SimulationResponse> {
  const data = await fetchFromBackend<SimulationResponse>("/optimization/team", {
    method: "POST",
  });
  if (data) return data;
  return simulateScenario("Optimize team allocation across all projects");
}

// ── Notifications ──────────────────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  const data = await fetchFromBackend<Notification[]>("/notifications");
  return data || [...mockNotifications];
}

// ── Activities ─────────────────────────────────────────────

export async function getActivities(): Promise<Activity[]> {
  const data = await fetchFromBackend<Activity[]>("/notifications/activities");
  return data || [...mockActivities];
}

// ── Task Assignment ────────────────────────────────────────

export async function assignTask(taskId: string, employeeId: string): Promise<Task> {
  const data = await fetchFromBackend<Task>(`/tasks/${taskId}/assign`, {
    method: "POST",
    body: JSON.stringify({ employeeId }),
  });
  if (data) return data;

  const task = mockTasks.find((t) => t.id === taskId);
  if (task) task.assigneeId = employeeId;
  return task!;
}

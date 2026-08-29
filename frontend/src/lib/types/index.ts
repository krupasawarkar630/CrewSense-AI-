// ============================================================
// CREWSENSE AI — TypeScript Data Models
// API-ready interfaces for FastAPI JSON responses
// ============================================================

// ── Enums ──────────────────────────────────────────────────

export type Role = "manager" | "employee";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "review" | "done";
export type TaskPriority = "critical" | "high" | "medium" | "low";

export type RiskLevel = "critical" | "high" | "medium" | "low" | "none";
export type RiskCategory = "workload" | "deadline" | "dependency" | "skill" | "capacity";

export type WorkloadStatus = "healthy" | "watch" | "high_load" | "overloaded";

export type SkillProficiency = "strong" | "moderate" | "weak" | "missing";

export type RecommendationStatus = "pending" | "approved" | "rejected" | "simulated";
export type RecommendationType =
  | "reassign_task"
  | "add_resource"
  | "rebalance"
  | "skill_gap"
  | "dependency_resolution"
  | "deadline_adjustment";

export type ProjectStatus = "active" | "planning" | "at_risk" | "completed" | "on_hold";

export type InsightSeverity = "critical" | "warning" | "info" | "success";

// ── Core Models ────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  email: string;
  skills: EmployeeSkill[];
  currentProjects: string[];
  visibleWorkload: number;
  shadowWorkload: number;
  effectiveWorkload: number;
  projectedWorkload: number;
  capacity: number;
  availability: "high" | "medium" | "low";
  workloadStatus: WorkloadStatus;
  joinedDate: string;
}

export interface EmployeeSkill {
  skillId: string;
  proficiency: SkillProficiency;
  yearsOfExperience: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  demand: number; // how many projects need this skill
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: TaskPriority;
  progress: number;
  startDate: string;
  deadline: string;
  projectedCompletion: string;
  delayProbability: number;
  riskLevel: RiskLevel;
  teamMembers: string[];
  taskIds: string[];
  healthScore: number;
  requiredSkills: string[];
  budget?: number;
  client?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  effort: number; // hours
  estimatedDays: number;
  dependencies: string[];
  blockedBy: string[];
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface Dependency {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  type: "blocks" | "depends_on" | "related";
  isCritical: boolean;
  status: "resolved" | "active" | "blocked";
  impact: string;
}

export interface WorkloadData {
  employeeId: string;
  date: string;
  visibleWorkload: number;
  shadowWorkload: number;
  effectiveWorkload: number;
  projectedWorkload: number;
  capacity: number;
}

export interface Risk {
  id: string;
  category: RiskCategory;
  severity: RiskLevel;
  title: string;
  description: string;
  affectedProjectId?: string;
  affectedEmployeeId?: string;
  affectedTaskId?: string;
  probability: number;
  impact: string;
  detectedAt: string;
  recommendation?: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  reason: string;
  affectedEmployeeId?: string;
  affectedTaskId?: string;
  affectedProjectId?: string;
  fromEmployeeId?: string;
  toEmployeeId?: string;
  expectedImpact: {
    workloadChange?: number;
    riskReduction?: number;
    delayReduction?: number;
    capacityImprovement?: number;
  };
  confidence: number;
  status: RecommendationStatus;
  createdAt: string;
}

export interface Simulation {
  id: string;
  name: string;
  description: string;
  scenario: string;
  changes: SimulationChange[];
  results: SimulationResults;
  createdAt: string;
}

export interface SimulationChange {
  type: "reassign" | "remove" | "add" | "deadline_change";
  description: string;
  employeeId?: string;
  taskId?: string;
  projectId?: string;
  value?: string;
}

export interface SimulationResults {
  workloadBefore: number;
  workloadAfter: number;
  delayProbabilityBefore: number;
  delayProbabilityAfter: number;
  riskBefore: RiskLevel;
  riskAfter: RiskLevel;
  overloadedBefore: number;
  overloadedAfter: number;
  capacityBalanceBefore: number;
  capacityBalanceAfter: number;
  confidence: number;
  recommended: boolean;
}

export interface AgentInsight {
  id: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  category: RiskCategory;
  relatedEntityId?: string;
  relatedEntityType?: "employee" | "project" | "task";
  actionLabel?: string;
  actionRoute?: string;
  timestamp: string;
}

export interface AgentMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  timestamp: string;
  insights?: AgentInsight[];
  recommendations?: Recommendation[];
  isAnalyzing?: boolean;
  analysisSteps?: AnalysisStep[];
}

export interface AnalysisStep {
  label: string;
  status: "pending" | "in_progress" | "completed";
}

export interface Notification {
  id: string;
  type: "risk" | "recommendation" | "capacity" | "deadline" | "update";
  title: string;
  description: string;
  severity: InsightSeverity;
  read: boolean;
  actionRoute?: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  type: "agent_detection" | "approval" | "deadline_change" | "dependency_blocked" | "risk_update" | "task_reassignment";
  title: string;
  description: string;
  timestamp: string;
  relatedEntityId?: string;
  relatedEntityType?: "employee" | "project" | "task";
}

// ── Team Building ──────────────────────────────────────────

export interface TeamRequirement {
  role: string;
  count: number;
  requiredSkills: string[];
  experienceLevel?: "junior" | "mid" | "senior";
}

export interface TeamRecommendation {
  employeeId: string;
  role: string;
  skillMatch: number;
  currentWorkload: number;
  projectedWorkload: number;
  availability: "high" | "medium" | "low";
  dependencyConflicts: number;
  recommendationScore: number;
  reasons: string[];
}

export interface TeamHealth {
  skillCoverage: number;
  capacityBalance: number;
  deadlineConfidence: "high" | "medium" | "low";
  aiConfidence: number;
}

export interface SkillGap {
  skillName: string;
  qualifiedEmployees: number;
  partialMatches: { employeeId: string; matchPercent: number }[];
  solutions: SkillGapSolution[];
}

export interface SkillGapSolution {
  type: "partial_match" | "add_capacity" | "change_requirement";
  description: string;
  employeeId?: string;
  matchPercent?: number;
  impact: string;
}

// ── API Response Types ─────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

export interface AgentChatResponse {
  message: AgentMessage;
  updatedInsights?: AgentInsight[];
}

export interface BuildTeamResponse {
  recommendations: TeamRecommendation[];
  teamHealth: TeamHealth;
  skillGaps: SkillGap[];
}

export interface SimulationResponse {
  simulation: Simulation;
  comparison: {
    current: SimulationResults;
    proposed: SimulationResults;
  };
  agentRecommendation: string;
}

// ── Dashboard ──────────────────────────────────────────────

export interface DashboardKPIs {
  teamMembers: number;
  activeProjects: number;
  activeTasks: number;
  availableCapacity: number;
  overloaded: number;
  atRiskProjects: number;
}

// ── Skill Matrix ───────────────────────────────────────────

export interface SkillMatrixEntry {
  employeeId: string;
  employeeName: string;
  skills: Record<string, SkillProficiency>;
}

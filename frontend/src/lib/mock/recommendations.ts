import { Risk, Recommendation, AgentInsight, Notification, Activity } from "@/lib/types";

export const risks: Risk[] = [
  {
    id: "risk-1", category: "workload", severity: "critical", title: "Rahul at 108% Projected Capacity",
    description: "Rahul Sharma is projected to exceed capacity next week due to overlapping Phoenix and Titan tasks.",
    affectedEmployeeId: "emp-rahul", affectedProjectId: "proj-phoenix",
    probability: 92, impact: "Delivery delays on Product Catalog UI and Titan dashboard", detectedAt: "2025-08-29T08:00:00Z",
    recommendation: "Move Payment Integration to Priya",
  },
  {
    id: "risk-2", category: "deadline", severity: "high", title: "Phoenix 74% Delay Probability",
    description: "Project Phoenix has a 74% probability of missing its September 18 deadline due to API bottleneck and cascading dependencies.",
    affectedProjectId: "proj-phoenix",
    probability: 74, impact: "3-day projected delay affecting client delivery", detectedAt: "2025-08-29T08:00:00Z",
    recommendation: "Add API development support for Arjun",
  },
  {
    id: "risk-3", category: "dependency", severity: "high", title: "Arjun — Critical Bottleneck",
    description: "4 downstream tasks depend on Arjun's API work. A 2-day delay on API will cascade to a 3-day project delay.",
    affectedEmployeeId: "emp-arjun", affectedProjectId: "proj-phoenix", affectedTaskId: "task-ph-2",
    probability: 68, impact: "Payment, Checkout, QA, and Release all blocked", detectedAt: "2025-08-29T08:00:00Z",
    recommendation: "Consider adding Anita as API support",
  },
  {
    id: "risk-4", category: "skill", severity: "medium", title: "Apollo Marketing Automation Skill Gap",
    description: "Project Apollo requires Marketing Automation skills but no team member has strong proficiency.",
    affectedProjectId: "proj-apollo",
    probability: 85, impact: "Marketing automation integration may be delayed or low quality", detectedAt: "2025-08-29T08:00:00Z",
    recommendation: "Assign to Ishita (partial match 71%) or add external resource",
  },
  {
    id: "risk-5", category: "workload", severity: "high", title: "Raj at 105% Projected Capacity",
    description: "Raj Malhotra is projected to exceed capacity due to Phoenix and Titan responsibilities plus leadership overhead.",
    affectedEmployeeId: "emp-raj",
    probability: 78, impact: "Performance optimization and API layer delivery at risk", detectedAt: "2025-08-29T08:00:00Z",
    recommendation: "Reassign Titan API Layer to Anita",
  },
  {
    id: "risk-6", category: "capacity", severity: "medium", title: "Kavita — Excessive Shadow Work",
    description: "Kavita is managing 3 projects with significant coordination overhead. Shadow workload at 22%.",
    affectedEmployeeId: "emp-kavita",
    probability: 65, impact: "Reduced effectiveness across all managed projects", detectedAt: "2025-08-29T08:00:00Z",
    recommendation: "Consider redistributing one project to another Scrum Master",
  },
  {
    id: "risk-7", category: "deadline", severity: "medium", title: "Titan 42% Delay Probability",
    description: "Project Titan has moderate delay risk due to ML pipeline complexity and infrastructure dependencies.",
    affectedProjectId: "proj-titan",
    probability: 42, impact: "3-day projected delay on ML platform delivery", detectedAt: "2025-08-29T08:00:00Z",
  },
  {
    id: "risk-8", category: "dependency", severity: "medium", title: "Orion Scanner — 2 Tasks Blocked",
    description: "Compliance reporting and API security are waiting on vulnerability scanner completion.",
    affectedProjectId: "proj-orion", affectedTaskId: "task-or-1",
    probability: 45, impact: "Delayed compliance and security features", detectedAt: "2025-08-29T08:00:00Z",
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-1", type: "reassign_task", title: "Move Payment Integration to Priya",
    description: "Reassign Payment Integration (Phoenix) from Rahul to Priya to reduce Rahul's overload.",
    reason: "Rahul is projected at 108% capacity. Priya has 32% available capacity and strong backend skills.",
    affectedEmployeeId: "emp-rahul", affectedTaskId: "task-ph-3", affectedProjectId: "proj-phoenix",
    fromEmployeeId: "emp-rahul", toEmployeeId: "emp-priya",
    expectedImpact: { workloadChange: -23, riskReduction: 40, delayReduction: 12, capacityImprovement: 15 },
    confidence: 91, status: "pending", createdAt: "2025-08-29T08:15:00Z",
  },
  {
    id: "rec-2", type: "add_resource", title: "Add API Development Support for Arjun",
    description: "Assign Anita as secondary developer on Phoenix API to reduce bottleneck risk.",
    reason: "4 tasks depend on Arjun's API work. Adding support will reduce critical path risk by 35%.",
    affectedEmployeeId: "emp-arjun", affectedTaskId: "task-ph-2", affectedProjectId: "proj-phoenix",
    toEmployeeId: "emp-anita",
    expectedImpact: { workloadChange: -15, riskReduction: 35, delayReduction: 18 },
    confidence: 87, status: "pending", createdAt: "2025-08-29T08:20:00Z",
  },
  {
    id: "rec-3", type: "reassign_task", title: "Reassign Titan API Layer to Anita",
    description: "Move API Layer for ML Models from Raj to Anita to reduce Raj's overload.",
    reason: "Raj is at 105% projected. Anita has strong Python/FastAPI skills and can absorb this task.",
    affectedEmployeeId: "emp-raj", affectedTaskId: "task-ti-4", affectedProjectId: "proj-titan",
    fromEmployeeId: "emp-raj", toEmployeeId: "emp-anita",
    expectedImpact: { workloadChange: -18, riskReduction: 25, delayReduction: 8 },
    confidence: 84, status: "pending", createdAt: "2025-08-29T08:25:00Z",
  },
  {
    id: "rec-4", type: "skill_gap", title: "Assign Marketing Automation to Ishita",
    description: "Ishita has 71% skill match for Marketing Automation. Recommend upskilling + assignment.",
    reason: "No team member has strong Marketing Automation skills. Ishita is closest match with UX background.",
    affectedTaskId: "task-ap-4", affectedProjectId: "proj-apollo",
    toEmployeeId: "emp-ishita",
    expectedImpact: { riskReduction: 20 },
    confidence: 71, status: "pending", createdAt: "2025-08-29T08:30:00Z",
  },
  {
    id: "rec-5", type: "rebalance", title: "Rebalance Kavita's Project Load",
    description: "Move Mercury Scrum Master responsibilities to Meera to reduce Kavita's shadow workload.",
    reason: "Kavita manages 3 projects with 22% shadow work. Meera has PM experience and capacity.",
    affectedEmployeeId: "emp-kavita",
    expectedImpact: { workloadChange: -14, capacityImprovement: 12 },
    confidence: 78, status: "pending", createdAt: "2025-08-29T08:35:00Z",
  },
];

export const agentInsights: AgentInsight[] = [
  {
    id: "ins-1", severity: "critical", title: "Workload Risk — Rahul at 108%",
    description: "Rahul is projected to exceed capacity next Tuesday due to overlapping deadlines on Phoenix and Titan.",
    category: "workload", relatedEntityId: "emp-rahul", relatedEntityType: "employee",
    actionLabel: "View Details", actionRoute: "/manager/workload", timestamp: "2025-08-29T08:00:00Z",
  },
  {
    id: "ins-2", severity: "warning", title: "Delivery Risk — Phoenix at 74%",
    description: "Project Phoenix has a 74% probability of missing its September 18 deadline. API bottleneck is the primary cause.",
    category: "deadline", relatedEntityId: "proj-phoenix", relatedEntityType: "project",
    actionLabel: "View Project", actionRoute: "/manager/projects/proj-phoenix", timestamp: "2025-08-29T08:05:00Z",
  },
  {
    id: "ins-3", severity: "warning", title: "Bottleneck — 4 Tasks Depend on Arjun",
    description: "Arjun's API work on Phoenix is blocking Payment, Checkout, QA, and Release tasks.",
    category: "dependency", relatedEntityId: "emp-arjun", relatedEntityType: "employee",
    actionLabel: "View Dependencies", actionRoute: "/manager/dependencies", timestamp: "2025-08-29T08:10:00Z",
  },
  {
    id: "ins-4", severity: "info", title: "Opportunity — Priya Has Available Capacity",
    description: "Priya Patel has 32% available capacity and strong skills matching Phoenix requirements.",
    category: "capacity", relatedEntityId: "emp-priya", relatedEntityType: "employee",
    actionLabel: "View Profile", actionRoute: "/manager/team", timestamp: "2025-08-29T08:15:00Z",
  },
  {
    id: "ins-5", severity: "warning", title: "Skill Gap — Apollo Marketing Automation",
    description: "No team member has strong Marketing Automation skills required for Apollo's integration task.",
    category: "skill", relatedEntityId: "proj-apollo", relatedEntityType: "project",
    actionLabel: "View Skills", actionRoute: "/manager/skills", timestamp: "2025-08-29T08:20:00Z",
  },
  {
    id: "ins-6", severity: "critical", title: "Workload Risk — Raj at 105%",
    description: "Raj Malhotra is projected to exceed capacity. Leadership overhead and dual-project assignments are the cause.",
    category: "workload", relatedEntityId: "emp-raj", relatedEntityType: "employee",
    actionLabel: "View Details", actionRoute: "/manager/workload", timestamp: "2025-08-29T08:25:00Z",
  },
];

export const notifications: Notification[] = [
  {
    id: "notif-1", type: "risk", title: "Delivery Risk Detected",
    description: "Phoenix may miss its September 18 deadline.", severity: "critical",
    read: false, actionRoute: "/manager/projects/proj-phoenix", timestamp: "2025-08-29T08:00:00Z",
  },
  {
    id: "notif-2", type: "capacity", title: "Capacity Warning",
    description: "Rahul reached 94% effective workload.", severity: "warning",
    read: false, actionRoute: "/manager/workload", timestamp: "2025-08-29T07:30:00Z",
  },
  {
    id: "notif-3", type: "recommendation", title: "New Recommendation",
    description: "CrewSense found a better task allocation for Phoenix.", severity: "info",
    read: false, actionRoute: "/manager/recommendations", timestamp: "2025-08-29T08:15:00Z",
  },
  {
    id: "notif-4", type: "deadline", title: "Deadline Approaching",
    description: "Phoenix API endpoints due in 3 days.", severity: "warning",
    read: true, actionRoute: "/manager/tasks", timestamp: "2025-08-28T16:00:00Z",
  },
  {
    id: "notif-5", type: "update", title: "Task Status Update",
    description: "User Authentication marked as complete.", severity: "info",
    read: true, timestamp: "2025-08-28T14:00:00Z",
  },
];

export const activities: Activity[] = [
  { id: "act-1", type: "agent_detection", title: "Workload imbalance detected", description: "CrewSense detected that Rahul's projected workload exceeds 100%.", timestamp: "2025-08-29T08:00:00Z", relatedEntityId: "emp-rahul", relatedEntityType: "employee" },
  { id: "act-2", type: "agent_detection", title: "Delivery risk identified", description: "Phoenix deadline risk increased to 74% probability.", timestamp: "2025-08-29T07:45:00Z", relatedEntityId: "proj-phoenix", relatedEntityType: "project" },
  { id: "act-3", type: "approval", title: "Task reassignment approved", description: "Manager approved moving Database Optimization to Vivek.", timestamp: "2025-08-28T16:30:00Z", relatedEntityId: "task-ap-7", relatedEntityType: "task" },
  { id: "act-4", type: "deadline_change", title: "Project deadline changed", description: "Titan deadline extended from Oct 12 to Oct 15.", timestamp: "2025-08-28T14:00:00Z", relatedEntityId: "proj-titan", relatedEntityType: "project" },
  { id: "act-5", type: "dependency_blocked", title: "Dependency became blocked", description: "Payment Integration is blocked by API completion.", timestamp: "2025-08-28T11:00:00Z", relatedEntityId: "task-ph-3", relatedEntityType: "task" },
  { id: "act-6", type: "risk_update", title: "Delivery risk recalculated", description: "CrewSense recalculated Phoenix delivery risk after status updates.", timestamp: "2025-08-28T10:00:00Z", relatedEntityId: "proj-phoenix", relatedEntityType: "project" },
  { id: "act-7", type: "task_reassignment", title: "Task auto-assigned", description: "UX Design — Checkout Flow completed and marked done by Neha.", timestamp: "2025-08-27T17:00:00Z", relatedEntityId: "task-ph-6", relatedEntityType: "task" },
  { id: "act-8", type: "agent_detection", title: "Skill gap detected", description: "CrewSense identified Marketing Automation skill gap in Apollo.", timestamp: "2025-08-27T09:00:00Z", relatedEntityId: "proj-apollo", relatedEntityType: "project" },
  { id: "act-9", type: "agent_detection", title: "Bottleneck detected", description: "Arjun identified as critical bottleneck for 4 downstream tasks.", timestamp: "2025-08-26T14:00:00Z", relatedEntityId: "emp-arjun", relatedEntityType: "employee" },
  { id: "act-10", type: "approval", title: "Team allocation approved", description: "Mercury team allocation approved by manager.", timestamp: "2025-08-26T11:00:00Z", relatedEntityId: "proj-mercury", relatedEntityType: "project" },
];

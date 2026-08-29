import { Dependency } from "@/lib/types";

export const dependencies: Dependency[] = [
  // Phoenix critical path: DB → API → Payment → Checkout → QA → Release
  { id: "dep-1", sourceTaskId: "task-ph-1", targetTaskId: "task-ph-2", type: "blocks", isCritical: true, status: "resolved", impact: "API development can now proceed" },
  { id: "dep-2", sourceTaskId: "task-ph-2", targetTaskId: "task-ph-3", type: "blocks", isCritical: true, status: "active", impact: "Payment integration blocked until API endpoints complete" },
  { id: "dep-3", sourceTaskId: "task-ph-3", targetTaskId: "task-ph-4", type: "blocks", isCritical: true, status: "blocked", impact: "Checkout UI cannot proceed without payment integration" },
  { id: "dep-4", sourceTaskId: "task-ph-4", targetTaskId: "task-ph-10", type: "blocks", isCritical: true, status: "blocked", impact: "Integration testing requires checkout completion" },
  { id: "dep-5", sourceTaskId: "task-ph-10", targetTaskId: "task-ph-12", type: "blocks", isCritical: true, status: "blocked", impact: "Release blocked until QA passes" },
  { id: "dep-6", sourceTaskId: "task-ph-1", targetTaskId: "task-ph-7", type: "blocks", isCritical: false, status: "resolved", impact: "Auth requires DB schema" },
  { id: "dep-7", sourceTaskId: "task-ph-2", targetTaskId: "task-ph-8", type: "depends_on", isCritical: false, status: "active", impact: "Admin panel depends on core API" },
  { id: "dep-8", sourceTaskId: "task-ph-9", targetTaskId: "task-ph-12", type: "blocks", isCritical: false, status: "active", impact: "CI/CD needed for release" },
  { id: "dep-9", sourceTaskId: "task-ph-5", targetTaskId: "task-ph-11", type: "depends_on", isCritical: false, status: "active", impact: "Performance optimization after catalog built" },

  // Apollo dependencies
  { id: "dep-10", sourceTaskId: "task-ap-1", targetTaskId: "task-ap-3", type: "blocks", isCritical: true, status: "active", impact: "Campaign tracking needs data pipeline" },
  { id: "dep-11", sourceTaskId: "task-ap-3", targetTaskId: "task-ap-4", type: "blocks", isCritical: true, status: "active", impact: "Marketing automation needs campaign module" },
  { id: "dep-12", sourceTaskId: "task-ap-1", targetTaskId: "task-ap-5", type: "depends_on", isCritical: false, status: "active", impact: "Real-time viz needs data pipeline" },
  { id: "dep-13", sourceTaskId: "task-ap-1", targetTaskId: "task-ap-7", type: "depends_on", isCritical: false, status: "active", impact: "DB optimization follows pipeline setup" },

  // Titan dependencies
  { id: "dep-14", sourceTaskId: "task-ti-1", targetTaskId: "task-ti-2", type: "blocks", isCritical: true, status: "active", impact: "ML pipeline needs data ingestion" },
  { id: "dep-15", sourceTaskId: "task-ti-2", targetTaskId: "task-ti-4", type: "blocks", isCritical: true, status: "active", impact: "API layer needs trained models" },

  // Cross-project: Arjun is a bottleneck
  { id: "dep-16", sourceTaskId: "task-ph-2", targetTaskId: "task-ap-3", type: "related", isCritical: false, status: "active", impact: "Arjun works on both Phoenix API and Apollo campaign tracking" },

  // Orion
  { id: "dep-17", sourceTaskId: "task-or-1", targetTaskId: "task-or-2", type: "blocks", isCritical: true, status: "active", impact: "Compliance needs scanner results" },
  { id: "dep-18", sourceTaskId: "task-or-1", targetTaskId: "task-or-4", type: "blocks", isCritical: true, status: "active", impact: "API security needs scanner engine" },
];

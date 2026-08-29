import { Task } from "@/lib/types";

export const tasks: Task[] = [
  // ── Project Phoenix Tasks ────────────────────────────────
  {
    id: "task-ph-1", title: "Database Schema Design", description: "Design and implement the PostgreSQL schema for the e-commerce platform",
    projectId: "proj-phoenix", assigneeId: "emp-vivek", priority: "high", status: "done",
    deadline: "2025-08-10", effort: 32, estimatedDays: 4, dependencies: [], blockedBy: [], riskLevel: "none", createdAt: "2025-07-01", updatedAt: "2025-08-08",
  },
  {
    id: "task-ph-2", title: "API Architecture & Core Endpoints", description: "Design REST API architecture and implement core endpoints with FastAPI",
    projectId: "proj-phoenix", assigneeId: "emp-arjun", priority: "critical", status: "in_progress",
    deadline: "2025-08-25", effort: 48, estimatedDays: 6, dependencies: ["task-ph-1"], blockedBy: [], riskLevel: "high", createdAt: "2025-07-05", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-3", title: "Payment Integration", description: "Integrate Stripe payment processing with checkout flow",
    projectId: "proj-phoenix", assigneeId: "emp-rahul", priority: "critical", status: "blocked",
    deadline: "2025-09-02", effort: 40, estimatedDays: 5, dependencies: ["task-ph-2"], blockedBy: ["task-ph-2"], riskLevel: "high", createdAt: "2025-07-10", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-4", title: "Checkout UI Components", description: "Build checkout flow UI with cart, shipping, and payment forms",
    projectId: "proj-phoenix", assigneeId: "emp-tanvi", priority: "high", status: "blocked",
    deadline: "2025-09-05", effort: 36, estimatedDays: 5, dependencies: ["task-ph-2", "task-ph-3"], blockedBy: ["task-ph-3"], riskLevel: "medium", createdAt: "2025-07-10", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-5", title: "Product Catalog UI", description: "Build product listing, search, and filter components",
    projectId: "proj-phoenix", assigneeId: "emp-rahul", priority: "high", status: "in_progress",
    deadline: "2025-08-30", effort: 32, estimatedDays: 4, dependencies: [], blockedBy: [], riskLevel: "medium", createdAt: "2025-07-05", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-6", title: "UX Design — Checkout Flow", description: "Design the complete checkout user experience",
    projectId: "proj-phoenix", assigneeId: "emp-neha", priority: "high", status: "done",
    deadline: "2025-08-15", effort: 24, estimatedDays: 3, dependencies: [], blockedBy: [], riskLevel: "none", createdAt: "2025-07-02", updatedAt: "2025-08-14",
  },
  {
    id: "task-ph-7", title: "User Authentication", description: "Implement OAuth2 and JWT authentication",
    projectId: "proj-phoenix", assigneeId: "emp-priya", priority: "high", status: "done",
    deadline: "2025-08-12", effort: 28, estimatedDays: 4, dependencies: ["task-ph-1"], blockedBy: [], riskLevel: "none", createdAt: "2025-07-05", updatedAt: "2025-08-11",
  },
  {
    id: "task-ph-8", title: "Admin Dashboard", description: "Build admin panel for managing products, orders, and users",
    projectId: "proj-phoenix", assigneeId: "emp-priya", priority: "medium", status: "in_progress",
    deadline: "2025-09-10", effort: 40, estimatedDays: 5, dependencies: ["task-ph-2", "task-ph-7"], blockedBy: [], riskLevel: "low", createdAt: "2025-07-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-9", title: "CI/CD Pipeline Setup", description: "Configure deployment pipeline with Docker and AWS",
    projectId: "proj-phoenix", assigneeId: "emp-vikram", priority: "medium", status: "in_progress",
    deadline: "2025-09-08", effort: 24, estimatedDays: 3, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-07-20", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-10", title: "QA — Integration Testing", description: "Write and run integration tests for all endpoints",
    projectId: "proj-phoenix", assigneeId: "emp-sanya", priority: "high", status: "todo",
    deadline: "2025-09-12", effort: 32, estimatedDays: 4, dependencies: ["task-ph-2", "task-ph-3", "task-ph-4"], blockedBy: ["task-ph-4"], riskLevel: "medium", createdAt: "2025-07-25", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-11", title: "Performance Optimization", description: "Optimize page load times, caching, and database queries",
    projectId: "proj-phoenix", assigneeId: "emp-raj", priority: "medium", status: "todo",
    deadline: "2025-09-15", effort: 24, estimatedDays: 3, dependencies: ["task-ph-5", "task-ph-8"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-01", updatedAt: "2025-08-28",
  },
  {
    id: "task-ph-12", title: "Production Release", description: "Final deployment, monitoring setup, and production release",
    projectId: "proj-phoenix", assigneeId: "emp-vikram", priority: "critical", status: "todo",
    deadline: "2025-09-18", effort: 16, estimatedDays: 2, dependencies: ["task-ph-9", "task-ph-10", "task-ph-11"], blockedBy: ["task-ph-10"], riskLevel: "high", createdAt: "2025-08-01", updatedAt: "2025-08-28",
  },

  // ── Project Apollo Tasks ─────────────────────────────────
  {
    id: "task-ap-1", title: "Analytics Data Pipeline", description: "Build data ingestion pipeline for marketing analytics",
    projectId: "proj-apollo", assigneeId: "emp-anita", priority: "high", status: "in_progress",
    deadline: "2025-09-05", effort: 40, estimatedDays: 5, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-07-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-ap-2", title: "Dashboard UI Framework", description: "Build the dashboard layout and chart components",
    projectId: "proj-apollo", assigneeId: "emp-suresh", priority: "high", status: "in_progress",
    deadline: "2025-09-10", effort: 36, estimatedDays: 5, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-07-18", updatedAt: "2025-08-28",
  },
  {
    id: "task-ap-3", title: "Campaign Tracking Module", description: "Build campaign creation, tracking, and reporting features",
    projectId: "proj-apollo", assigneeId: "emp-arjun", priority: "high", status: "todo",
    deadline: "2025-09-15", effort: 32, estimatedDays: 4, dependencies: ["task-ap-1"], blockedBy: [], riskLevel: "medium", createdAt: "2025-07-20", updatedAt: "2025-08-28",
  },
  {
    id: "task-ap-4", title: "Marketing Automation Integration", description: "Integrate with marketing automation tools (HubSpot, Mailchimp)",
    projectId: "proj-apollo", assigneeId: null, priority: "high", status: "todo",
    deadline: "2025-09-20", effort: 40, estimatedDays: 5, dependencies: ["task-ap-3"], blockedBy: [], riskLevel: "high", createdAt: "2025-07-25", updatedAt: "2025-08-28",
  },
  {
    id: "task-ap-5", title: "Real-time Data Visualization", description: "Implement real-time chart updates with WebSocket",
    projectId: "proj-apollo", assigneeId: "emp-suresh", priority: "medium", status: "todo",
    deadline: "2025-09-22", effort: 28, estimatedDays: 4, dependencies: ["task-ap-1", "task-ap-2"], blockedBy: [], riskLevel: "low", createdAt: "2025-07-28", updatedAt: "2025-08-28",
  },
  {
    id: "task-ap-6", title: "UX Design — Analytics Dashboard", description: "Design the analytics dashboard experience",
    projectId: "proj-apollo", assigneeId: "emp-ishita", priority: "high", status: "done",
    deadline: "2025-08-20", effort: 24, estimatedDays: 3, dependencies: [], blockedBy: [], riskLevel: "none", createdAt: "2025-07-15", updatedAt: "2025-08-19",
  },
  {
    id: "task-ap-7", title: "Database Optimization", description: "Optimize PostgreSQL queries and add materialized views for analytics",
    projectId: "proj-apollo", assigneeId: "emp-vivek", priority: "medium", status: "in_progress",
    deadline: "2025-09-12", effort: 24, estimatedDays: 3, dependencies: ["task-ap-1"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-01", updatedAt: "2025-08-28",
  },
  {
    id: "task-ap-8", title: "QA — End-to-End Testing", description: "Complete E2E testing of analytics dashboard",
    projectId: "proj-apollo", assigneeId: "emp-sanya", priority: "high", status: "todo",
    deadline: "2025-09-25", effort: 28, estimatedDays: 4, dependencies: ["task-ap-2", "task-ap-3", "task-ap-5"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-05", updatedAt: "2025-08-28",
  },

  // ── Project Titan Tasks ──────────────────────────────────
  {
    id: "task-ti-1", title: "Data Ingestion Framework", description: "Build scalable data ingestion with Apache Kafka",
    projectId: "proj-titan", assigneeId: "emp-deepak", priority: "critical", status: "in_progress",
    deadline: "2025-09-01", effort: 48, estimatedDays: 6, dependencies: [], blockedBy: [], riskLevel: "medium", createdAt: "2025-08-01", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-2", title: "ML Model Training Pipeline", description: "Build automated ML model training and evaluation pipeline",
    projectId: "proj-titan", assigneeId: "emp-divya", priority: "critical", status: "in_progress",
    deadline: "2025-09-10", effort: 56, estimatedDays: 7, dependencies: ["task-ti-1"], blockedBy: [], riskLevel: "medium", createdAt: "2025-08-05", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-3", title: "Infrastructure Setup", description: "Set up Kubernetes cluster and CI/CD for ML workloads",
    projectId: "proj-titan", assigneeId: "emp-vikram", priority: "high", status: "in_progress",
    deadline: "2025-09-05", effort: 32, estimatedDays: 4, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-08-02", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-4", title: "API Layer for ML Models", description: "Build REST API for serving ML model predictions",
    projectId: "proj-titan", assigneeId: "emp-raj", priority: "high", status: "todo",
    deadline: "2025-09-15", effort: 32, estimatedDays: 4, dependencies: ["task-ti-2"], blockedBy: [], riskLevel: "medium", createdAt: "2025-08-08", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-5", title: "Data Visualization Dashboard", description: "Build analytics dashboard for data insights",
    projectId: "proj-titan", assigneeId: "emp-rahul", priority: "medium", status: "todo",
    deadline: "2025-09-20", effort: 28, estimatedDays: 4, dependencies: ["task-ti-4"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-10", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-6", title: "Security Audit", description: "Conduct security audit on data pipeline and API",
    projectId: "proj-titan", assigneeId: "emp-amit", priority: "high", status: "todo",
    deadline: "2025-09-25", effort: 24, estimatedDays: 3, dependencies: ["task-ti-3", "task-ti-4"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-12", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-7", title: "Load Testing", description: "Performance and load testing of data pipeline",
    projectId: "proj-titan", assigneeId: "emp-nikhil", priority: "medium", status: "todo",
    deadline: "2025-09-28", effort: 20, estimatedDays: 3, dependencies: ["task-ti-1", "task-ti-4"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-8", title: "Model Monitoring System", description: "Build monitoring for ML model drift and performance",
    projectId: "proj-titan", assigneeId: "emp-divya", priority: "high", status: "todo",
    deadline: "2025-10-01", effort: 32, estimatedDays: 4, dependencies: ["task-ti-2"], blockedBy: [], riskLevel: "medium", createdAt: "2025-08-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-ti-9", title: "Documentation & Handoff", description: "Technical documentation and knowledge transfer",
    projectId: "proj-titan", assigneeId: "emp-deepak", priority: "low", status: "todo",
    deadline: "2025-10-10", effort: 16, estimatedDays: 2, dependencies: ["task-ti-6", "task-ti-7", "task-ti-8"], blockedBy: [], riskLevel: "none", createdAt: "2025-08-18", updatedAt: "2025-08-28",
  },

  // ── Project Mercury Tasks ────────────────────────────────
  {
    id: "task-me-1", title: "Mobile App Architecture", description: "Set up React Native project with navigation and state management",
    projectId: "proj-mercury", assigneeId: "emp-rohan", priority: "high", status: "done",
    deadline: "2025-08-25", effort: 24, estimatedDays: 3, dependencies: [], blockedBy: [], riskLevel: "none", createdAt: "2025-08-10", updatedAt: "2025-08-24",
  },
  {
    id: "task-me-2", title: "Push Notification System", description: "Implement push notifications with Firebase",
    projectId: "proj-mercury", assigneeId: "emp-rohan", priority: "high", status: "in_progress",
    deadline: "2025-09-05", effort: 28, estimatedDays: 4, dependencies: ["task-me-1"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-12", updatedAt: "2025-08-28",
  },
  {
    id: "task-me-3", title: "UI Design — Mobile App", description: "Design mobile app screens and design system",
    projectId: "proj-mercury", assigneeId: "emp-neha", priority: "high", status: "in_progress",
    deadline: "2025-09-01", effort: 28, estimatedDays: 4, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-08-10", updatedAt: "2025-08-28",
  },
  {
    id: "task-me-4", title: "Loyalty Program Features", description: "Build points system, rewards, and tier management",
    projectId: "proj-mercury", assigneeId: "emp-karan", priority: "medium", status: "todo",
    deadline: "2025-09-20", effort: 36, estimatedDays: 5, dependencies: ["task-me-1", "task-me-3"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-me-5", title: "Real-time Chat Feature", description: "Implement in-app chat with WebSocket",
    projectId: "proj-mercury", assigneeId: "emp-karan", priority: "medium", status: "todo",
    deadline: "2025-10-05", effort: 32, estimatedDays: 4, dependencies: ["task-me-1"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-18", updatedAt: "2025-08-28",
  },
  {
    id: "task-me-6", title: "UX Testing & Iteration", description: "Conduct user testing and iterate on designs",
    projectId: "proj-mercury", assigneeId: "emp-ritu", priority: "medium", status: "todo",
    deadline: "2025-10-15", effort: 20, estimatedDays: 3, dependencies: ["task-me-3", "task-me-4"], blockedBy: [], riskLevel: "none", createdAt: "2025-08-20", updatedAt: "2025-08-28",
  },

  // ── Project Orion Tasks ──────────────────────────────────
  {
    id: "task-or-1", title: "Vulnerability Scanner Engine", description: "Build automated vulnerability scanning engine",
    projectId: "proj-orion", assigneeId: "emp-amit", priority: "critical", status: "in_progress",
    deadline: "2025-09-05", effort: 48, estimatedDays: 6, dependencies: [], blockedBy: [], riskLevel: "medium", createdAt: "2025-07-20", updatedAt: "2025-08-28",
  },
  {
    id: "task-or-2", title: "Compliance Reporting Module", description: "Build automated compliance report generation",
    projectId: "proj-orion", assigneeId: "emp-anita", priority: "high", status: "in_progress",
    deadline: "2025-09-12", effort: 36, estimatedDays: 5, dependencies: ["task-or-1"], blockedBy: [], riskLevel: "low", createdAt: "2025-07-25", updatedAt: "2025-08-28",
  },
  {
    id: "task-or-3", title: "Incident Management Dashboard", description: "Build dashboard for security incident tracking",
    projectId: "proj-orion", assigneeId: "emp-arun", priority: "high", status: "in_progress",
    deadline: "2025-09-15", effort: 32, estimatedDays: 4, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-07-28", updatedAt: "2025-08-28",
  },
  {
    id: "task-or-4", title: "API Security Layer", description: "Implement security middleware and API protection",
    projectId: "proj-orion", assigneeId: "emp-arun", priority: "critical", status: "todo",
    deadline: "2025-09-20", effort: 28, estimatedDays: 4, dependencies: ["task-or-1"], blockedBy: [], riskLevel: "medium", createdAt: "2025-08-01", updatedAt: "2025-08-28",
  },
  {
    id: "task-or-5", title: "Security Alerting System", description: "Build real-time security alerting with Slack/email integration",
    projectId: "proj-orion", assigneeId: "emp-amit", priority: "high", status: "todo",
    deadline: "2025-09-22", effort: 24, estimatedDays: 3, dependencies: ["task-or-1", "task-or-2"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-05", updatedAt: "2025-08-28",
  },
  {
    id: "task-or-6", title: "QA — Security Testing", description: "Penetration testing and security validation",
    projectId: "proj-orion", assigneeId: "emp-nikhil", priority: "high", status: "todo",
    deadline: "2025-09-28", effort: 28, estimatedDays: 4, dependencies: ["task-or-3", "task-or-4"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-08", updatedAt: "2025-08-28",
  },
  {
    id: "task-or-7", title: "Documentation", description: "Security platform documentation and user guides",
    projectId: "proj-orion", assigneeId: "emp-anita", priority: "low", status: "todo",
    deadline: "2025-10-01", effort: 16, estimatedDays: 2, dependencies: ["task-or-5", "task-or-6"], blockedBy: [], riskLevel: "none", createdAt: "2025-08-10", updatedAt: "2025-08-28",
  },

  // ── Project Nova Tasks ───────────────────────────────────
  {
    id: "task-no-1", title: "Component Library Architecture", description: "Set up design system infrastructure with Storybook",
    projectId: "proj-nova", assigneeId: "emp-arun", priority: "high", status: "in_progress",
    deadline: "2025-09-10", effort: 32, estimatedDays: 4, dependencies: [], blockedBy: [], riskLevel: "low", createdAt: "2025-08-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-no-2", title: "Core UI Components", description: "Build buttons, inputs, cards, modals, and other primitives",
    projectId: "proj-nova", assigneeId: "emp-sneha", priority: "high", status: "in_progress",
    deadline: "2025-09-20", effort: 40, estimatedDays: 5, dependencies: ["task-no-1"], blockedBy: [], riskLevel: "low", createdAt: "2025-08-18", updatedAt: "2025-08-28",
  },
  {
    id: "task-no-3", title: "Design Tokens & Theme", description: "Define design tokens, color palette, and typography scale",
    projectId: "proj-nova", assigneeId: "emp-pooja", priority: "high", status: "in_progress",
    deadline: "2025-09-08", effort: 24, estimatedDays: 3, dependencies: [], blockedBy: [], riskLevel: "none", createdAt: "2025-08-15", updatedAt: "2025-08-28",
  },
  {
    id: "task-no-4", title: "Accessibility Audit", description: "Ensure all components meet WCAG 2.1 AA standards",
    projectId: "proj-nova", assigneeId: "emp-ritu", priority: "medium", status: "todo",
    deadline: "2025-10-10", effort: 24, estimatedDays: 3, dependencies: ["task-no-2"], blockedBy: [], riskLevel: "none", createdAt: "2025-08-20", updatedAt: "2025-08-28",
  },
  {
    id: "task-no-5", title: "Documentation Site", description: "Build documentation website with examples and playground",
    projectId: "proj-nova", assigneeId: "emp-sneha", priority: "medium", status: "todo",
    deadline: "2025-10-20", effort: 32, estimatedDays: 4, dependencies: ["task-no-2", "task-no-3"], blockedBy: [], riskLevel: "none", createdAt: "2025-08-22", updatedAt: "2025-08-28",
  },
];

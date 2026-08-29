"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ChevronRight, AlertTriangle } from "lucide-react";
import * as api from "@/lib/api";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    api.getProjects().then(setProjects);
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">PROJECTS</h1>
          <Link href="/manager/projects/new" className="brutal-btn brutal-btn-primary">
            <Plus size={16} /> New Project
          </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "active", "at_risk", "planning", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`brutal-btn brutal-btn-sm ${filter === f ? "brutal-btn-dark" : "brutal-btn-outline"}`}
          >
            {f === "at_risk" ? "At Risk" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/manager/projects/${project.id}`} className="block brutal-card p-5 h-full">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{project.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                </div>
                <span
                  className={`brutal-badge shrink-0 ${
                    project.priority === "critical" ? "bg-red text-white" :
                    project.priority === "high" ? "bg-orange text-black" :
                    project.priority === "medium" ? "bg-yellow text-black" :
                    "bg-gray-200 text-gray-700"
                  }`}
                >
                  {project.priority.toUpperCase()}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase text-gray-500">Progress</span>
                  <span className="text-xs font-bold">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${project.progress}%`,
                      background: project.riskLevel === "high" || project.riskLevel === "critical" ? "#FF6B6B" :
                        project.riskLevel === "medium" ? "#FFB347" : "#6EE7B7",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-400 font-semibold uppercase">Deadline</div>
                  <div className="font-bold mt-0.5">
                    {new Date(project.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase">Delay Risk</div>
                  <div className="font-bold mt-0.5">{project.delayProbability}%</div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase">Team</div>
                  <div className="font-bold mt-0.5">{project.teamMembers.length} members</div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase">Health</div>
                  <div className="font-bold mt-0.5">{project.healthScore}/100</div>
                </div>
              </div>

              {project.riskLevel === "high" || project.riskLevel === "critical" ? (
                <div className="mt-4 flex items-center gap-2 text-xs text-red font-bold">
                  <AlertTriangle size={14} />
                  <span>Agent detected delivery risk</span>
                </div>
              ) : null}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

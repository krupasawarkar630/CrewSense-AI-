"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, CheckSquare, BarChart3, GitBranch, Sparkles, AlertTriangle, Clock } from "lucide-react";
import * as api from "@/lib/api";
import type { Project, Task, Employee } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<Employee[]>([]);

  useEffect(() => {
    api.getProject(id).then((p) => setProject(p || null));
    api.getTasksByProject(id).then(setProjectTasks);
    api.getTeam().then(setTeam);
  }, [id]);

  if (!project) return <div className="p-8"><div className="skeleton h-8 w-48 mb-4" /><div className="skeleton h-64 w-full" /></div>;

  const projectTeam = team.filter((e) => project.teamMembers.includes(e.id));
  const statusColors: Record<string, string> = {
    done: "bg-green text-black", in_progress: "bg-blue text-white", blocked: "bg-red text-white",
    review: "bg-yellow text-black", todo: "bg-gray-200 text-gray-700",
  };

  const criticalPath = projectTasks
    .filter((t) => t.priority === "critical" || t.riskLevel === "high")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/manager/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black font-semibold mb-4">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{project.name.toUpperCase()}</h1>
          <div className="flex items-center gap-2">
            <span className={`brutal-badge ${project.priority === "critical" ? "bg-red text-white" : project.priority === "high" ? "bg-orange text-black" : "bg-yellow text-black"}`}>
              {project.priority.toUpperCase()} PRIORITY
            </span>
            <span className="brutal-badge bg-black text-white">{project.progress}% COMPLETE</span>
          </div>
        </div>
        <p className="text-gray-500 mt-2 text-sm">{project.description}</p>
      </motion.div>

      {/* Agent Health */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card-agent p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✦</span>
            <h2 className="text-lg font-bold text-white">Agent Project Health</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-pink">{project.healthScore}</div>
              <div className="text-[10px] font-bold uppercase text-gray-400 mt-1">Health Score</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-white">{project.delayProbability}%</div>
              <div className="text-[10px] font-bold uppercase text-gray-400 mt-1">Delay Probability</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-white">{projectTeam.length}</div>
              <div className="text-[10px] font-bold uppercase text-gray-400 mt-1">Team Members</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-white">{projectTasks.length}</div>
              <div className="text-[10px] font-bold uppercase text-gray-400 mt-1">Total Tasks</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="brutal-card p-5">
            <h3 className="font-bold uppercase tracking-tight mb-3 flex items-center gap-2">
              <Users size={16} /> Team
            </h3>
            <div className="space-y-2">
              {projectTeam.map((emp) => (
                <Link key={emp.id} href="/manager/team" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-bg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-bold border-2 border-black">
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{emp.name}</div>
                      <div className="text-xs text-gray-500">{emp.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${emp.effectiveWorkload >= 90 ? "text-red" : emp.effectiveWorkload >= 75 ? "text-orange" : "text-green"}`}>
                      {emp.effectiveWorkload}%
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase">Workload</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="brutal-card p-5">
            <h3 className="font-bold uppercase tracking-tight mb-3 flex items-center gap-2">
              <CheckSquare size={16} /> Tasks
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {projectTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-bg transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      {team.find((e) => e.id === task.assigneeId)?.name || "Unassigned"}
                    </div>
                  </div>
                  <span className={`brutal-badge ml-2 ${statusColors[task.status]}`}>
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Critical Path */}
      {criticalPath.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="brutal-card p-5">
            <h3 className="font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <GitBranch size={16} /> Critical Path
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {criticalPath.map((task, i) => (
                <div key={task.id} className="flex items-center gap-2">
                  <div className={`brutal-card-flat p-3 text-center min-w-[120px] ${task.status === "blocked" ? "!border-red !bg-red/5" : task.status === "done" ? "!border-green !bg-green/5" : ""}`}>
                    <div className="text-xs font-bold">{task.title.length > 20 ? task.title.slice(0, 18) + "..." : task.title}</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {team.find((e) => e.id === task.assigneeId)?.name.split(" ")[0] || "—"}
                    </div>
                    <span className={`brutal-badge mt-2 text-[9px] ${statusColors[task.status]}`}>
                      {task.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  {i < criticalPath.length - 1 && (
                    <span className="text-gray-300 font-bold">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Delivery Forecast */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="brutal-card-pink p-5">
          <h3 className="font-bold uppercase tracking-tight mb-3 flex items-center gap-2">
            <Sparkles size={16} /> AI Delivery Forecast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase">Deadline</div>
              <div className="text-lg font-bold">{new Date(project.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase">Projected</div>
              <div className={`text-lg font-bold ${new Date(project.projectedCompletion) > new Date(project.deadline) ? "text-red" : "text-green"}`}>
                {new Date(project.projectedCompletion).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase">Delay Risk</div>
              <div className={`text-lg font-bold ${project.delayProbability > 50 ? "text-red" : project.delayProbability > 30 ? "text-orange" : "text-green"}`}>
                {project.delayProbability}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase">Risk Level</div>
              <span className={`brutal-badge ${project.riskLevel === "high" ? "bg-red text-white" : project.riskLevel === "medium" ? "bg-orange text-black" : "bg-green text-black"}`}>
                {project.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

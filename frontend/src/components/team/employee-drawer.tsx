"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Clock, Briefcase, ChevronRight } from "lucide-react";
import type { Employee, Task, Project } from "@/lib/types";
import * as api from "@/lib/api";

interface EmployeeDrawerProps {
  employee: Employee | null;
  onClose: () => void;
}

export function EmployeeDrawer({ employee, onClose }: EmployeeDrawerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reassignSuccess, setReassignSuccess] = useState(false);

  useEffect(() => {
    if (employee) {
      api.getTasksByEmployee(employee.id).then(setTasks);
      api.getProjects().then((allProjects) => {
        setProjects(allProjects.filter((p) => employee.currentProjects.includes(p.id)));
      });
      setReassignSuccess(false);
    }
  }, [employee]);

  if (!employee) return null;

  const profColors: Record<string, string> = {
    strong: "bg-green text-black",
    moderate: "bg-yellow text-black",
    weak: "bg-orange text-black",
    missing: "bg-gray-100 text-gray-400",
  };

  const handleSimulateReassignment = () => {
    setReassignSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-xl bg-white h-full border-l-3 border-black shadow-[-8px_0px_0px_#1A1A1A] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b-2.5 border-black bg-bg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-base border-2 border-black shadow-[3px_3px_0px_#FF9ECF]">
              {employee.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{employee.name}</h2>
              <p className="text-xs text-gray-600 font-semibold">{employee.role} · {employee.department}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors border-2 border-transparent hover:border-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Workload Breakdown (Section 22: Invisible Work Visualization) */}
          <div className="brutal-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                ✦ Effective Workload Analysis
              </h3>
              <span
                className={`brutal-badge ${
                  employee.effectiveWorkload >= 90
                    ? "bg-red text-white"
                    : employee.effectiveWorkload >= 75
                    ? "bg-orange text-black"
                    : "bg-green text-black"
                }`}
              >
                {employee.workloadStatus.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-1.5 mt-3">
              <div className="flex justify-between text-xs font-bold">
                <span>Effective Load: {employee.effectiveWorkload}%</span>
                <span>Max Capacity: {employee.capacity}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden border-2 border-black flex">
                <div
                  style={{ width: `${Math.min(employee.visibleWorkload, 100)}%` }}
                  className="h-full bg-green"
                  title={`Visible: ${employee.visibleWorkload}%`}
                />
                <div
                  style={{ width: `${Math.min(employee.shadowWorkload, 100 - employee.visibleWorkload)}%` }}
                  className="h-full bg-orange"
                  title={`Shadow: ${employee.shadowWorkload}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-green rounded-xs border border-black" />
                  Visible: <strong>{employee.visibleWorkload}%</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-orange rounded-xs border border-black" />
                  Shadow Work: <strong>{employee.shadowWorkload}%</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red rounded-xs border border-black" />
                  Projected: <strong>{employee.projectedWorkload}%</strong>
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-black/10 leading-relaxed italic">
              &ldquo;Meetings, coordination, dependencies and upcoming deadlines increase {employee.name.split(" ")[0]}&apos;s actual workload beyond assigned tasks.&rdquo;
            </p>
          </div>

          {/* AI Section (Section 24) */}
          <div className="brutal-card-agent p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-pink animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-pink">
                ✦ CrewSense AI Insight
              </h3>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {employee.id === "emp-rahul"
                ? "Rahul is projected to exceed capacity next Tuesday due to overlapping Phoenix and Titan deliverables."
                : `${employee.name} is currently operating at ${employee.effectiveWorkload}% effective load with ${employee.availability} availability.`}
            </p>

            {employee.id === "emp-rahul" && (
              <div className="mt-3 pt-3 border-t border-white/15">
                <div className="text-xs font-bold text-yellow uppercase tracking-wider mb-1">
                  Agent Recommendation:
                </div>
                <div className="text-xs text-white font-medium mb-3">
                  Move <strong>Payment Integration</strong> to <strong>Priya Patel</strong> (32% available capacity, 94% skill match).
                </div>
                {!reassignSuccess ? (
                  <button
                    onClick={handleSimulateReassignment}
                    className="brutal-btn brutal-btn-primary brutal-btn-sm text-xs py-1.5 w-full text-black"
                  >
                    Quick Reassign with Agent <ArrowRight size={12} />
                  </button>
                ) : (
                  <div className="p-2 bg-green/20 border border-green rounded-lg text-xs font-bold text-green flex items-center gap-1.5 justify-center">
                    <CheckCircle2 size={14} /> Reassignment applied & workload rebalanced!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills Matrix */}
          <div className="brutal-card p-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
              Verified Skills & Proficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((s) => (
                <span
                  key={s.skillId}
                  className={`brutal-badge text-xs px-2.5 py-1 ${profColors[s.proficiency] || "bg-gray-200"}`}
                >
                  {s.skillId.replace("sk-", "").toUpperCase()} · {s.yearsOfExperience}y ({s.proficiency})
                </span>
              ))}
            </div>
          </div>

          {/* Current Tasks */}
          <div className="brutal-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                Assigned Tasks ({tasks.length})
              </h3>
              <Link href="/manager/tasks" className="text-[11px] font-bold text-blue hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">No tasks assigned currently.</div>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 bg-bg rounded-lg border-2 border-black/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{t.title}</div>
                      <div className="text-[10px] text-gray-500">
                        Deadline: {new Date(t.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {t.effort}h
                      </div>
                    </div>
                    <span
                      className={`brutal-badge text-[9px] ${
                        t.status === "blocked"
                          ? "bg-red text-white"
                          : t.status === "in_progress"
                          ? "bg-blue text-white"
                          : t.status === "done"
                          ? "bg-green text-black"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {t.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current Projects */}
          <div className="brutal-card p-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
              Active Project Allocations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/manager/projects/${p.id}`}
                  className="p-2.5 bg-bg hover:bg-pink/10 rounded-lg border-2 border-black/10 transition-colors block"
                >
                  <div className="font-bold text-xs">{p.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                    <span>Progress: {p.progress}%</span>
                    <span
                      className={`font-bold ${
                        p.riskLevel === "high" ? "text-red" : p.riskLevel === "medium" ? "text-orange" : "text-green"
                      }`}
                    >
                      {p.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t-2.5 border-black bg-bg flex gap-2">
          <Link
            href="/manager/simulations"
            className="flex-1 brutal-btn brutal-btn-outline text-xs py-2.5 text-center"
          >
            Run What-If Simulation
          </Link>
          <Link
            href="/manager/agent"
            className="flex-1 brutal-btn brutal-btn-dark text-xs py-2.5 text-center text-white"
          >
            ✦ Ask Agent About {employee.name.split(" ")[0]}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles, UserPlus, ArrowRight } from "lucide-react";
import * as api from "@/lib/api";
import type { Task, Employee } from "@/lib/types";
import { TaskAssignmentModal } from "@/components/tasks/task-assignment-modal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<Task | null>(null);

  useEffect(() => {
    api.getTasks().then(setTasks);
    api.getTeam().then(setTeam);
  }, []);

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAssignTask = (taskId: string, employeeId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assigneeId: employeeId, status: "in_progress" } : t))
    );
  };

  const statusColors: Record<string, string> = {
    done: "bg-green text-black",
    in_progress: "bg-blue text-white",
    blocked: "bg-red text-white",
    review: "bg-yellow text-black",
    todo: "bg-gray-200 text-gray-700",
  };

  const priorityColors: Record<string, string> = {
    critical: "bg-red text-white",
    high: "bg-orange text-black",
    medium: "bg-yellow text-black",
    low: "bg-gray-200 text-gray-700",
  };

  const getProjectName = (id: string) => {
    const names: Record<string, string> = {
      "proj-phoenix": "Phoenix",
      "proj-apollo": "Apollo",
      "proj-titan": "Titan",
      "proj-mercury": "Mercury",
      "proj-orion": "Orion",
      "proj-nova": "Nova",
    };
    return names[id] || id;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TASK MANAGEMENT</h1>
            <p className="text-gray-500 text-sm mt-1">
              {filtered.length} tasks across {new Set(tasks.map((t) => t.projectId)).size} active projects
            </p>
          </div>
          <button
            onClick={() => {
              const unassignedOrBlocked = tasks.find((t) => !t.assigneeId || t.status === "blocked") || tasks[0];
              setSelectedTaskForAssign(unassignedOrBlocked);
            }}
            className="brutal-btn brutal-btn-primary self-start sm:self-auto text-xs py-2.5 text-black"
          >
            <Sparkles size={14} /> ✦ Ask Agent for Task Assignment
          </button>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 border-2 border-black rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "todo", "in_progress", "blocked", "review", "done"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`brutal-btn brutal-btn-sm text-xs py-1 px-2.5 ${
                statusFilter === s ? "brutal-btn-dark" : "brutal-btn-outline"
              }`}
            >
              {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black bg-bg/50">
                  {["Task", "Project", "Assignee", "Priority", "Status", "Deadline", "Effort", "Risk", "Action"].map(
                    (h) => (
                      <th key={h} className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => {
                  const assignee = team.find((e) => e.id === task.assigneeId);
                  return (
                    <tr key={task.id} className="border-b border-black/5 hover:bg-bg/50 transition-colors">
                      <td className="py-3 px-3 font-bold max-w-[220px]">
                        <div className="truncate">{task.title}</div>
                        <div className="text-[10px] text-gray-400 font-medium truncate">{task.description}</div>
                      </td>
                      <td className="py-3 px-3 text-xs font-semibold">{getProjectName(task.projectId)}</td>
                      <td className="py-3 px-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-[9px] font-bold">
                              {assignee.avatar}
                            </div>
                            <span className="text-xs font-medium">{assignee.name.split(" ")[0]}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedTaskForAssign(task)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-pink hover:underline"
                          >
                            <UserPlus size={12} /> Auto-Assign
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`brutal-badge ${priorityColors[task.priority]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`brutal-badge ${statusColors[task.status]}`}>
                          {task.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-medium">
                        {new Date(task.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </td>
                      <td className="py-3 px-3 text-xs font-medium">{task.effort}h</td>
                      <td className="py-3 px-3">
                        {task.riskLevel !== "none" ? (
                          <span
                            className={`brutal-badge ${
                              task.riskLevel === "high" || task.riskLevel === "critical"
                                ? "bg-red text-white"
                                : task.riskLevel === "medium"
                                ? "bg-orange text-black"
                                : "bg-green text-black"
                            }`}
                          >
                            {task.riskLevel.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedTaskForAssign(task)}
                          className="p-1.5 bg-bg hover:bg-black hover:text-white rounded border border-black text-xs font-bold transition-colors"
                          title="Assign or rebalance with Agent"
                        >
                          ✦
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Task Assignment Modal */}
      <TaskAssignmentModal
        task={selectedTaskForAssign}
        isOpen={!!selectedTaskForAssign}
        onClose={() => setSelectedTaskForAssign(null)}
        onAssign={handleAssignTask}
      />
    </div>
  );
}

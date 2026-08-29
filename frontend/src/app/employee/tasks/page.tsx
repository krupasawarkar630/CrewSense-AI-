"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as api from "@/lib/api";
import type { Task } from "@/lib/types";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getTasksByEmployee("emp-rahul").then(setTasks);
  }, []);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const statusColors: Record<string, string> = {
    done: "bg-green text-black", in_progress: "bg-blue text-white",
    blocked: "bg-red text-white", review: "bg-yellow text-black", todo: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">MY TASKS</h1>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {["all", "todo", "in_progress", "blocked", "done"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`brutal-btn brutal-btn-sm ${filter === s ? "brutal-btn-dark" : "brutal-btn-outline"}`}>
            {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((task) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="brutal-card p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{task.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Due {new Date(task.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })} · {task.effort}h
                </div>
              </div>
              <span className={`brutal-badge ml-3 ${statusColors[task.status]}`}>
                {task.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

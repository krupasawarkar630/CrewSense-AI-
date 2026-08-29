"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckSquare, FolderKanban, AlertTriangle, Sparkles, Gauge } from "lucide-react";
import * as api from "@/lib/api";
import type { Task, Project } from "@/lib/types";
import { employees } from "@/lib/mock";

export default function EmployeeDashboard() {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const emp = employees.find((e) => e.id === "emp-rahul")!;

  useEffect(() => {
    api.getTasksByEmployee("emp-rahul").then(setMyTasks);
    api.getProjects().then((ps) => setProjects(ps.filter((p) => emp.currentProjects.includes(p.id))));
  }, []);

  const activeTasks = myTasks.filter((t) => t.status !== "done");
  const dueSoon = activeTasks.filter((t) => {
    const days = (new Date(t.deadline).getTime() - Date.now()) / 86400000;
    return days < 7 && days >= 0;
  });

  const statusColors: Record<string, string> = {
    done: "bg-green text-black", in_progress: "bg-blue text-white",
    blocked: "bg-red text-white", todo: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">YOUR WORK.</h1>
        <h1 className="text-3xl font-bold tracking-tight text-pink">AT A GLANCE.</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {emp.name}.</p>
      </motion.div>

      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "My Workload", value: `${emp.effectiveWorkload}%`, icon: Gauge, color: emp.effectiveWorkload > 85 ? "bg-red" : "bg-green" },
          { label: "Tasks Due", value: dueSoon.length, icon: CheckSquare, color: "bg-yellow" },
          { label: "Active Projects", value: projects.length, icon: FolderKanban, color: "bg-blue" },
          { label: "At-Risk Tasks", value: activeTasks.filter((t) => t.riskLevel === "high").length, icon: AlertTriangle, color: "bg-orange" },
        ].map((k) => (
          <div key={k.label} className="brutal-card p-4">
            <div className={`w-8 h-8 ${k.color} rounded-lg flex items-center justify-center mb-2`}>
              <k.icon size={16} className="text-black" />
            </div>
            <div className="text-2xl font-bold">{k.value}</div>
            <div className="text-xs text-gray-500 font-semibold uppercase">{k.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Agent Insight */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="brutal-card-agent p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✦</span>
            <span className="text-xs font-bold text-pink uppercase">CrewSense Insight</span>
          </div>
          <p className="text-gray-300 text-sm">
            Your projected workload is <span className="text-pink font-bold">{emp.projectedWorkload}%</span> next week because
            of two upcoming deadlines. Consider breaking down the Product Catalog UI task to manage delivery risk.
          </p>
        </div>
      </motion.div>

      {/* My Tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="brutal-card p-5">
          <h3 className="font-bold uppercase tracking-tight mb-3">My Tasks</h3>
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-bg transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Due {new Date(task.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    {" · "}{task.effort}h
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`brutal-badge ${task.priority === "critical" ? "bg-red text-white" : task.priority === "high" ? "bg-orange text-black" : "bg-gray-200"}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className={`brutal-badge ${statusColors[task.status]}`}>
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

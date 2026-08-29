"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as api from "@/lib/api";
import type { Project } from "@/lib/types";
import { employees } from "@/lib/mock";

export default function EmployeeProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const emp = employees.find((e) => e.id === "emp-rahul")!;

  useEffect(() => {
    api.getProjects().then((ps) => setProjects(ps.filter((p) => emp.currentProjects.includes(p.id))));
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">MY PROJECTS</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="brutal-card p-5">
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{p.description}</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 font-semibold">Progress</span>
                  <span className="font-bold">{p.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.riskLevel === "high" ? "#FF6B6B" : "#6EE7B7" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-400">Deadline</span><div className="font-bold">{new Date(p.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</div></div>
                <div><span className="text-gray-400">Risk</span><div className={`font-bold brutal-badge inline-block mt-0.5 ${p.riskLevel === "high" ? "bg-red text-white" : "bg-green text-black"}`}>{p.riskLevel.toUpperCase()}</div></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

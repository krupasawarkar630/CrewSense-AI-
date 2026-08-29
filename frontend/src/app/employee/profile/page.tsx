"use client";

import { motion } from "framer-motion";
import { employees } from "@/lib/mock";

export default function EmployeeProfilePage() {
  const emp = employees.find((e) => e.id === "emp-rahul")!;

  const profColors: Record<string, string> = {
    strong: "bg-green text-black", moderate: "bg-yellow text-black", weak: "bg-orange text-black",
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">MY PROFILE</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl border-3 border-black shadow-[4px_4px_0px_#FF9ECF]">
              {emp.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{emp.name}</h2>
              <p className="text-sm text-gray-500">{emp.role}</p>
              <p className="text-xs text-gray-400">{emp.department} · {emp.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-bg rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{emp.visibleWorkload}%</div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Visible Work</div>
            </div>
            <div className="bg-bg rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange">{emp.shadowWorkload}%</div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Shadow Work</div>
            </div>
            <div className="bg-bg rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{emp.effectiveWorkload}%</div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Effective</div>
            </div>
            <div className="bg-bg rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${emp.projectedWorkload > 100 ? "text-red" : ""}`}>{emp.projectedWorkload}%</div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Projected</div>
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase text-xs text-gray-400 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {emp.skills.map((s) => (
                <span key={s.skillId} className={`brutal-badge ${profColors[s.proficiency]}`}>
                  {s.skillId.replace("sk-", "").toUpperCase()} · {s.yearsOfExperience}y
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agent Insight */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="brutal-card-agent p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✦</span>
            <span className="text-xs font-bold text-pink uppercase">CrewSense Insight</span>
          </div>
          <p className="text-gray-300 text-sm">
            Your effective workload ({emp.effectiveWorkload}%) includes {emp.shadowWorkload}% shadow work from meetings,
            coordination, and dependencies. Consider discussing workload redistribution with your manager.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

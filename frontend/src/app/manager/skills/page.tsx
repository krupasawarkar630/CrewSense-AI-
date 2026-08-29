"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle } from "lucide-react";
import * as api from "@/lib/api";
import type { Employee, Skill, SkillProficiency } from "@/lib/types";

export default function SkillsPage() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    api.getTeam().then(setTeam);
    api.getSkills().then(setSkills);
  }, []);

  const profColors: Record<SkillProficiency, string> = {
    strong: "bg-green", moderate: "bg-yellow", weak: "bg-orange", missing: "bg-gray-100",
  };

  const profLabels: Record<SkillProficiency, string> = {
    strong: "S", moderate: "M", weak: "W", missing: "",
  };

  const topSkills = skills.slice(0, 14);
  const displayTeam = team.slice(0, 16);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">SKILL INTELLIGENCE</h1>
        <p className="text-gray-500 text-sm mt-1">Interactive skill matrix across your team.</p>
      </motion.div>

      {/* Skill Matrix */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card p-5 overflow-x-auto">
          <h3 className="font-bold uppercase tracking-tight mb-4">Skill Matrix</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 px-2 font-bold sticky left-0 bg-white z-10 min-w-[120px]">Employee</th>
                {topSkills.map((s) => (
                  <th key={s.id} className="py-2 px-1 font-bold text-center min-w-[60px]">
                    <div className="transform -rotate-45 origin-center whitespace-nowrap text-[10px]">{s.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayTeam.map((emp) => (
                <tr key={emp.id} className="border-b border-black/5 hover:bg-bg/30">
                  <td className="py-2 px-2 font-bold sticky left-0 bg-white">{emp.name.split(" ")[0]}</td>
                  {topSkills.map((skill) => {
                    const es = emp.skills.find((s) => s.skillId === skill.id);
                    const prof: SkillProficiency = es?.proficiency || "missing";
                    return (
                      <td key={skill.id} className="py-2 px-1 text-center">
                        <div className={`w-7 h-7 mx-auto rounded-md ${profColors[prof]} flex items-center justify-center font-bold text-[10px] border border-black/20`}
                          title={`${emp.name}: ${skill.name} — ${prof}`}>
                          {profLabels[prof]}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 bg-green rounded border border-black/20" /> Strong</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 bg-yellow rounded border border-black/20" /> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 bg-orange rounded border border-black/20" /> Weak</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 bg-gray-100 rounded border border-black/20" /> Missing</span>
          </div>
        </div>
      </motion.div>

      {/* AI Skill Gap Detection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="brutal-card-pink p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} />
            <h3 className="font-bold uppercase tracking-tight">✦ AI Skill Gap Detection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="brutal-card-flat p-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-orange" />
                <span className="font-bold text-sm">Marketing Automation</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Required by Project Apollo. No team member has strong proficiency.</p>
              <div className="text-xs">
                <span className="text-gray-400">Closest match:</span>{" "}
                <span className="font-bold">Ishita Jain (71%)</span>
              </div>
            </div>
            <div className="brutal-card-flat p-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-yellow" />
                <span className="font-bold text-sm">Kubernetes</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Only 1 strong expert (Vikram). Single point of failure for Titan.</p>
              <div className="text-xs">
                <span className="text-gray-400">Backup:</span>{" "}
                <span className="font-bold">None available</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

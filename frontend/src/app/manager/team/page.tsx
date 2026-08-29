"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, User, ArrowUpRight } from "lucide-react";
import * as api from "@/lib/api";
import type { Employee } from "@/lib/types";
import { EmployeeDrawer } from "@/components/team/employee-drawer";

export default function TeamPage() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  useEffect(() => {
    api.getTeam().then(setTeam);
  }, []);

  const filtered = team.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    healthy: "bg-green text-black",
    watch: "bg-yellow text-black",
    high_load: "bg-orange text-black",
    overloaded: "bg-red text-white",
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TEAM INTELLIGENCE</h1>
            <p className="text-gray-500 text-sm mt-1">
              24 team members monitored by CrewSense · Click any member for deep intelligence
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team..."
              className="w-full pl-9 pr-4 py-2 border-2 border-black rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink bg-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp, i) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <div
              onClick={() => setSelectedEmp(emp)}
              className="brutal-card p-5 cursor-pointer hover:border-pink transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-black text-white rounded-lg flex items-center justify-center font-bold text-sm border-2 border-black group-hover:bg-pink group-hover:text-black transition-colors">
                  {emp.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate flex items-center justify-between">
                    <span>{emp.name}</span>
                    <ArrowUpRight size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <div className="text-xs text-gray-500 truncate">{emp.role}</div>
                </div>
              </div>

              {/* Status & Workload */}
              <div className="flex items-center justify-between mb-2">
                <span className={`brutal-badge text-[10px] ${statusColor[emp.workloadStatus]}`}>
                  {emp.workloadStatus.replace("_", " ").toUpperCase()}
                </span>
                <span className="text-xs font-bold">
                  Effective: <strong className={emp.effectiveWorkload >= 90 ? "text-red" : "text-black"}>{emp.effectiveWorkload}%</strong>
                </span>
              </div>

              {/* Workload Progress Bar */}
              <div className="mb-3">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-black flex">
                  <div
                    className="h-full bg-green"
                    style={{ width: `${Math.min(emp.visibleWorkload, 100)}%` }}
                  />
                  <div
                    className="h-full bg-orange"
                    style={{ width: `${Math.min(emp.shadowWorkload, 100 - emp.visibleWorkload)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-bg rounded-lg p-1.5">
                  <div className="font-bold">{emp.visibleWorkload}%</div>
                  <div className="text-[9px] text-gray-500 uppercase font-semibold">Visible</div>
                </div>
                <div className="bg-bg rounded-lg p-1.5">
                  <div className="font-bold text-orange">{emp.shadowWorkload}%</div>
                  <div className="text-[9px] text-gray-500 uppercase font-semibold">Shadow</div>
                </div>
                <div className="bg-bg rounded-lg p-1.5">
                  <div className={`font-bold ${emp.projectedWorkload > 100 ? "text-red" : ""}`}>
                    {emp.projectedWorkload}%
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase font-semibold">Projected</div>
                </div>
              </div>

              {/* Skills badges */}
              <div className="mt-3 pt-3 border-t border-black/10 flex flex-wrap gap-1">
                {emp.skills.slice(0, 3).map((s) => (
                  <span
                    key={s.skillId}
                    className="text-[9px] font-bold px-2 py-0.5 bg-bg rounded border border-black/20"
                  >
                    {s.skillId.replace("sk-", "").toUpperCase()}
                  </span>
                ))}
                {emp.skills.length > 3 && (
                  <span className="text-[9px] text-gray-400 font-bold px-1 py-0.5">
                    +{emp.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slide-over Employee Drawer */}
      <EmployeeDrawer employee={selectedEmp} onClose={() => setSelectedEmp(null)} />
    </div>
  );
}

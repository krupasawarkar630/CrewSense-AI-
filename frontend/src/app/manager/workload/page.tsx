"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import * as api from "@/lib/api";
import type { Employee, WorkloadStatus } from "@/lib/types";
import { EmployeeDrawer } from "@/components/team/employee-drawer";

const FILTERS: { label: string; value: WorkloadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Healthy", value: "healthy" },
  { label: "Watch", value: "watch" },
  { label: "High Load", value: "high_load" },
  { label: "Overloaded", value: "overloaded" },
];

export default function WorkloadPage() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<WorkloadStatus | "all">("all");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  useEffect(() => {
    api.getTeam().then(setTeam);
  }, []);

  const filtered = filter === "all" ? team : team.filter((e) => e.workloadStatus === filter);
  const sorted = [...filtered].sort((a, b) => b.effectiveWorkload - a.effectiveWorkload);

  const chartData = sorted.map((e) => ({
    name: e.name.split(" ")[0],
    visible: e.visibleWorkload,
    shadow: e.shadowWorkload,
    capacity: 100,
    employee: e,
  }));

  const statusColor: Record<string, string> = {
    healthy: "bg-green text-black",
    watch: "bg-yellow text-black",
    high_load: "bg-orange text-black",
    overloaded: "bg-red text-white",
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">WORKLOAD & CAPACITY INTELLIGENCE</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor visible, shadow, and effective workload · Click any row for in-depth AI capacity analysis
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`brutal-btn brutal-btn-sm text-xs py-1.5 px-3 ${
              filter === f.value ? "brutal-btn-dark" : "brutal-btn-outline"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Effective Workload Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold uppercase tracking-tight text-base">✦ Effective Workload Stack (Visible vs Shadow Work)</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Shadow work accounts for meetings, cross-team syncs, code reviews, and dependency coordination.
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A1A",
                    border: "2.5px solid #1A1A1A",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="visible"
                  stackId="a"
                  fill="#6EE7B7"
                  name="Visible Assigned Tasks"
                  radius={[0, 0, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="shadow"
                  stackId="a"
                  fill="#FFB347"
                  name="Shadow Coordination Load"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Employee Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="brutal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black bg-bg/50">
                  {["Employee", "Role", "Visible", "Shadow", "Effective", "Projected", "Capacity", "Status", "Action"].map(
                    (h) => (
                      <th key={h} className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sorted.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmp(emp)}
                    className="border-b border-black/5 hover:bg-pink/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black text-white rounded flex items-center justify-center text-[10px] font-bold">
                          {emp.avatar}
                        </div>
                        <span className="font-bold">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">{emp.role}</td>
                    <td className="py-3 px-3 font-bold">{emp.visibleWorkload}%</td>
                    <td className="py-3 px-3 font-bold text-orange">{emp.shadowWorkload}%</td>
                    <td className="py-3 px-3 font-bold text-base">{emp.effectiveWorkload}%</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${
                          emp.projectedWorkload > 100
                            ? "text-red"
                            : emp.projectedWorkload > 85
                            ? "text-orange"
                            : "text-green"
                        }`}
                      >
                        {emp.projectedWorkload}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold">{emp.capacity}%</td>
                    <td className="py-3 px-3">
                      <span className={`brutal-badge ${statusColor[emp.workloadStatus]}`}>
                        {emp.workloadStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button className="text-xs font-bold text-blue hover:underline">
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Employee Drawer */}
      <EmployeeDrawer employee={selectedEmp} onClose={() => setSelectedEmp(null)} />
    </div>
  );
}

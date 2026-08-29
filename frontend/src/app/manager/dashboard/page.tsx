"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  FolderKanban,
  CheckSquare,
  Gauge,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import * as api from "@/lib/api";
import type { DashboardKPIs, AgentInsight, Project, Employee, Risk } from "@/lib/types";
import { EmployeeDrawer } from "@/components/team/employee-drawer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ManagerDashboard() {
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<Employee[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  useEffect(() => {
    api.getDashboardKPIs().then(setKpis);
    api.getAgentInsights().then(setInsights);
    api.getProjects().then(setProjects);
    api.getTeam().then(setTeam);
    api.getRisks().then(setRisks);
  }, []);

  const topInsights = insights.slice(0, 3);
  const capacityData = team
    .filter((e) => e.effectiveWorkload > 60)
    .sort((a, b) => b.projectedWorkload - a.projectedWorkload)
    .slice(0, 7)
    .map((e) => ({
      name: e.name.split(" ")[0],
      current: e.effectiveWorkload,
      projected: e.projectedWorkload,
      capacity: 100,
      employee: e,
    }));

  const riskRadarData = [
    { category: "Workload Risk", value: 85, route: "/manager/workload" },
    { category: "Deadline Risk", value: 74, route: "/manager/projects/proj-phoenix" },
    { category: "Dependency Risk", value: 68, route: "/manager/dependencies" },
    { category: "Skill Risk", value: 45, route: "/manager/skills" },
    { category: "Capacity Risk", value: 60, route: "/manager/workload" },
  ];

  const getBarColor = (value: number) => {
    if (value >= 100) return "#FF6B6B";
    if (value >= 85) return "#FFB347";
    if (value >= 70) return "#FFD54A";
    return "#6EE7B7";
  };

  const severityEmoji: Record<string, string> = {
    critical: "🔴",
    warning: "🟠",
    info: "🟡",
    success: "🟢",
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-8">
      {/* Hero Header */}
      <motion.div {...fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-pink text-xs font-bold rounded-md mb-2 border border-black shadow-[2px_2px_0px_#FF9ECF]">
              <span>✦</span> CREWSENSE AUTONOMOUS INTELLIGENCE
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              YOUR TEAM.<br />
              <span className="text-pink">BEFORE THE RISK.</span>
            </h1>
            <p className="text-gray-600 mt-1.5 text-sm font-medium">
              CrewSense is continuously analyzing skills, tasks, dependencies, and effective capacity.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/manager/simulations"
              className="brutal-btn brutal-btn-outline text-xs shrink-0"
            >
              <Zap size={14} /> Run Simulation
            </Link>
            <Link
              href="/manager/projects/new"
              className="brutal-btn brutal-btn-primary shrink-0 text-xs text-black"
            >
              <Plus size={14} /> Create Project
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      {kpis && (
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Team Members", value: kpis.teamMembers, icon: Users, color: "bg-blue", href: "/manager/team" },
            { label: "Active Projects", value: kpis.activeProjects, icon: FolderKanban, color: "bg-green", href: "/manager/projects" },
            { label: "Active Tasks", value: kpis.activeTasks, icon: CheckSquare, color: "bg-yellow", href: "/manager/tasks" },
            { label: "Avg. Capacity", value: `${kpis.availableCapacity}%`, icon: Gauge, color: "bg-pink", href: "/manager/workload" },
            { label: "Overloaded", value: kpis.overloaded, icon: AlertTriangle, color: "bg-red", href: "/manager/workload" },
            { label: "At-Risk Projects", value: kpis.atRiskProjects, icon: TrendingUp, color: "bg-orange", href: "/manager/projects" },
          ].map((kpi) => (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="brutal-card p-4 hover:border-black transition-all block"
            >
              <div className={`w-8 h-8 ${kpi.color} rounded-lg flex items-center justify-center mb-3 border border-black shadow-[2px_2px_0px_#1A1A1A]`}>
                <kpi.icon size={16} className="text-black" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
              <div className="text-[11px] text-gray-500 font-bold uppercase mt-1 truncate">{kpi.label}</div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Agent Hero Card (Section 10) */}
      <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
        <div className="brutal-card-agent p-6 lg:p-8 border-3 border-black shadow-[6px_6px_0px_#FF9ECF]">
          <div className="flex items-center justify-between mb-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-pink font-bold">✦</span>
              <h2 className="text-xl font-bold text-white tracking-wider">CREWSENSE AGENT</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green agent-pulse" />
              <span className="text-xs font-bold text-green uppercase tracking-wider">● ACTIVE</span>
            </div>
          </div>

          <p className="text-gray-200 mb-6 text-base lg:text-lg">
            &ldquo;I found <strong className="text-pink">3 potential risks</strong> and{" "}
            <strong className="text-green">2 opportunities</strong> to rebalance your team.&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {topInsights.map((insight) => (
              <Link
                key={insight.id}
                href={insight.actionRoute || "/manager/agent"}
                className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl p-4 transition-all block group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{severityEmoji[insight.severity]}</span>
                    <span className="text-[11px] font-bold uppercase text-gray-300">
                      {insight.category} Risk
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400 group-hover:text-pink transition-colors" />
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-pink transition-colors">
                  {insight.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {insight.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/manager/recommendations" className="brutal-btn brutal-btn-primary brutal-btn-sm text-black">
              REVIEW ALL RECOMMENDATIONS <ArrowRight size={14} />
            </Link>
            <Link
              href="/manager/agent"
              className="brutal-btn brutal-btn-sm bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <MessageSquare size={14} /> ASK AGENT
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Team Capacity Visualization (Section 11) */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <div className="brutal-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg uppercase tracking-tight">Team Capacity & Projected Load</h3>
                <p className="text-xs text-gray-500">
                  Click any employee row to open full workload intelligence
                </p>
              </div>
              <Link
                href="/manager/workload"
                className="text-xs font-bold text-blue hover:underline flex items-center gap-1"
              >
                View Full Grid <ChevronRight size={12} />
              </Link>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={65} tick={{ fontSize: 12, fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1A1A1A",
                      border: "2px solid #1A1A1A",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                  <Bar
                    dataKey="projected"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                    onClick={(entry: any) => setSelectedEmp(entry.employee)}
                    className="cursor-pointer"
                  >
                    {capacityData.map((entry, index) => (
                      <Cell key={index} fill={getBarColor(entry.projected)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#6EE7B7] rounded-xs border border-black" /> Healthy (&lt;70%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#FFD54A] rounded-xs border border-black" /> Watch (70-85%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#FF6B6B] rounded-xs border border-black" /> Overloaded (&gt;100%)
                </span>
              </div>
              <span className="text-gray-400 font-bold">100% = Maximum Capacity</span>
            </div>
          </div>
        </motion.div>

        {/* AI Risk Radar (Section 12) */}
        <motion.div {...fadeInUp} transition={{ delay: 0.25 }}>
          <div className="brutal-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg uppercase tracking-tight">AI Risk Radar</h3>
                <span className="brutal-badge bg-pink text-black text-[9px]">INTERACTIVE</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Click any risk vector below to jump to root cause analysis
              </p>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskRadarData}>
                  <PolarGrid stroke="#E5E5E5" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Radar dataKey="value" stroke="#FF9ECF" fill="#FF9ECF" fillOpacity={0.35} strokeWidth={2.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 mt-2 pt-2 border-t border-black/10">
              {riskRadarData.slice(0, 3).map((r) => (
                <Link
                  key={r.category}
                  href={r.route}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-bg text-xs font-bold transition-colors"
                >
                  <span className="text-gray-700">{r.category}</span>
                  <span className="text-pink flex items-center gap-1">
                    {r.value}% risk <ExternalLink size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Delivery Forecast (Section 13) */}
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
        <div className="brutal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg uppercase tracking-tight">Project Delivery Forecast</h3>
              <p className="text-xs text-gray-500">
                Probability of missing milestone targets based on critical path bottlenecks
              </p>
            </div>
            <Link
              href="/manager/projects"
              className="text-xs font-bold text-blue hover:underline flex items-center gap-1"
            >
              View All Projects <ChevronRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-bg/50">
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">Project</th>
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">Progress</th>
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500 hidden sm:table-cell">Deadline</th>
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500 hidden md:table-cell">Projected</th>
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">Delay Risk</th>
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">Risk Level</th>
                  <th className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.filter((p) => p.status !== "completed").map((project) => (
                  <tr key={project.id} className="border-b border-black/5 hover:bg-bg/50 transition-colors">
                    <td className="py-3 px-3">
                      <Link href={`/manager/projects/${project.id}`} className="font-bold hover:text-blue transition-colors">
                        {project.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden border border-black/15">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${project.progress}%`,
                              background:
                                project.riskLevel === "high" || project.riskLevel === "critical"
                                  ? "#FF6B6B"
                                  : project.riskLevel === "medium"
                                  ? "#FFB347"
                                  : "#6EE7B7",
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold hidden sm:table-cell">
                      {new Date(project.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold hidden md:table-cell">
                      {new Date(project.projectedCompletion).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold text-xs ${project.delayProbability >= 50 ? "text-red" : "text-black"}`}>
                        {project.delayProbability}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`brutal-badge ${
                          project.riskLevel === "high" || project.riskLevel === "critical"
                            ? "bg-red text-white"
                            : project.riskLevel === "medium"
                            ? "bg-orange text-black"
                            : "bg-green text-black"
                        }`}
                      >
                        {project.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/manager/projects/${project.id}`}
                        className="text-xs font-bold text-blue hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Slide-over Employee Drawer */}
      <EmployeeDrawer employee={selectedEmp} onClose={() => setSelectedEmp(null)} />
    </div>
  );
}

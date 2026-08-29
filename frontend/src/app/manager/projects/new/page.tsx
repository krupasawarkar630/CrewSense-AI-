"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Check, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import * as api from "@/lib/api";
import type { BuildTeamResponse } from "@/lib/types";
import { employees } from "@/lib/mock";

const ANALYSIS_STEPS = [
  "Understanding project requirements",
  "Checking employee skills",
  "Calculating effective capacity",
  "Checking deadlines",
  "Mapping dependencies",
  "Detecting bottlenecks",
  "Simulating allocations",
  "Preparing recommendation",
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "analyzing" | "results">("form");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [teamResult, setTeamResult] = useState<BuildTeamResponse | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", startDate: "2025-09-01", deadline: "2025-09-30",
    priority: "high", teamSize: "5", roles: "2 Developers, 1 Designer, 1 Marketing, 1 PM",
    requiredSkills: "React, TypeScript, Python, Figma, Marketing Automation",
  });

  const handleBuildTeam = async () => {
    setStep("analyzing");
    for (let i = 0; i <= ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 350));
      setAnalysisProgress(i);
    }
    const result = await api.buildTeam("new");
    setTeamResult(result);
    setStep("results");
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <Link href="/manager/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black font-semibold">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">CREATE NEW PROJECT</h1>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Project Details */}
            <div className="brutal-card p-6">
              <h2 className="font-bold text-lg uppercase tracking-tight mb-4">Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project Apollo"
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project..."
                    rows={3} className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink bg-white">
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Requirements */}
            <div className="brutal-card p-6">
              <h2 className="font-bold text-lg uppercase tracking-tight mb-4">Team Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Team Size</label>
                  <input value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Roles</label>
                  <input value={form.roles} onChange={(e) => setForm({ ...form, roles: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">Required Skills</label>
                  <input value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink" />
                </div>
              </div>
            </div>

            <button onClick={handleBuildTeam} className="brutal-btn brutal-btn-dark text-base py-3.5 w-full sm:w-auto">
              <Sparkles size={18} /> Build Team with CrewSense
            </button>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="brutal-card-agent p-8 text-center">
            <Sparkles size={32} className="mx-auto text-pink mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-6">✦ CREWSENSE IS ANALYZING</h2>
            <div className="max-w-sm mx-auto text-left space-y-2">
              {ANALYSIS_STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {i < analysisProgress ? (
                    <Check size={16} className="text-green shrink-0" />
                  ) : i === analysisProgress ? (
                    <Loader2 size={16} className="text-pink animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" />
                  )}
                  <span className={i < analysisProgress ? "text-green" : i === analysisProgress ? "text-pink font-semibold" : "text-gray-500"}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "results" && teamResult && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold">AI-RECOMMENDED TEAM</h2>

            {/* Team Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamResult.recommendations.map((rec) => {
                const emp = employees.find((e) => e.id === rec.employeeId);
                if (!emp) return null;
                return (
                  <div key={rec.employeeId} className="brutal-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xs border-2 border-black">
                        {emp.avatar}
                      </div>
                      <div>
                        <div className="font-bold">{emp.name}</div>
                        <div className="text-xs text-gray-500">{rec.role}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div><span className="text-gray-400 block">Skill Match</span><span className="font-bold text-green">{rec.skillMatch}%</span></div>
                      <div><span className="text-gray-400 block">Workload</span><span className="font-bold">{rec.currentWorkload}%</span></div>
                      <div><span className="text-gray-400 block">Projected</span><span className={`font-bold ${rec.projectedWorkload > 90 ? "text-red" : ""}`}>{rec.projectedWorkload}%</span></div>
                      <div><span className="text-gray-400 block">Score</span><span className="font-bold text-pink">{rec.recommendationScore}</span></div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      {rec.reasons.map((r, i) => <div key={i}>• {r}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skill Gaps */}
            {teamResult.skillGaps.length > 0 && (
              <div className="brutal-card p-5 !border-orange !bg-orange/5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={18} className="text-orange" />
                  <h3 className="font-bold uppercase">⚠️ Skill Gap Detected</h3>
                </div>
                {teamResult.skillGaps.map((gap) => (
                  <div key={gap.skillName}>
                    <div className="font-bold text-sm mb-2">{gap.skillName} — Qualified: {gap.qualifiedEmployees}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {gap.solutions.map((sol, i) => (
                        <div key={i} className="brutal-card-flat p-3 bg-white">
                          <div className="text-xs font-bold uppercase text-gray-400 mb-1">{sol.type.replace("_", " ")}</div>
                          <div className="text-sm font-medium">{sol.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{sol.impact}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Team Health */}
            <div className="brutal-card-pink p-5">
              <h3 className="font-bold uppercase tracking-tight mb-3">✦ Team Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><div className="text-xs text-gray-400 font-bold uppercase">Skill Coverage</div><div className="text-2xl font-bold">{teamResult.teamHealth.skillCoverage}%</div></div>
                <div><div className="text-xs text-gray-400 font-bold uppercase">Capacity Balance</div><div className="text-2xl font-bold">{teamResult.teamHealth.capacityBalance}%</div></div>
                <div><div className="text-xs text-gray-400 font-bold uppercase">Deadline Confidence</div><div className="text-2xl font-bold uppercase">{teamResult.teamHealth.deadlineConfidence}</div></div>
                <div><div className="text-xs text-gray-400 font-bold uppercase">AI Confidence</div><div className="text-2xl font-bold text-pink">{teamResult.teamHealth.aiConfidence}%</div></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => router.push("/manager/projects")} className="brutal-btn brutal-btn-primary">Approve Team</button>
              <button onClick={() => router.push("/manager/simulations")} className="brutal-btn brutal-btn-outline">Simulate</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

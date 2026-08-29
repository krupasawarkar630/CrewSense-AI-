"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  TrendingDown,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import * as api from "@/lib/api";
import type { SimulationResponse } from "@/lib/types";

const SCENARIOS = [
  "Rahul becomes unavailable",
  "Move Payment Integration to Priya",
  "Deadline moves 3 days earlier",
  "Add another developer to Phoenix",
  "Remove Arjun from the project",
  "Reassign Titan API Layer to Anita",
];

const ANALYSIS_STEPS = [
  "Analyzing current workforce graph",
  "Simulating capacity changes & task movements",
  "Recalculating critical paths & bottleneck probabilities",
  "Forecasting project delivery dates",
  "Generating optimal rebalancing proposal",
];

export default function SimulationsPage() {
  const [mode, setMode] = useState<"what-if" | "optimizer">("what-if");
  const [input, setInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [approved, setApproved] = useState(false);

  const handleSimulate = async (scenario?: string) => {
    const text = scenario || input;
    if (!text.trim()) return;
    setInput("");
    setIsSimulating(true);
    setResult(null);
    setApproved(false);

    for (let i = 0; i <= ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 260));
      setProgress(i);
    }

    const res = await api.simulateScenario(text);
    setResult(res);
    setIsSimulating(false);
    setProgress(0);
  };

  const handleRunOptimizer = async () => {
    setIsSimulating(true);
    setResult(null);
    setApproved(false);

    for (let i = 0; i <= ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 260));
      setProgress(i);
    }

    const res = await api.optimizeTeam();
    setResult(res);
    setIsSimulating(false);
    setProgress(0);
  };

  const handleApply = () => {
    setApproved(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">WORKFORCE SIMULATOR</h1>
            <p className="text-gray-500 text-sm mt-1">
              Simulate high-impact workforce decisions and test scenarios before making commitments.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("what-if");
                setResult(null);
                setApproved(false);
              }}
              className={`brutal-btn brutal-btn-sm text-xs ${
                mode === "what-if" ? "brutal-btn-dark" : "brutal-btn-outline"
              }`}
            >
              <FlaskConical size={14} /> What-If Sandbox
            </button>
            <button
              onClick={() => {
                setMode("optimizer");
                setResult(null);
                setApproved(false);
              }}
              className={`brutal-btn brutal-btn-sm text-xs ${
                mode === "optimizer" ? "brutal-btn-dark" : "brutal-btn-outline"
              }`}
            >
              <Zap size={14} /> ✦ Resource Optimizer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Simulator / Optimizer trigger box */}
      {mode === "what-if" ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="brutal-card p-6">
            <h2 className="font-bold uppercase tracking-tight text-base mb-2">What would happen if...</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSimulate();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Move Payment Integration to Priya, or what if Rahul takes 3 days leave?"
                className="flex-1 px-4 py-3 border-2 border-black rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink bg-white"
                disabled={isSimulating}
              />
              <button
                type="submit"
                disabled={!input.trim() || isSimulating}
                className="brutal-btn brutal-btn-dark disabled:opacity-40"
              >
                <FlaskConical size={16} /> Simulate
              </button>
            </form>

            <div className="mt-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Suggested Scenarios
              </span>
              <div className="flex flex-wrap gap-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSimulate(s)}
                    className="text-xs font-semibold px-3 py-1.5 bg-bg border-2 border-black/15 rounded-full hover:border-black hover:bg-pink/20 transition-all cursor-pointer"
                    disabled={isSimulating}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="brutal-card-agent p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={20} className="text-pink" />
                  <h2 className="text-xl font-bold text-white">✦ AUTOMATED RESOURCE OPTIMIZER</h2>
                </div>
                <p className="text-sm text-gray-300 max-w-xl">
                  Allow CrewSense to rebalance tasks across all 24 team members to eliminate overloads, remove bottlenecks, and optimize delivery confidence.
                </p>
              </div>
              <button
                onClick={handleRunOptimizer}
                disabled={isSimulating}
                className="brutal-btn brutal-btn-primary py-3.5 px-6 font-bold text-sm shrink-0 text-black shadow-[4px_4px_0px_#FFFFFF]"
              >
                ✦ Run Global Optimization
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Animation */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="brutal-card-agent p-6 text-center">
              <Sparkles size={28} className="mx-auto text-pink mb-3 animate-pulse" />
              <h2 className="text-lg font-bold text-white mb-4">✦ CREWSENSE IS SIMULATING SCENARIO</h2>
              <div className="max-w-md mx-auto text-left space-y-2.5">
                {ANALYSIS_STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
                    {i < progress ? (
                      <Check size={16} className="text-green shrink-0" />
                    ) : i === progress ? (
                      <Loader2 size={16} className="text-pink animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 shrink-0" />
                    )}
                    <span
                      className={
                        i < progress
                          ? "text-green"
                          : i === progress
                          ? "text-pink font-semibold"
                          : "text-gray-500"
                      }
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Comparison (Section 33 & 34) */}
      <AnimatePresence>
        {result && !approved && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-tight">Simulation Results & Impact</h2>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current */}
              <div className="brutal-card p-5 bg-white">
                <div className="flex items-center justify-between mb-4 border-b-2 border-black/10 pb-2">
                  <h3 className="font-bold uppercase text-xs text-gray-500 tracking-wider">
                    Current Baseline
                  </h3>
                  <span className="brutal-badge bg-red text-white text-[10px]">HIGH RISK</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Peak Team Workload</span>
                    <span className="font-bold text-lg">{result.comparison.current.workloadBefore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Project Delay Probability</span>
                    <span className="font-bold text-lg text-red">{result.comparison.current.delayProbabilityBefore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Overloaded Employees</span>
                    <span className="font-bold text-lg text-red">{result.comparison.current.overloadedBefore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Capacity Balance Index</span>
                    <span className="font-bold text-lg">{result.comparison.current.capacityBalanceBefore}%</span>
                  </div>
                </div>
              </div>

              {/* Proposed */}
              <div className="brutal-card-pink p-5 bg-white">
                <div className="flex items-center justify-between mb-4 border-b-2 border-black/10 pb-2">
                  <h3 className="font-bold uppercase text-xs text-black tracking-wider flex items-center gap-1.5">
                    <span>✦ Proposed Simulated State</span>
                  </h3>
                  <span className="brutal-badge bg-green text-black text-[10px]">OPTIMAL</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Peak Team Workload</span>
                    <span className="font-bold text-lg text-green">{result.comparison.proposed.workloadAfter}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Project Delay Probability</span>
                    <span className="font-bold text-lg text-green">{result.comparison.proposed.delayProbabilityAfter}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overloaded Employees</span>
                    <span className="font-bold text-lg text-green">{result.comparison.proposed.overloadedAfter}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacity Balance Index</span>
                    <span className="font-bold text-lg text-green">{result.comparison.proposed.capacityBalanceAfter}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposed Task Changes */}
            <div className="brutal-card p-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
                Proposed Allocation Changes
              </h3>
              <div className="space-y-2">
                {result.simulation.changes.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 bg-bg rounded-lg border-2 border-black/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink text-black font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-bold">{c.description}</span>
                    </div>
                    <span className="brutal-badge bg-green text-black text-[9px]">RECOMMENDED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Recommendation Hero Action */}
            <div className="brutal-card-agent p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">✦</span>
                <h3 className="text-base font-bold text-white">CREWSENSE AGENT VERDICT</h3>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                {result.agentRecommendation}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleApply}
                  className="brutal-btn brutal-btn-primary py-3 px-6 text-sm font-bold text-black"
                >
                  <CheckCircle2 size={16} /> Approve & Apply Simulation Plan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approved State Confirmation (Section 36) */}
      <AnimatePresence>
        {approved && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="brutal-card p-8 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-black shadow-[4px_4px_0px_#1A1A1A]">
                <Check size={32} className="text-black" />
              </div>
              <h2 className="text-2xl font-bold mb-2">✓ PLAN APPROVED & APPLIED</h2>
              <p className="text-gray-500 text-xs sm:text-sm mb-6">
                CrewSense has applied task reassignments and recalculated all connected models.
              </p>
              <div className="bg-bg p-4 rounded-xl border-2 border-black space-y-2 text-xs font-bold text-left">
                <div className="flex items-center gap-2 text-green">
                  <Check size={14} /> Rahul effective workload decreased from 90% → 68%
                </div>
                <div className="flex items-center gap-2 text-green">
                  <Check size={14} /> Phoenix delay probability reduced from 74% → 31%
                </div>
                <div className="flex items-center gap-2 text-green">
                  <Check size={14} /> Arjun bottleneck relieved with API support
                </div>
                <div className="flex items-center gap-2 text-green">
                  <Check size={14} /> Critical path unblocked for Checkout UI
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

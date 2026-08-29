"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ArrowRight, Users, FolderKanban, CheckSquare, GitBranch, Check, Loader2 } from "lucide-react";
import * as api from "@/lib/api";
import type { AgentInsight, AgentMessage, AnalysisStep } from "@/lib/types";

const SUGGESTED_PROMPTS = [
  "Who is overloaded?",
  "Which project is most at risk?",
  "Why is Phoenix at risk?",
  "Who can take Rahul's task?",
  "What if Arjun is unavailable?",
  "Build a team for my project.",
  "Optimize Phoenix.",
];

const ANALYSIS_STEPS: AnalysisStep[] = [
  { label: "Understanding project requirements", status: "pending" },
  { label: "Checking employee skills", status: "pending" },
  { label: "Calculating effective capacity", status: "pending" },
  { label: "Checking deadlines", status: "pending" },
  { label: "Mapping dependencies", status: "pending" },
  { label: "Detecting bottlenecks", status: "pending" },
  { label: "Simulating allocations", status: "pending" },
  { label: "Preparing recommendation", status: "pending" },
];

export default function AgentPage() {
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getAgentInsights().then(setInsights);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;
    setInput("");

    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Run analysis animation
    setIsAnalyzing(true);
    const steps = ANALYSIS_STEPS.map((s) => ({ ...s }));
    setAnalysisSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 280));
      setAnalysisSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "completed" : idx === i ? "in_progress" : "pending",
        }))
      );
    }
    await new Promise((r) => setTimeout(r, 300));
    setAnalysisSteps((prev) => prev.map((s) => ({ ...s, status: "completed" as const })));
    await new Promise((r) => setTimeout(r, 400));

    const response = await api.askAgent(content);
    setMessages((prev) => [...prev, response]);
    setIsAnalyzing(false);
    setAnalysisSteps([]);
  };

  const severityEmoji: Record<string, string> = {
    critical: "🔴",
    warning: "🟠",
    info: "🟡",
    success: "🟢",
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✦</span>
          <h1 className="text-3xl font-bold tracking-tight">CREWSENSE AGENT</h1>
        </div>
        <p className="text-gray-500 font-medium">Your AI workforce intelligence command center.</p>
      </motion.div>

      {/* Agent Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card-agent p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold uppercase text-gray-300">Agent Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green agent-pulse" />
              <span className="text-xs font-bold text-green uppercase">Active</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Employees", value: "24", icon: Users },
              { label: "Projects", value: "6", icon: FolderKanban },
              { label: "Tasks", value: "57", icon: CheckSquare },
              { label: "Dependencies", value: "18", icon: GitBranch },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-lg p-3 text-center">
                <stat.icon size={18} className="mx-auto mb-1 text-pink" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Live Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-bold text-lg uppercase tracking-tight mb-3">Live Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight) => (
            <div key={insight.id} className="brutal-card p-4 flex gap-3">
              <span className="text-lg shrink-0">{severityEmoji[insight.severity]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{insight.title}</div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chat Interface */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="brutal-card overflow-hidden">
          <div className="p-5 border-b-2 border-black/10">
            <h2 className="font-bold text-lg uppercase tracking-tight">Ask CrewSense</h2>
            <p className="text-xs text-gray-500 mt-1">Ask anything about your team, projects, or workload.</p>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-5 space-y-4 bg-bg/30">
            {messages.length === 0 && !isAnalyzing && (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">✦</span>
                <p className="text-gray-400 font-medium text-sm">Start a conversation with CrewSense Agent</p>
              </div>
            )}

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-4 ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "brutal-card-flat bg-white"
                  }`}
                >
                  {msg.role === "agent" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">✦</span>
                      <span className="text-xs font-bold text-pink uppercase">CrewSense</span>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {/* Analysis State */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="brutal-card-flat bg-white p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-pink animate-pulse" />
                    <span className="text-xs font-bold uppercase text-pink">CrewSense is Analyzing</span>
                  </div>
                  <div className="space-y-1.5">
                    {analysisSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 text-xs"
                      >
                        {step.status === "completed" ? (
                          <Check size={13} className="text-green shrink-0" />
                        ) : step.status === "in_progress" ? (
                          <Loader2 size={13} className="text-pink animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0" />
                        )}
                        <span className={step.status === "completed" ? "text-gray-600" : step.status === "in_progress" ? "text-black font-semibold" : "text-gray-300"}>
                          {step.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="px-5 py-3 border-t border-black/5 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-xs font-semibold px-3 py-1.5 bg-bg border-2 border-black/10 rounded-full hover:border-black hover:bg-white transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t-2 border-black/10">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your team..."
                className="flex-1 px-4 py-3 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink bg-white"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={!input.trim() || isAnalyzing}
                className="brutal-btn brutal-btn-dark px-4 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

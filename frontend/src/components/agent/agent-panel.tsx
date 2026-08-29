"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronUp, ChevronDown, Send, ArrowRight, X, AlertCircle } from "lucide-react";
import * as api from "@/lib/api";
import type { AgentInsight } from "@/lib/types";

export function CrewSenseAgentPanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [quickQuestion, setQuickQuestion] = useState("");

  useEffect(() => {
    api.getAgentInsights().then(setInsights);
  }, []);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    router.push(`/manager/agent?q=${encodeURIComponent(quickQuestion)}`);
  };

  const topThree = insights.slice(0, 3);

  const emojiMap: Record<string, string> = {
    critical: "🔴",
    warning: "🟠",
    info: "🟡",
    success: "🟢",
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 brutal-btn brutal-btn-dark py-3 px-4 shadow-[4px_4px_0px_#FF9ECF] flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
        aria-label="Open CrewSense Agent"
      >
        <span className="text-pink text-lg font-bold">✦</span>
        <span className="font-bold text-sm tracking-wider">CREWSENSE AGENT</span>
        <span className="w-2.5 h-2.5 rounded-full bg-green agent-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="brutal-card-agent overflow-hidden border-3 border-black shadow-[6px_6px_0px_#1A1A1A]"
      >
        {/* Header */}
        <div className="p-3.5 bg-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-pink text-lg font-bold">✦</span>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                CREWSENSE AGENT
              </span>
            </div>
            <div className="flex items-center gap-1 ml-1">
              <span className="w-2 h-2 rounded-full bg-green agent-pulse" />
              <span className="text-[10px] font-bold text-green uppercase">ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-3 bg-[#1E1E1E]"
            >
              <div className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                <span>I found <strong className="text-pink">3 potential risks</strong> requiring attention.</span>
              </div>

              {/* Insights List */}
              <div className="space-y-2">
                {topThree.map((item) => (
                  <Link
                    key={item.id}
                    href={item.actionRoute || "/manager/agent"}
                    className="block p-2.5 bg-black/40 hover:bg-black/70 rounded-lg border border-white/5 transition-all group"
                  >
                    <div className="flex items-start gap-2 text-xs">
                      <span className="shrink-0 text-sm mt-0.5">{emojiMap[item.severity] || "🟡"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white group-hover:text-pink transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Action button */}
              <div className="pt-1 flex gap-2">
                <Link
                  href="/manager/agent"
                  className="flex-1 brutal-btn brutal-btn-primary brutal-btn-sm text-[11px] py-2 font-bold flex items-center justify-center gap-1 text-black"
                >
                  VIEW FULL COMMAND CENTER <ArrowRight size={12} />
                </Link>
              </div>

              {/* Quick Prompt Input */}
              <form onSubmit={handleAsk} className="pt-2 border-t border-white/10 flex gap-1.5">
                <input
                  type="text"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  placeholder="Ask CrewSense anything..."
                  className="flex-1 px-3 py-1.5 bg-black/60 border border-white/20 rounded-md text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink font-medium"
                />
                <button
                  type="submit"
                  disabled={!quickQuestion.trim()}
                  className="px-2.5 py-1.5 bg-pink text-black font-bold rounded-md text-xs hover:bg-pink/80 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

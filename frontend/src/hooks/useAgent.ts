"use client";

import { useState, useCallback } from "react";
import type { AgentMessage, AgentInsight, AnalysisStep } from "@/lib/types";
import * as api from "@/lib/api";

const DEFAULT_ANALYSIS_STEPS: AnalysisStep[] = [
  { label: "Understanding project requirements", status: "pending" },
  { label: "Checking employee skills", status: "pending" },
  { label: "Calculating effective capacity", status: "pending" },
  { label: "Checking deadlines", status: "pending" },
  { label: "Mapping dependencies", status: "pending" },
  { label: "Detecting bottlenecks", status: "pending" },
  { label: "Simulating allocations", status: "pending" },
  { label: "Preparing recommendation", status: "pending" },
];

export function useAgent() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getAgentInsights();
      setInsights(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: AgentMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsAnalyzing(true);
    const steps = DEFAULT_ANALYSIS_STEPS.map((s) => ({ ...s }));
    setAnalysisSteps(steps);

    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 250));
      setAnalysisSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "completed" : idx === i ? "in_progress" : "pending",
        }))
      );
    }
    // Complete all
    await new Promise((r) => setTimeout(r, 250));
    setAnalysisSteps((prev) => prev.map((s) => ({ ...s, status: "completed" as const })));

    const response = await api.askAgent(content);
    setMessages((prev) => [...prev, response]);
    setIsAnalyzing(false);
    setAnalysisSteps([]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    insights,
    isAnalyzing,
    analysisSteps,
    isLoading,
    loadInsights,
    sendMessage,
    clearMessages,
  };
}

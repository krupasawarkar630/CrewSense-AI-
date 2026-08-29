"use client";

import { useState, useCallback } from "react";
import type { Recommendation } from "@/lib/types";
import * as api from "@/lib/api";

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getRecommendations();
      setRecommendations(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approve = useCallback(async (id: string) => {
    await api.approveRecommendation(id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
  }, []);

  const reject = useCallback(async (id: string) => {
    await api.rejectRecommendation(id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
  }, []);

  return { recommendations, isLoading, loadRecommendations, approve, reject };
}

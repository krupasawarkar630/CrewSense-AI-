"use client";

import { useState, useCallback } from "react";
import type { SimulationResponse } from "@/lib/types";
import * as api from "@/lib/api";

export function useSimulations() {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulate = useCallback(async (scenario: string) => {
    setIsSimulating(true);
    try {
      const data = await api.simulateScenario(scenario);
      setResult(data);
    } finally {
      setIsSimulating(false);
    }
  }, []);

  const optimize = useCallback(async () => {
    setIsSimulating(true);
    try {
      const data = await api.optimizeTeam();
      setResult(data);
    } finally {
      setIsSimulating(false);
    }
  }, []);

  const clearResult = useCallback(() => setResult(null), []);

  return { result, isSimulating, simulate, optimize, clearResult };
}

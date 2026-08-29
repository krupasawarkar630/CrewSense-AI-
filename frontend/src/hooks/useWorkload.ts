"use client";

import { useState, useCallback } from "react";
import type { Employee, WorkloadStatus } from "@/lib/types";
import * as api from "@/lib/api";

export function useWorkload() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<WorkloadStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);

  const loadWorkload = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeam();
      setTeam(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredTeam = filter === "all" ? team : team.filter((e) => e.workloadStatus === filter);

  return { team, filteredTeam, filter, setFilter, isLoading, loadWorkload };
}

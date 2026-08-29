"use client";

import { useState, useCallback } from "react";
import type { Employee } from "@/lib/types";
import * as api from "@/lib/api";

export function useTeam() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadTeam = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeam();
      setTeam(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadEmployee = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await api.getEmployee(id);
      setSelectedEmployee(data || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { team, selectedEmployee, isLoading, loadTeam, loadEmployee, setSelectedEmployee };
}

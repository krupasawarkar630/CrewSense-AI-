"use client";

import { useState, useCallback } from "react";
import type { Task } from "@/lib/types";
import * as api from "@/lib/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTasksByProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    try {
      const data = await api.getTasksByProject(projectId);
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  }, []);

  const reassignTask = useCallback(async (taskId: string, employeeId: string) => {
    await api.assignTask(taskId, employeeId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, assigneeId: employeeId } : t)));
  }, []);

  return { tasks, isLoading, loadTasks, loadTasksByProject, updateTaskStatus, reassignTask };
}

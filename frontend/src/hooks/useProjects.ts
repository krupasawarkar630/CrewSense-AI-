"use client";

import { useState, useCallback } from "react";
import type { Project } from "@/lib/types";
import * as api from "@/lib/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await api.getProject(id);
      setSelectedProject(data || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { projects, selectedProject, isLoading, loadProjects, loadProject, setSelectedProject };
}

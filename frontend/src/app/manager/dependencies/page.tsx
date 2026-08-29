"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import * as api from "@/lib/api";
import type { Dependency, Task } from "@/lib/types";

export default function DependenciesPage() {
  const [deps, setDeps] = useState<Dependency[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.getDependencies().then(setDeps);
    api.getTasks().then(setTasks);
  }, []);

  const getTaskTitle = (id: string) => {
    const t = tasks.find((t) => t.id === id);
    return t ? (t.title.length > 22 ? t.title.slice(0, 20) + "..." : t.title) : id;
  };

  // Build graph nodes and edges from Phoenix critical path
  const phoenixDeps = deps.filter((d) => d.isCritical && d.sourceTaskId.startsWith("task-ph"));
  const nodeIds = new Set<string>();
  phoenixDeps.forEach((d) => { nodeIds.add(d.sourceTaskId); nodeIds.add(d.targetTaskId); });
  
  const nodeArray = Array.from(nodeIds);
  const nodes: Node[] = nodeArray.map((id, i) => {
    const task = tasks.find((t) => t.id === id);
    const isBlocked = task?.status === "blocked";
    const isDone = task?.status === "done";
    return {
      id,
      position: { x: (i % 3) * 280 + 50, y: Math.floor(i / 3) * 140 + 50 },
      data: { label: getTaskTitle(id) },
      style: {
        background: isBlocked ? "#FF6B6B" : isDone ? "#6EE7B7" : "#FFFFFF",
        color: isBlocked ? "#fff" : "#1A1A1A",
        border: "2.5px solid #1A1A1A",
        borderRadius: "10px",
        padding: "12px 16px",
        fontWeight: 700,
        fontSize: "12px",
        boxShadow: isBlocked ? "4px 4px 0px #FF6B6B" : "3px 3px 0px #1A1A1A",
      },
    };
  });

  const edges: Edge[] = phoenixDeps.map((d) => ({
    id: d.id,
    source: d.sourceTaskId,
    target: d.targetTaskId,
    animated: d.status === "active",
    style: { stroke: d.isCritical ? "#FF6B6B" : "#1A1A1A", strokeWidth: 2.5 },
    label: d.isCritical ? "CRITICAL" : "",
    labelStyle: { fontSize: 9, fontWeight: 700, fill: "#FF6B6B" },
  }));

  const criticalBottleneck = deps.filter((d) => d.isCritical && d.status === "active" || d.status === "blocked");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">DEPENDENCIES</h1>
        <p className="text-gray-500 text-sm mt-1">Interactive dependency graph with critical path and bottleneck detection.</p>
      </motion.div>

      {/* Bottleneck Alert */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="brutal-card p-5 !border-red !bg-red/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🚨</span>
            <h3 className="font-bold uppercase">Critical Bottleneck</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="font-bold text-lg">ARJUN MEHTA</div>
              <p className="text-sm text-gray-600">4 downstream tasks depend on his API work.</p>
              <p className="text-sm text-red font-bold mt-1">Impact: 2-day delay → projected 3-day project delay</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="brutal-btn brutal-btn-sm brutal-btn-primary">Add Support</button>
              <button className="brutal-btn brutal-btn-sm brutal-btn-outline">Reassign</button>
              <button className="brutal-btn brutal-btn-sm brutal-btn-outline">Simulate</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dependency Graph */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="brutal-card overflow-hidden" style={{ height: "500px" }}>
          <div className="p-4 border-b-2 border-black/10">
            <h3 className="font-bold uppercase tracking-tight">Phoenix — Critical Path Dependencies</h3>
          </div>
          {nodes.length > 0 && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} color="#E5E5E5" />
              <Controls />
            </ReactFlow>
          )}
        </div>
      </motion.div>

      {/* Dependency Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="brutal-card overflow-hidden">
          <div className="p-4 border-b-2 border-black/10">
            <h3 className="font-bold uppercase tracking-tight">All Dependencies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-bg/30">
                  {["Source", "Target", "Type", "Critical", "Status", "Impact"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 font-bold text-xs uppercase text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deps.map((d) => (
                  <tr key={d.id} className="border-b border-black/5 hover:bg-bg/30">
                    <td className="py-2.5 px-3 font-bold text-xs">{getTaskTitle(d.sourceTaskId)}</td>
                    <td className="py-2.5 px-3 font-bold text-xs">{getTaskTitle(d.targetTaskId)}</td>
                    <td className="py-2.5 px-3"><span className="brutal-badge bg-gray-200 text-gray-700">{d.type.toUpperCase()}</span></td>
                    <td className="py-2.5 px-3">{d.isCritical ? <span className="brutal-badge bg-red text-white">YES</span> : <span className="text-xs text-gray-400">No</span>}</td>
                    <td className="py-2.5 px-3">
                      <span className={`brutal-badge ${d.status === "blocked" ? "bg-red text-white" : d.status === "active" ? "bg-blue text-white" : "bg-green text-black"}`}>
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-gray-500 max-w-[200px] truncate">{d.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

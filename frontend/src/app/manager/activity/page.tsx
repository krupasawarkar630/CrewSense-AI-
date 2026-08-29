"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Clock, Check, GitBranch, ArrowRight } from "lucide-react";
import * as api from "@/lib/api";
import type { Activity } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  agent_detection: <Sparkles size={16} className="text-pink" />,
  approval: <Check size={16} className="text-green" />,
  deadline_change: <Clock size={16} className="text-orange" />,
  dependency_blocked: <GitBranch size={16} className="text-red" />,
  risk_update: <AlertTriangle size={16} className="text-yellow" />,
  task_reassignment: <ArrowRight size={16} className="text-blue" />,
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    api.getActivities().then(setActivities);
  }, []);

  const grouped: Record<string, Activity[]> = {};
  activities.forEach((a) => {
    const date = new Date(a.timestamp).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(a);
  });

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">ACTIVITY</h1>
        <p className="text-gray-500 text-sm mt-1">Timeline of team activity and agent actions.</p>
      </motion.div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, items]) => (
          <motion.div key={date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-xs font-bold uppercase text-gray-400 mb-3">{date}</div>
            <div className="space-y-2">
              {items.map((act) => (
                <div key={act.id} className="brutal-card p-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-bg rounded-lg flex items-center justify-center shrink-0 border-2 border-black/10">
                    {iconMap[act.type] || <Clock size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{act.title}</div>
                    <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

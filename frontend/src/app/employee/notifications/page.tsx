"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as api from "@/lib/api";
import type { Notification } from "@/lib/types";

export default function EmployeeNotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    api.getNotifications().then(setNotifs);
  }, []);

  const severityColors: Record<string, string> = {
    critical: "bg-red", warning: "bg-orange", info: "bg-blue", success: "bg-green",
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">NOTIFICATIONS</h1>
      </motion.div>

      <div className="space-y-2">
        {notifs.map((n) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`brutal-card p-4 flex items-start gap-3 ${!n.read ? "!bg-pink/5" : ""}`}>
              <div className={`w-3 h-3 rounded-full ${severityColors[n.severity]} shrink-0 mt-1`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{n.title}</div>
                <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(n.timestamp).toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {!n.read && <span className="brutal-badge bg-pink text-black text-[9px]">NEW</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

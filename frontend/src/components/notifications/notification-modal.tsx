"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, ExternalLink, X } from "lucide-react";
import * as api from "@/lib/api";
import type { Notification } from "@/lib/types";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.getNotifications().then(setNotifications);
    }
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const severityDot: Record<string, string> = {
    critical: "bg-red",
    warning: "bg-orange",
    info: "bg-blue",
    success: "bg-green",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="w-full max-w-md bg-white brutal-card border-3 border-black shadow-[6px_6px_0px_#1A1A1A] overflow-hidden mt-12 sm:mt-14"
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-bg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-pink rounded flex items-center justify-center font-bold text-black border border-black">
              ✦
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider">AI Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[11px] font-bold text-gray-600 hover:text-black transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-black/10">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-semibold">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 hover:bg-bg/60 transition-colors flex items-start gap-3 ${
                  !notif.read ? "bg-pink/5" : ""
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${severityDot[notif.severity] || "bg-yellow"} mt-1.5 shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs uppercase tracking-tight truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                    {notif.description}
                  </p>
                  {notif.actionRoute && (
                    <Link
                      href={notif.actionRoute}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue hover:underline mt-1.5"
                    >
                      View details <ExternalLink size={10} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t-2 border-black bg-bg flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">CrewSense Autonomous Agent</span>
          <span className="font-bold text-green flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" /> Live Monitoring
          </span>
        </div>
      </motion.div>
    </div>
  );
}

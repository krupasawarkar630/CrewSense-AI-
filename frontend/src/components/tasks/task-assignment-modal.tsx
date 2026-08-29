"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Check, ArrowRight, ShieldCheck, Clock, UserCheck, AlertCircle } from "lucide-react";
import type { Task, Employee } from "@/lib/types";
import { employees } from "@/lib/mock";

interface TaskAssignmentModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (taskId: string, employeeId: string) => void;
}

export function TaskAssignmentModal({ task, isOpen, onClose, onAssign }: TaskAssignmentModalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("emp-priya");
  const [assigned, setAssigned] = useState(false);

  if (!isOpen || !task) return null;

  const candidates = [
    {
      id: "emp-priya",
      name: "Priya Patel",
      role: "Full Stack Developer",
      skillMatch: 89,
      availableCapacity: 32,
      dependencyConflict: "NONE",
      risk: "LOW",
      confidence: 91,
      recommended: true,
      reason: "Optimal capacity, 89% React/Node match, zero dependency blocks.",
    },
    {
      id: "emp-suresh",
      name: "Suresh Kumar",
      role: "Backend Developer",
      skillMatch: 74,
      availableCapacity: 46,
      dependencyConflict: "NONE",
      risk: "LOW",
      confidence: 78,
      recommended: false,
      reason: "High availability, but slightly lower frontend framework match.",
    },
    {
      id: "emp-tanvi",
      name: "Tanvi Reddy",
      role: "Frontend Developer",
      skillMatch: 92,
      availableCapacity: 28,
      dependencyConflict: "Phoenix Checkout UI",
      risk: "MEDIUM",
      confidence: 76,
      recommended: false,
      reason: "High skill match but currently on critical path for Checkout UI.",
    },
  ];

  const handleConfirmAssign = () => {
    setAssigned(true);
    setTimeout(() => {
      onAssign(task.id, selectedCandidate);
      setAssigned(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-white brutal-card border-3 border-black shadow-[8px_8px_0px_#1A1A1A] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b-2.5 border-black bg-bg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-pink rounded-lg flex items-center justify-center font-bold text-base border-2 border-black">
              ✦
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-tight">
                AI Task Assignment Recommendation
              </h2>
              <p className="text-xs text-gray-500 font-semibold">
                Task: <span className="text-black font-bold">{task.title}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Agent Banner */}
          <div className="brutal-card-agent p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-pink animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink">
                ✦ CrewSense Recommendation
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              CrewSense evaluated skills, current workload, pipeline dependencies, and upcoming deadlines across 24 team members.
            </p>
          </div>

          {/* Candidates */}
          <div className="space-y-3">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                onClick={() => setSelectedCandidate(cand.id)}
                className={`brutal-card-flat p-4 cursor-pointer transition-all ${
                  selectedCandidate === cand.id
                    ? "!border-black !bg-pink/10 shadow-[4px_4px_0px_#FF9ECF]"
                    : "hover:bg-bg/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-xs">
                      {cand.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {cand.name}
                        {cand.recommended && (
                          <span className="brutal-badge bg-green text-black text-[9px] py-0.5">
                            AI BEST MATCH
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{cand.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Skill Match</span>
                      <strong className="text-green text-sm">{cand.skillMatch}%</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Available</span>
                      <strong className="text-sm">{cand.availableCapacity}%</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Confidence</span>
                      <strong className="text-pink text-sm">{cand.confidence}%</strong>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 border-t border-black/5 pt-2 flex items-center justify-between">
                  <span>{cand.reason}</span>
                  <span
                    className={`font-bold text-[10px] ${
                      cand.risk === "LOW" ? "text-green" : "text-orange"
                    }`}
                  >
                    Risk: {cand.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2.5 border-black bg-bg flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="brutal-btn brutal-btn-outline text-xs py-2.5"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmAssign}
              disabled={assigned}
              className="brutal-btn brutal-btn-primary text-xs py-2.5 flex items-center gap-1.5"
            >
              {assigned ? (
                <>
                  <Check size={14} /> Assigned Successfully
                </>
              ) : (
                <>
                  <UserCheck size={14} /> Assign Task
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

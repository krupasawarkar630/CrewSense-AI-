"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X, FlaskConical, ChevronRight } from "lucide-react";
import * as api from "@/lib/api";
import type { Recommendation } from "@/lib/types";
import { employees } from "@/lib/mock";

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [approvedId, setApprovedId] = useState<string | null>(null);

  useEffect(() => {
    api.getRecommendations().then(setRecs);
  }, []);

  const handleApprove = (id: string) => {
    setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)));
    setApprovedId(id);
    setTimeout(() => setApprovedId(null), 3000);
  };

  const handleReject = (id: string) => {
    setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r)));
  };

  const getEmpName = (id?: string) => employees.find((e) => e.id === id)?.name || "—";
  const pending = recs.filter((r) => r.status === "pending");
  const resolved = recs.filter((r) => r.status !== "pending");

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <h1 className="text-3xl font-bold tracking-tight">CREWSENSE RECOMMENDATIONS</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">{pending.length} pending recommendations</p>
      </motion.div>

      {/* Approved toast */}
      <AnimatePresence>
        {approvedId && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="brutal-card p-4 !border-green !bg-green/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center"><Check size={18} className="text-black" /></div>
            <div>
              <div className="font-bold text-sm">✓ Plan Approved</div>
              <div className="text-xs text-gray-500">CrewSense is recalculating workloads and risk.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending */}
      {pending.length === 0 ? (
        <div className="brutal-card p-8 text-center">
          <span className="text-4xl block mb-3">✦</span>
          <h2 className="text-xl font-bold mb-2">TEAM LOOKS HEALTHY</h2>
          <p className="text-gray-500 text-sm">CrewSense currently has no critical recommendations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="brutal-card p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-pink" />
                      <h3 className="font-bold">{rec.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="text-xs text-gray-400 mb-3">
                      <strong>Reason:</strong> {rec.reason}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {rec.expectedImpact.workloadChange && (
                        <div className="bg-bg rounded-lg p-2">
                          <div className="text-gray-400 font-semibold">Workload</div>
                          <div className="font-bold text-green">{rec.expectedImpact.workloadChange > 0 ? "+" : ""}{rec.expectedImpact.workloadChange}%</div>
                        </div>
                      )}
                      {rec.expectedImpact.riskReduction && (
                        <div className="bg-bg rounded-lg p-2">
                          <div className="text-gray-400 font-semibold">Risk Reduction</div>
                          <div className="font-bold text-green">-{rec.expectedImpact.riskReduction}%</div>
                        </div>
                      )}
                      {rec.expectedImpact.delayReduction && (
                        <div className="bg-bg rounded-lg p-2">
                          <div className="text-gray-400 font-semibold">Delay Reduction</div>
                          <div className="font-bold text-green">-{rec.expectedImpact.delayReduction}%</div>
                        </div>
                      )}
                      <div className="bg-bg rounded-lg p-2">
                        <div className="text-gray-400 font-semibold">Confidence</div>
                        <div className="font-bold text-pink">{rec.confidence}%</div>
                      </div>
                    </div>

                    {rec.fromEmployeeId && rec.toEmployeeId && (
                      <div className="mt-3 text-xs flex items-center gap-2">
                        <span className="font-bold">{getEmpName(rec.fromEmployeeId)}</span>
                        <ChevronRight size={12} />
                        <span className="font-bold text-green">{getEmpName(rec.toEmployeeId)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2 shrink-0">
                    <button onClick={() => handleApprove(rec.id)} className="brutal-btn brutal-btn-sm brutal-btn-green flex-1 lg:flex-none">
                      <Check size={14} /> Approve
                    </button>
                    <button onClick={() => handleReject(rec.id)} className="brutal-btn brutal-btn-sm brutal-btn-red flex-1 lg:flex-none">
                      <X size={14} /> Reject
                    </button>
                    <button className="brutal-btn brutal-btn-sm brutal-btn-outline flex-1 lg:flex-none">
                      <FlaskConical size={14} /> Simulate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h2 className="font-bold uppercase tracking-tight text-gray-400 mb-3">Resolved</h2>
          <div className="space-y-2">
            {resolved.map((rec) => (
              <div key={rec.id} className="brutal-card-flat p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rec.status === "approved" ? <Check size={14} className="text-green" /> : <X size={14} className="text-red" />}
                    <span className="font-bold text-sm">{rec.title}</span>
                  </div>
                  <span className={`brutal-badge ${rec.status === "approved" ? "bg-green text-black" : "bg-red text-white"}`}>
                    {rec.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

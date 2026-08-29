"use client";

import { motion } from "framer-motion";
import { Settings, Bell, User, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">SETTINGS</h1>
      </motion.div>

      <div className="space-y-4">
        {[
          { icon: User, title: "Profile", desc: "Manage your account settings", fields: [{ label: "Name", value: "Alex Morgan" }, { label: "Email", value: "alex@crewsense.ai" }, { label: "Role", value: "Engineering Manager" }] },
          { icon: Bell, title: "Notifications", desc: "Configure alert preferences", fields: [{ label: "Email Alerts", value: "Enabled" }, { label: "Agent Insights", value: "Real-time" }, { label: "Risk Alerts", value: "Critical & High" }] },
          { icon: Shield, title: "Security", desc: "Security and access settings", fields: [{ label: "Two-Factor", value: "Enabled" }, { label: "API Access", value: "Active" }] },
          { icon: Palette, title: "Appearance", desc: "Customize the interface", fields: [{ label: "Theme", value: "Light (Neo-Brutalist)" }, { label: "Density", value: "Comfortable" }] },
        ].map((section) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="brutal-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-bg rounded-lg flex items-center justify-center border-2 border-black/10">
                  <section.icon size={18} />
                </div>
                <div>
                  <h3 className="font-bold">{section.title}</h3>
                  <p className="text-xs text-gray-500">{section.desc}</p>
                </div>
              </div>
              <div className="space-y-3">
                {section.fields.map((f) => (
                  <div key={f.label} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                    <span className="text-sm text-gray-500">{f.label}</span>
                    <span className="text-sm font-bold">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

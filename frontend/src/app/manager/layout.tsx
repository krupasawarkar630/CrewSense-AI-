"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Brain,
  GitBranch,
  FlaskConical,
  Lightbulb,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { CrewSenseAgentPanel } from "@/components/agent/agent-panel";
import { NotificationModal } from "@/components/notifications/notification-modal";

const NAV_ITEMS = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager/agent", label: "✦ Agent", icon: Sparkles, isAgent: true },
  { href: "/manager/projects", label: "Projects", icon: FolderKanban },
  { href: "/manager/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/manager/team", label: "Team", icon: Users },
  { href: "/manager/workload", label: "Workload", icon: BarChart3 },
  { href: "/manager/skills", label: "Skills", icon: Brain },
  { href: "/manager/dependencies", label: "Dependencies", icon: GitBranch },
  { href: "/manager/simulations", label: "Simulations", icon: FlaskConical },
  { href: "/manager/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/manager/activity", label: "Activity", icon: Activity },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r-2.5 border-black flex flex-col transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ borderRightWidth: "2.5px" }}
      >
        {/* Logo */}
        <div className="p-5 border-b-2 border-black/10">
          <Link href="/manager/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#FF9ECF]">
              <span className="text-pink font-bold text-base">✦</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight leading-none">CREWSENSE</div>
              <div className="text-[10px] text-gray-500 font-bold tracking-widest mt-0.5">AI AGENT</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/manager/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    item.isAgent
                      ? isActive
                        ? "bg-black text-pink shadow-[3px_3px_0px_#FF9ECF] border-2 border-black"
                        : "bg-pink/15 text-black hover:bg-black hover:text-pink border-2 border-transparent hover:border-black"
                      : isActive
                      ? "bg-black text-white shadow-[3px_3px_0px_#1A1A1A] border-2 border-black"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black border-2 border-transparent"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.isAgent && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-green agent-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t-2 border-black/10 space-y-0.5">
          <Link
            href="/manager/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-red hover:bg-red/10 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="bg-white border-b-2.5 border-black px-4 lg:px-6 py-3 flex items-center justify-between shrink-0"
          style={{ borderBottomWidth: "2.5px" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg border-2 border-black"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, tasks, people..."
                className="pl-9 pr-4 py-1.5 bg-bg border-2 border-black rounded-lg text-xs w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-pink transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Agent Live Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-[11px] font-bold border border-black shadow-[2px_2px_0px_#FF9ECF]">
              <span className="text-pink">✦</span>
              <span>AGENT ACTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green agent-pulse ml-0.5" />
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setNotifsOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors border-2 border-black"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red rounded-full border-2 border-white" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#1A1A1A]">
              AM
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative">
          {children}
        </main>
      </div>

      {/* Reusable Persistent Agent Panel */}
      <CrewSenseAgentPanel />

      {/* Notifications Modal */}
      <NotificationModal isOpen={notifsOpen} onClose={() => setNotifsOpen(false)} />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, FolderKanban, User, Bell, LogOut, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/employee/projects", label: "My Projects", icon: FolderKanban },
  { href: "/employee/profile", label: "Profile", icon: User },
  { href: "/employee/notifications", label: "Notifications", icon: Bell },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r-2.5 border-black flex flex-col transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ borderRightWidth: "2.5px" }}
      >
        <div className="p-5 border-b-2 border-black/10">
          <Link href="/employee/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-pink font-bold text-base">✦</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight leading-none">CREWSENSE</div>
              <div className="text-[10px] text-gray-400 font-bold tracking-widest">EMPLOYEE</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive ? "bg-black text-white shadow-[3px_3px_0px_#1A1A1A]" : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t-2 border-black/10">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red hover:bg-red/10 transition-all">
            <LogOut size={18} /> <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2.5 border-black px-4 lg:px-6 py-3 flex items-center justify-between shrink-0" style={{ borderBottomWidth: "2.5px" }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Open sidebar">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-9 h-9 bg-pink text-black rounded-lg flex items-center justify-center font-bold text-xs border-2 border-black">RS</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

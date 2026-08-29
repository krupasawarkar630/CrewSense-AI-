"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Role } from "@/lib/types";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading(true);
    const loginEmail = email || (selectedRole === "manager" ? "alex@crewsense.ai" : "rahul@crewsense.ai");
    await loginUser(loginEmail, "demo123");
    if (selectedRole === "manager") {
      router.push("/manager/dashboard");
    } else {
      router.push("/employee/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* Left — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/2 bg-black text-white p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue rounded-full blur-[100px] opacity-15" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-pink rounded-lg border-2 border-white/20 flex items-center justify-center font-bold text-black text-lg">
              ✦
            </div>
            <span className="text-xl font-bold tracking-tight">CREWSENSE AI</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            SENSE THE
            <br />
            <span className="text-pink">WORK.</span>
          </h1>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
            PREVENT THE
            <br />
            <span className="text-pink">RISK.</span>
          </h2>

          <p className="text-lg text-gray-400 leading-relaxed max-w-md">
            AI workforce intelligence that reveals hidden work, predicts delivery
            risks, and simulates better team decisions before problems happen.
          </p>

          <div className="mt-12 flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-green animate-pulse" />
            AGENT ACTIVE
          </div>
        </div>
      </motion.div>

      {/* Right — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center"
      >
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Select Your Role</h2>
          <p className="text-gray-500 mb-8">Choose how you want to access CrewSense.</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setSelectedRole("manager")}
              className={`brutal-card-flat p-5 text-left cursor-pointer transition-all ${
                selectedRole === "manager"
                  ? "!border-pink !bg-pink/10 shadow-[4px_4px_0px_#FF9ECF]"
                  : "hover:shadow-[3px_3px_0px_#1A1A1A]"
              }`}
            >
              <div className="text-2xl mb-2">👔</div>
              <div className="font-bold text-sm uppercase">Manager</div>
              <div className="text-xs text-gray-500 mt-1">Full dashboard access</div>
            </button>

            <button
              onClick={() => setSelectedRole("employee")}
              className={`brutal-card-flat p-5 text-left cursor-pointer transition-all ${
                selectedRole === "employee"
                  ? "!border-blue !bg-blue/10 shadow-[4px_4px_0px_#4F7DF9]"
                  : "hover:shadow-[3px_3px_0px_#1A1A1A]"
              }`}
            >
              <div className="text-2xl mb-2">💼</div>
              <div className="font-bold text-sm uppercase">Employee</div>
              <div className="text-xs text-gray-500 mt-1">Personal workspace</div>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === "employee" ? "rahul@crewsense.ai" : "alex@crewsense.ai"}
                className="w-full px-4 py-3 border-2.5 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink bg-white"
                style={{ borderWidth: "2.5px" }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                defaultValue="demo123"
                className="w-full px-4 py-3 border-2.5 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink bg-white"
                style={{ borderWidth: "2.5px" }}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedRole || isLoading}
              className="w-full brutal-btn brutal-btn-dark text-base py-3.5 mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  ✦ Enter CrewSense
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo mode — any email and password will work
          </p>
        </div>
      </motion.div>
    </div>
  );
}

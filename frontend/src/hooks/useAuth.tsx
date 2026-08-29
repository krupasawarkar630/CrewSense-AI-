"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Role } from "@/lib/types";

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role | null;
  userName: string;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  userName: "",
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("");

  const login = useCallback((selectedRole: Role) => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    setUserName(selectedRole === "manager" ? "Alex Morgan" : "Rahul Sharma");
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setRole(null);
    setUserName("");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "citizen" | "observer" | "analyst";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users
const DEMO_USERS: (User & { password: string })[] = [
  { id: "1", name: "Admin Kumar", email: "admin@electwatch.gov", password: "admin123", role: "admin", verified: true },
  { id: "2", name: "Priya Sharma", email: "citizen@electwatch.gov", password: "citizen123", role: "citizen", verified: true },
  { id: "3", name: "Raj Observer", email: "observer@electwatch.gov", password: "observer123", role: "observer", verified: true },
  { id: "4", name: "Ananya Analyst", email: "analyst@electwatch.gov", password: "analyst123", role: "analyst", verified: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ems_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid credentials" };
    const { password: _p, ...userData } = found;
    setUser(userData);
    localStorage.setItem("ems_user", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ems_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

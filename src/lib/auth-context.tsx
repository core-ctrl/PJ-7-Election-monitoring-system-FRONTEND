"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "./api";

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        // Decode user info from token or save email
        const userData: User = {
          name: email.split("@")[0],
          email: email,
          role: "VOTER"
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const data = await registerUser(name, email, password);
      if (data === "Registered successfully" || data.message) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
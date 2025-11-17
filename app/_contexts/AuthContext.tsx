"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { UserType } from "@/app/_types/auth";

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  isLoggedIn: boolean;
  login: (token: string, user: UserType) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);

    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        setUser(parsed);
      } catch (err) {
        console.error("❌ user JSON 파싱 실패:", err);
        localStorage.removeItem("user"); // 잘못된 값은 바로 제거
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string, user: UserType) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn: !!token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
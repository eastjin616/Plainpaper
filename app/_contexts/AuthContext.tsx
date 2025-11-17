"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { UserType } from "@/app/_types/auth";

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 앱 시작 시 localStorage → token 로드 + /auth/me 서버 요청
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    // 서버에서 사용자 정보 가져오기
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => {
        // 토큰이 유효하지 않으면 로그아웃 처리
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 로그인 → token만 저장하고, user는 /auth/me에서 자동으로 읽힘
  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });

    const userData = await res.json();
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn: !!token,
        loading,
        login,
        logout,
      }}
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
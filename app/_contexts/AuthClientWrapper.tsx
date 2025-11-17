"use client";

import { AuthProvider } from "./AuthContext";

export default function AuthClientWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
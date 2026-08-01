"use client";

import ProtectedPage from "@/app/_contexts/ProtectedPage";
import Dashboard from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <Dashboard />
    </ProtectedPage>
  );
}

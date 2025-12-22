import Header from "@/components/layout/Header";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        © 2025 Plainpaper. All rights reserved.
      </footer>
    </div>
  );
}

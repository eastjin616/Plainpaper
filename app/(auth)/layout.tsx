import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen flex flex-col justify-center">
      {children}
      <footer className="mt-10 py-6 text-center text-muted-foreground text-sm">
        © 2026 CareerPilot. Open source · MIT License
      </footer>
    </div>
  );
}
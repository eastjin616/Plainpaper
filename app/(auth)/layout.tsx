import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-b from-zinc-50 to-zinc-100 min-h-screen flex flex-col justify-center">
        {children}
        <footer className="mt-10 py-6 text-center text-zinc-400 text-sm">
          © 2025 Plainpaper. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
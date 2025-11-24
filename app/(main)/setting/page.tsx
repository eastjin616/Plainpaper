"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { useAuth } from "@/app/_contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingPage() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (newPassword !== newPasswordCheck) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 4) {
      setError("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "비밀번호 변경에 실패했습니다.");
      }

      setSuccess("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordCheck("");

      // 보안상, 비밀번호 변경 후 로그아웃 + 로그인 페이지로 이동
      setTimeout(() => {
        logout();
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <main className="flex justify-center min-h-screen bg-background p-8">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-foreground">설정</h1>

          <Card className="shadow-sm border-border bg-card/80">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">비밀번호 변경</h2>

              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div>
                  <label className="text-sm text-muted-foreground">현재 비밀번호</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">새 비밀번호</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    새 비밀번호 확인
                  </label>
                  <Input
                    type="password"
                    value={newPasswordCheck}
                    onChange={(e) => setNewPasswordCheck(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive whitespace-pre-line">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-green-600 whitespace-pre-line">
                    {success}
                  </p>
                )}

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                  {loading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Upload, FileText, Sparkles } from "lucide-react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setMessage(`📄 ${selected.name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ 업로드할 파일을 선택해주세요.");
      return;
    }

    setLoading(true);
    setMessage("파일 업로드 중...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/files/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("업로드 실패");
      const data = await res.json();
      console.log("✅ 업로드 성공:", data);

      // 🔄 로딩 페이지로 이동
      router.push(`/analysis/loading/${data.document_id}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        {/* 상단 로고 & 서브카피 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border shadow-sm text-xs text-muted-foreground mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>CareerPilot · AI 취업 코파일럿</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            복잡한 문서, <span className="text-primary">한 번에 이해</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            PDF를 업로드하면 AI가 중요한 내용만 뽑아서 요약해드립니다.
          </p>
        </div>

        {/* 메인 카드 */}
        <Card className="w-full max-w-xl shadow-2xl border-border bg-card/80 backdrop-blur-xl">
          <CardContent className="p-8 space-y-6">
            {/* 업로드 영역 */}
            <label
              htmlFor="file"
              className="border-2 border-dashed border-border rounded-xl py-10 px-6 cursor-pointer hover:bg-accent/50 transition-colors flex flex-col items-center justify-center"
            >
              <Upload className="w-10 h-10 text-primary mb-3" />
              <span className="font-medium text-foreground mb-1">
                파일을 여기로 끌어오거나 클릭해서 선택하세요
              </span>
              <span className="text-xs text-muted-foreground">
                지원 형식: PDF, DOCX, TXT (최대 10MB 권장)
              </span>
              <input
                id="file"
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* 선택된 파일 표시 / 메시지 */}
            <div className="min-h-[32px] flex items-center justify-between text-sm">
              {message ? (
                <p className="text-foreground truncate">{message}</p>
              ) : (
                <p className="text-muted-foreground">
                  아직 선택된 파일이 없습니다.
                </p>
              )}

              {file && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary border border-primary/20">
                  <FileText className="w-3 h-3" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>

            {/* 업로드 버튼 */}
            <Button
              onClick={handleUpload}
              className="w-full mt-2 text-base font-medium"
              disabled={loading}
            >
              {loading ? "업로드 중..." : "파일 업로드하고 분석 시작하기"}
            </Button>

            {/* 하단 안내 */}
            <p className="text-[11px] text-muted-foreground text-left leading-relaxed">
              업로드된 파일은 분석 목적으로만 사용되며, 일정 시간이 지난 뒤
              자동 삭제됩니다.
            </p>
          </CardContent>
        </Card>
      </main>
    </ProtectedPage>
  );
}
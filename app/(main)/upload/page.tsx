"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Upload, File } from "lucide-react";
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

    const token = localStorage.getItem("token"); // 🔥 토큰 불러오기

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 반드시 추가해야 함
      },
      body: formData,
    });

    if (!res.ok) throw new Error("업로드 실패");
    const data = await res.json();
    console.log("✅ 업로드 성공:", data);

    //loading 페이지 띄우기
    router.push(`/analysis/loading/${data.document_id}`);;
  } catch (err) {
    console.error(err);
    setMessage("❌ 업로드 중 오류가 발생했습니다.");
  } finally {
    setLoading(false);
  }
};

  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
        <Card className="w-[480px] p-10 text-center shadow-xl border border-zinc-200 bg-white/80 backdrop-blur">
          <CardContent>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Plainpaper</h1>
            <p className="text-zinc-600 mb-8">
              문서를 업로드 해주세요 <br /> AI가 문서를 이해하기 쉽게 바꿔드립니다.
            </p>

            {/* 업로드 영역 */}
            <label
              htmlFor="file"
              className="border-2 border-dashed border-zinc-300 rounded-lg py-12 px-6 cursor-pointer hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center"
            >
              <Upload className="w-10 h-10 text-zinc-400 mb-3" />
              <span className="text-zinc-500 text-sm">
                파일을 여기로 끌어오거나 클릭하세요
              </span>
              <input
                id="file"
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* 파일명 또는 상태 메시지 */}
            {message && <p className="mt-4 text-sm text-zinc-600">{message}</p>}

            <Button
              onClick={handleUpload}
              className="w-full mt-8 text-lg font-medium"
              disabled={loading}
            >
              {loading ? "업로드 중..." : "파일 업로드 / 확인 시작"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </ProtectedPage>
  );
}
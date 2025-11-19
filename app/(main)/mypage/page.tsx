"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, ArrowRight } from "lucide-react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const res = await fetch(`${API_URL}/documents/list`, {
          credentials: "include"
        });
        const json = await res.json();

        setDocs(json.documents || []);
      } catch (err) {
        console.error("🔥 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  if (loading) {
    return <p className="text-center mt-20">불러오는 중...</p>;
  }

  return (
    <ProtectedPage>
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-8">
        <div className="max-w-4xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-zinc-900">
            📂 업로드 문서 이력
          </h1>

          <div className="space-y-4">
            {docs.map((doc) => (
              <Card
                key={doc.document_id}
                className="shadow-sm border border-zinc-200 bg-white/80 hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/analysis/${doc.document_id}`)}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex flex-col space-y-1">
                    {/* 제목 */}
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-zinc-500" />
                      <span className="font-semibold text-zinc-900">
                        {doc.file_name}
                      </span>
                    </div>

                    {/* 요약 내용 앞부분 */}
                    <p className="text-sm text-zinc-600 line-clamp-1">
                      {doc.summary || "요약 준비 중입니다..."}
                    </p>

                    {/* 날짜 + 상태 */}
                    <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.created_at}
                      </span>
                      <span>• {doc.status === "done" ? "분석 완료" : "분석 중"}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-zinc-400" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button
              onClick={() => router.push("/upload")}
              className="px-8 text-lg"
            >
              새 문서 업로드하기
            </Button>
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}
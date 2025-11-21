"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, ArrowRight, Pointer } from "lucide-react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

import { X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const res = await fetch(`${API_URL}/documents/list`, {
            headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include"
        });
        console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
        console.log("TOKEN:", localStorage.getItem("token"));
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

const handleDelete = async (id: string) => {
  if (!confirm("정말 삭제할까요?")) return;

  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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

                    {/* 날짜 */}
                    <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.created_at}
                      </span>
                      <span>• {doc.status === "done" ? "분석 완료" : "분석 중"}</span>
                    </div>
                  </div>

                  {/* 🔥 삭제 버튼 추가 */}
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(doc.document_id) }
                      className="text-red-500 hover:text-red-700"
                      style={{ cursor: "pointer" }}
                    >
                      <X size={18} />
                    </button>

                    <ArrowRight className="w-5 h-5 text-zinc-400" />
                  </div>
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
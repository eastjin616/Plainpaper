"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  Loader2,
  Trash2,
  Plus,
  CheckCircle,
} from "lucide-react";

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  // 🔥 문서 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제할까요?")) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/files/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setDocs((prev) => prev.filter((doc) => doc.document_id !== id));
    } else {
      alert("삭제 실패");
    }
  };

  // ----------------------------
  // 🔥 로딩 중 Skeleton
  // ----------------------------
  if (loading) {
    return (
      <ProtectedPage>
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
          <Loader2 className="w-10 h-10 text-zinc-500 animate-spin" />
        </main>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <main className="min-h-screen p-10 bg-background relative">

        <h1 className="text-3xl font-bold mb-8 text-foreground">📂 내 문서</h1>

        {/* 문서 없음 */}
        {docs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <FileText className="w-14 h-14 mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium">업로드한 문서가 없습니다</p>
            <p className="text-sm">지금 바로 새로운 문서를 업로드해보세요</p>

            <Button
              className="mt-6 text-lg px-8"
              onClick={() => router.push("/upload")}
            >
              문서 업로드하기
            </Button>
          </div>
        )}

        {/* 문서 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Card
              key={doc.document_id}
              className="group shadow-sm border-border bg-card/80 backdrop-blur hover:shadow-lg transition relative cursor-pointer"
              onClick={() => router.push(`/analysis/${doc.document_id}`)}
            >
              <CardContent className="p-5">

                {/* 상단 파일명 */}
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-medium text-card-foreground truncate">
                    {doc.file_name}
                  </h2>
                </div>

                {/* 요약 본문 */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {doc.summary || "요약 준비 중..."}
                </p>

                {/* 상태 바 */}
                {doc.status !== "done" ? (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>분석 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>분석 완료</span>
                  </div>
                )}

                {/* 생성일 */}
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {doc.created_at}
                </div>

                {/* 삭제 버튼 (hover 시만 보임) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc.document_id);
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-destructive/10 text-destructive hover:bg-destructive/20 p-1.5 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ➕ 플로팅 업로드 버튼 */}
        <button
          onClick={() => router.push("/upload")}
          className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-xl transition"
        >
          <Plus size={24} />
        </button>

      </main>
    </ProtectedPage>
  );
}
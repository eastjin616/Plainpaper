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
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import type { DocumentItem } from "@/app/_types/document";
import { API_URL, authHeaders, extractDetail, getErrorMessage } from "@/lib/api";

export default function MyPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/documents/list`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(extractDetail(payload, "문서 목록을 불러오지 못했습니다."));
      }

      const json = await res.json();
      const items = Array.isArray(json?.documents) ? json.documents : [];
      setDocs(items as DocumentItem[]);
    } catch (err) {
      setError(getErrorMessage(err, "문서 목록을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // 🔥 문서 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제할까요?")) return;

    try {
      const response = await fetch(`${API_URL}/files/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(extractDetail(payload, "삭제에 실패했습니다."));
      }
      setDocs((prev) => prev.filter((doc) => doc.document_id !== id));
    } catch (err) {
      alert(getErrorMessage(err, "삭제에 실패했습니다."));
    }
  };

  const openDocument = (doc: DocumentItem) => {
    router.push(
      doc.status === "done"
        ? `/analysis/${doc.document_id}`
        : `/analysis/loading/${doc.document_id}`
    );
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

        {/* 노후 준비 진단 바로가기 */}
        <Card
          className="mb-8 cursor-pointer border-border bg-card/80 shadow-sm backdrop-blur transition hover:shadow-md hover:-translate-y-0.5"
          onClick={() => router.push("/senior")}
        >
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <HeartPulse className="h-6 w-6 text-green-500" />
              </span>
              <div>
                <p className="font-semibold text-foreground">노후 준비 체크</p>
                <p className="text-sm text-muted-foreground">
                  재무·건강·여가·대인관계 4영역으로 나의 노후 준비 상태를 진단해보세요
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* 로드 실패 */}
        {error && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <FileText className="w-14 h-14 mb-4 text-destructive/50" />
            <p className="text-lg font-medium text-destructive">{error}</p>
            <Button className="mt-6" onClick={loadDocuments}>
              다시 시도
            </Button>
          </div>
        )}

        {/* 문서 없음 */}
        {!error && docs.length === 0 && (
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
              onClick={() => openDocument(doc)}
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
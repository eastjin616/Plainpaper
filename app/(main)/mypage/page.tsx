"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, ArrowRight } from "lucide-react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

// 임시 mock 데이터
const mockDocuments = [
  {
    id: "abc123",
    title: "암보험 약관.pdf",
    uploadDate: "2025-11-09",
    status: "분석 완료",
    summary:
      "암 진단 시 5000만원 지급, 갑상선암 보장 제외. 매년 보험료 갱신.",
  },
  {
    id: "def456",
    title: "자동차보험 약관.pdf",
    uploadDate: "2025-11-07",
    status: "분석 완료",
    summary:
      "자기부담금 20%, 음주 운전 시 보장 제외. 무사고 시 보험료 할인 혜택.",
  },
  {
    id: "ghi789",
    title: "근로소득세 안내문.pdf",
    uploadDate: "2025-11-05",
    status: "분석 중",
    summary: "세액공제 항목 검토 중입니다...",
  },
];

export default function MyPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<typeof mockDocuments>([]);

  useEffect(() => {
    // 추후: fetch(`${API_URL}/documents?member_id=...`)
    setDocs(mockDocuments);
  }, []);

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
              key={doc.id}
              className="shadow-sm border border-zinc-200 bg-white/80 hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/analysis/${doc.id}`)}
            >
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-zinc-500" />
                    <span className="font-semibold text-zinc-900">
                      {doc.title}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 line-clamp-1">
                    {doc.summary}
                  </p>
                  <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {doc.uploadDate}
                    </span>
                    <span>• {doc.status}</span>
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
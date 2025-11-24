import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

export default function Home() {
  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-background">

        <Card className="w-[440px] p-10 text-center shadow-xl border-border bg-card/40 backdrop-blur-xl rounded-2xl">
          <CardContent>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Plainpaper ✨
            </h1>

            <p className="text-muted-foreground mb-8 text-md leading-relaxed">
              복잡한 문서도 AI가 쉽게 풀어드립니다.
              <br /> PDF / 계약서 / 약관 모두 지원합니다.
            </p>

            <Button asChild className="w-full py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all">
              <Link href="/upload">문서 분석 시작하기</Link>
            </Button>
          </CardContent>
        </Card>

      </main>
    </ProtectedPage>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <Card className="w-[420px] p-8 text-center shadow-xl border border-zinc-200 bg-white/80 backdrop-blur">
        <CardContent>
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">
            Plainpaper ✨
          </h1>
          <p className="text-zinc-600 mb-6">
            복잡한 문서를 AI가 이해하기 쉽게 풀어드립니다.
          </p>
          <Button asChild className="w-full text-lg font-medium">
            <Link href="/upload">시작하기</Link>
          </Button>
        </CardContent>
      </Card>

    </main>
  );
}
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-bold text-foreground">페이지를 찾을 수 없습니다</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        요청하신 주소가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </main>
  );
}

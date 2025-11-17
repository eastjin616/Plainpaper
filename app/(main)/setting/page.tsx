import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

export default function SettingPage() {
  return (
    <ProtectedPage>
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-8">
        <div className="max-w-3xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-zinc-900">⚙️ 설정</h1>
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <h2 className="text-lg font-semibold text-zinc-900">비밀번호 변경</h2>
              <Input type="password" placeholder="새 비밀번호" />
              <Input type="password" placeholder="비밀번호 확인" />
              <Button className="self-end px-6">저장</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}

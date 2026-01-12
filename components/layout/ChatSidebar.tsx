"use client";

import { useState } from "react";

// 👇 Sheet (사이드 패널)
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// 👇 DropdownMenu (ChatGPT 모델 선택 스타일)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { on } from "events";

type ChatSidebarProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  document_id: string;
};

export default function ChatSidebar({
  open,
  onOpenChange,
  document_id,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<"gpt" | "gemini">("gpt");
  const [loading, setLoading] = useState(false);

  // 🚀 백엔드 API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setLoading(true);

    const res = await fetch(`${API_URL}/analysis/${document_id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const json = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: json.answer }
    ]);

    setLoading(false);
  };

  // 엔터키로도 전송 가능하게
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      sendMessage();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] p-6 rounded-l-xl border-l shadow-xl bg-background"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">AI 문서 질문하기</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            문서 내용을 기반으로 답변합니다.
          </SheetDescription>
        </SheetHeader>

        {/* 🔥 모델 선택 Dropdown (너가 말한 ChatGPT 모델 선택 UI) */}
        <div className="mt-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-medium"
              >
                {model === "gpt" ? "GPT (OpenAI)" : "Gemini (Google)"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>AI 모델 선택</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setModel("gpt")}>
                GPT (OpenAI)
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setModel("gemini")}>
                Gemini (Google)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 🔥 메시지 리스트 */}
        <div className="flex flex-col gap-4 mt-6 h-[65vh] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] break-words ${m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
                  }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* --- 🔥 AI 응답 스켈레톤 --- */}
          {loading && (
            <div className="text-left">
              <div className="inline-block bg-muted rounded-lg p-3">
                <Skeleton className="h-4 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
        </div>

        {/* 🔥 입력창 */}
        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            placeholder="무엇이 궁금하신가요?"
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={sendMessage}
            className="px-4 py-2"
          >
            전송
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

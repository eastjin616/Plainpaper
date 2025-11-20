"use client";

import { useState } from "react";

// 👇 Sheet (사이드 패널)
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

// 👇 DropdownMenu (ChatGPT 모델 선택 스타일)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

type ChatSidebarProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  documentId: string;
};

export default function ChatSidebar({
  open,
  onOpenChange,
  documentId,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<"gpt" | "gemini">("gpt");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // TODO: 실제 AI 연결할 부분 (백엔드 API 호출)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `(${model}) 아직 AI 연결 전입니다.`,
      },
    ]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] p-6 rounded-l-xl border-l shadow-xl bg-white"
      >
        <SheetHeader>
          <h2 className="text-xl font-bold">AI 문서 질문하기</h2>
          <p className="text-sm text-zinc-500">문서 내용을 기반으로 답변합니다.</p>
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
                className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] break-words ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-br-none"
                    : "bg-zinc-200 text-black rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 입력창 */}
        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="무엇이 궁금하신가요?"
          />
          <Button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            전송
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
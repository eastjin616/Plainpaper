"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 나중에 여기에 AI 호출
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "아직 AI 연결 전입니다.",
      },
    ]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] p-6">
        <SheetHeader>
          <h2 className="text-xl font-bold">AI 문서 질문하기</h2>
          <p className="text-sm text-zinc-500">문서 내용을 기반으로 답변합니다.</p>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6 h-[70vh] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                    m.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                        : "bg-zinc-200"
                    }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="무엇이 궁금하신가요?"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            전송
          </button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
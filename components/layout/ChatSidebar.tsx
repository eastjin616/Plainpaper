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

import { Skeleton } from "../ui/skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/app/_types/chat";
import { API_URL, authHeaders, extractDetail, getErrorMessage } from "@/lib/api";

type ChatSidebarProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  document_id: string;
};

type ChatResponse = {
  answer?: string;
};

export default function ChatSidebar({
  open,
  onOpenChange,
  document_id,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/analysis/${document_id}/ask`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(extractDetail(payload, "AI 응답을 가져오지 못했습니다."));
      }

      const json = (await res.json()) as ChatResponse;
      const answer = json.answer ?? "응답이 비어 있습니다.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: answer },
      ]);
    } catch (err) {
      setError(getErrorMessage(err, "AI 응답을 가져오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  };

  // 엔터키로도 전송 가능하게
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      sendMessage();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-6 rounded-l-xl border-l shadow-xl bg-background"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">AI 문서 질문하기</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            문서 내용을 기반으로 답변합니다.
          </SheetDescription>
        </SheetHeader>

        {/* 🔥 메시지 리스트 */}
        <div className="flex flex-col gap-4 mt-6 h-[65vh] overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
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

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

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
          <Button onClick={sendMessage} className="px-4 py-2">
            전송
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

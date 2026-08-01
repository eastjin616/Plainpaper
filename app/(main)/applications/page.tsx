"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Building2,
  Briefcase,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ProtectedPage from "@/app/_contexts/ProtectedPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_META: Record<string, { label: string; color: string }> = {
  applied: { label: "지원 완료", color: "bg-sky-500/10 text-sky-600 border-sky-500/30" },
  document: { label: "서류 통과", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" },
  interview: { label: "면접", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  offer: { label: "합격 🎉", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  rejected: { label: "불합격", color: "bg-rose-500/10 text-rose-600 border-rose-500/30" },
};

const STATUS_ORDER = ["applied", "document", "interview", "offer", "rejected"];

type Application = {
  application_id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string | null;
  deadline: string | null;
  url: string | null;
  note: string | null;
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Application[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  const authHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/applications`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("불러오기 실패");
      const json = await res.json();
      setItems(json.items ?? []);
      setStats(json.stats ?? {});
    } catch (err) {
      console.error("🔥 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!company.trim() || !position.trim()) {
      alert("회사명과 직무를 입력해주세요.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          company,
          position,
          status,
          applied_date: appliedDate || null,
          deadline: deadline || null,
          url: url || null,
          note: note || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "등록 실패");
      }
      setCompany("");
      setPosition("");
      setAppliedDate("");
      setDeadline("");
      setUrl("");
      setNote("");
      setShowForm(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "등록 실패");
    }
  };

  const handleStatusChange = async (app: Application, next: string) => {
    try {
      await fetch(`${API_URL}/applications/${app.application_id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: next }),
      });
      await load();
    } catch (err) {
      alert("상태 변경 실패");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    try {
      await fetch(`${API_URL}/applications/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await load();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드
            </button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowForm((v) => !v)}
            >
              <Plus className="w-4 h-4 mr-1" />
              지원 내역 추가
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" />
            지원 트래커
          </h1>

          {/* 통계 */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {STATUS_ORDER.map((s) => (
              <Card key={s} className="shadow-sm border-border bg-card/60">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {stats[s] ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {STATUS_META[s].label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 등록 폼 */}
          {showForm && (
            <Card className="shadow-md border-border bg-card/80 mb-8">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="회사명 *" value={company} onChange={(e) => setCompany(e.target.value)} />
                <Input placeholder="직무 *" value={position} onChange={(e) => setPosition(e.target.value)} />
                <select
                  className="px-4 py-2 rounded-lg border border-border bg-background text-foreground outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <Input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
                <Input placeholder="공고 URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                <Textarea placeholder="메모" value={note} onChange={(e) => setNote(e.target.value)} />
                <div className="md:col-span-2">
                  <Button className="w-full bg-primary text-primary-foreground" onClick={handleCreate}>
                    등록
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 목록 */}
          {loading ? (
            <p className="text-center text-muted-foreground py-20">불러오는 중...</p>
          ) : items.length === 0 ? (
            <Card className="shadow-sm border-dashed border-border bg-card/40">
              <CardContent className="p-16 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">아직 지원 내역이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((app) => (
                <Card key={app.application_id} className="shadow-sm border-border bg-card/70">
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{app.company}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_META[app.status]?.color ?? ""}`}
                        >
                          {STATUS_META[app.status]?.label ?? app.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{app.position}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {app.applied_date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            지원 {app.applied_date}
                          </span>
                        )}
                        {app.deadline && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            마감 {app.deadline}
                          </span>
                        )}
                      </div>
                      {app.note && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{app.note}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value)}
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(app.application_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}

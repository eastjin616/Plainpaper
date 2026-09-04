"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL, authHeaders, extractDetail } from "@/lib/api";

export function useAnalytics<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}${path}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(extractDetail(payload, "데이터를 불러오지 못했습니다."));
      }
      setData((await res.json()) as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}

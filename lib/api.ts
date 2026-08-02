export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function authHeaders(
  extra?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = {
    ...(extra ?? {}),
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// FastAPI의 detail은 문자열 또는 검증 오류 배열일 수 있어 공통으로 처리한다.
export function extractDetail(payload: unknown, fallback: string): string {
  if (payload == null || typeof payload !== "object") return fallback;
  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (item && typeof item === "object") {
          return (item as { msg?: string }).msg;
        }
        return typeof item === "string" ? item : null;
      })
      .filter((msg): msg is string => Boolean(msg));
    return messages.join(", ") || fallback;
  }
  return fallback;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}

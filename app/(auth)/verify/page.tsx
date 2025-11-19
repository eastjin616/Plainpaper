"use client";

import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <VerifyContent />
    </Suspense>
  );
}
"use client";

import { ShieldAlert, FileSearch } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="mt-16 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">

      {/* ⚠️ 위험 조항 분석 */}
      <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow border border-zinc-200">
        <div className="flex items-center gap-3 mb-3">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-zinc-900">
            위험 조항 자동 분석
          </h3>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">
          약관 속 <span className="font-medium text-red-500">숨겨진 불리한 조항</span>을  
          AI가 자동으로 감지해 알려드립니다.
        </p>

        <ul className="mt-4 space-y-1 text-sm text-zinc-500">
          <li>• 해지 불가 / 환급 불가</li>
          <li>• 갱신 거절 가능 조항</li>
          <li>• 보장 제외 / 책임 면제</li>
        </ul>
      </div>

      {/* 📊 금액·기간·비율 추출 */}
      <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow border border-zinc-200">
        <div className="flex items-center gap-3 mb-3">
          <FileSearch className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-zinc-900">
            금액·기간·비율 자동 추출
          </h3>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">
          문서에 숨어 있는 <span className="font-medium text-purple-600">금액·기간·환급률</span>을  
          자동으로 찾아 표로 정리합니다.
        </p>

        <ul className="mt-4 space-y-1 text-sm text-zinc-500">
          <li>• 보장 금액</li>
          <li>• 납입 기간</li>
          <li>• 환급률 / 지급 횟수</li>
        </ul>
      </div>
    </section>
  );
}
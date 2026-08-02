# 📄 Plainpaper — 보험·계약서류 AI 분석 + 노후 준비 체크 (프론트엔드)

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Shadcn UI 기반 프론트엔드입니다.
백엔드는 [plainpaper_back](https://github.com/eastjin616/plainpaper_back) (FastAPI)과 REST로 통신합니다.

## 실행

```bash
npm install
npm run dev        # 개발 (VITE 대신 Next dev, 기본 3000)
npm run build      # 프로덕션 빌드 (컨테이너 내 3000, 호스트 매핑 3001)
```

> Docker Compose 환경에서는 코드 수정 후 `docker compose -f ../docker-compose.yml up -d --build frontend` 로 재빌드해야 반영됩니다.

## 페이지 구조 (`app/`)

| 경로 | 설명 |
|---|---|
| `/` | 대시보드 (허브) — 문서 통계·활동·앱 카드·관리자/사용자 모드 |
| `/login` `/signup` `/verify` `/reset-password` | 인증 (이메일 인증 가입, 아이디/비밀번호 로그인) |
| `/upload` | 문서 업로드 (드래그앤드롭) |
| `/analysis/[id]` | 분석 결과 (요약·하이라이트·메트릭·Q&A) |
| `/analysis/loading/[id]` | 분석 진행 폴링 |
| `/senior` | 노후 준비 체크 홈 + 진단 이력 |
| `/senior/survey` | 18문항 설문 (한 화면 한 질문, 자동 임시저장) |
| `/senior/result/[id]` | 진단 결과 (점수·등급·영역·자산 비율·AI 조언) |
| `/board` | 게시판 + 댓글 |
| `/analytics` | 사용자/문서 통계 |
| `/mypage` | 내 문서 카드 + 노후 준비 바로가기 |
| `/setting` | 설정 |

## 주요 모듈

- `lib/api.ts` — `API_URL`/`authHeaders()`/`extractDetail`/`getErrorMessage` 공통 API 헬퍼
- `app/_contexts/AuthContext.tsx` — JWT 인증 상태, `ProtectedPage` 래퍼
- `components/dashboard/SeniorHubModal.tsx` — 기능 선택 모달 (React Portal, 첫 로그인 1회 + 헤더 버튼)
- `components/layout/Header.tsx` — 상단 메뉴 (기능 선택·마이페이지·설정·모바일 Sheet)
- `components/dashboard/*` — 대시보드 섹션 (Stats/Activity/Apps/Workspace)

## 설문 임시저장

설문 답변은 입력 시마다 `localStorage`(`plainpaper_survey_draft`)에 자동 저장됩니다.
이탈 시 브라우저 경고, 재방문 시 "이어서 작성 / 새로 시작" 배너가 표시되며, 제출 성공 시 자동 삭제됩니다.

## 디자인

시스템 테마(다크/라이트) 대응, 노후 준비 영역별 시맨틱 컬러(재무=파랑/건강=초록/여가=보라/관계=주황), 어르신 친화 큰 UI. 자세한 내용은 루트 `DESIGN.md` 참조.

## [HEAD] — 2026-06-20

### Added

- 이메일 인증 + JWT 로그인 전체 인증 플로우 구축
  → app/(auth)/login/page.tsx, app/(auth)/signup/page.tsx, app/(auth)/verify/page.tsx, app/(main)/upload/page.tsx, app/_contexts/AuthContext.tsx, app/_contexts/ProtectedPage.tsx, app/_types/auth.ts, app/_types/user.ts, app/layout.tsx, app/mockUserData/mockUserData.ts, components/layout/Header.tsx

### Changed

- upgrade next.js to patched 16.1.x (CVE fix)
  → package-lock.json, package.json

### Fixed

- add next-themes dependency
  → package-lock.json, package.json

### Other

- docker파일 생성 [front]
  → .dockerignore, Dockerfile
- board 상단고정 (is_important) 및 FAQ
  → app/(main)/board/[board_id]/edit/page.tsx, app/(main)/board/create/page.tsx, app/(main)/board/page.tsx
- wiki page만 생성해놓음
  → app/(main)/wiki/page.tsx, components/dashboard/Dashboard.tsx
- analysis 섹션 비활성화 -> 구현 전
  → app/(main)/analytics/layout.tsx, components/dashboard/Dashboard.tsx
- 에러 수정
  → app/(main)/board/page.tsx
- board_comment 관련 수정 삭제 등 로직 추가
  → app/(main)/board/[board_id]/page.tsx, app/(main)/board/page.tsx
- Merge pull request #3 from eastjin616/develop
- 주석추가
  → app/(main)/board/[board_id]/edit/page.tsx, app/(main)/board/[board_id]/page.tsx, app/(main)/board/create/page.tsx, app/(main)/board/page.tsx
- 번호 uuid -> 번호로
  → app/(main)/board/page.tsx
- 주석 추가
  → app/(main)/board/[board_id]/edit/page.tsx, app/(main)/board/[board_id]/page.tsx, app/(main)/board/create/page.tsx, app/(main)/board/page.tsx
- Merge pull request #2 from eastjin616/develop
- [pront]
  → .idea/plainpaper.iml, .idea/vcs.xml, app/(main)/board/[board_id]/edit/page.tsx, app/(main)/board/[board_id]/page.tsx, app/(main)/board/create/page.tsx, app/(main)/board/detail/page.tsx, app/(main)/board/edit/page.tsx, app/(main)/board/page.tsx
- 게시판 crud 화면 개발
  → app/(main)/board/create/page.tsx, app/(main)/board/detail/page.tsx, app/(main)/board/edit/page.tsx, app/(main)/board/page.tsx
- components/dashboard/Dashboard.tsx
  → app/(main)/board/create/page.tsx, app/(main)/board/detail/page.tsx, app/(main)/board/edit/page.tsx, app/(main)/board/page.tsx, app/_contexts/ProtectedPage.tsx, components/dashboard/Dashboard.tsx
- 반응형 웹 추가
  → app/(auth)/forgot-password/page.tsx, app/(auth)/login/page.tsx, app/(auth)/reset-password/ResetPasswordForm.tsx, app/(auth)/signup/page.tsx, app/(auth)/signup/success/page.tsx, app/(auth)/verify/VerifyContent.tsx, app/(main)/analysis/loading/[id]/page.tsx, components/layout/ChatSidebar.tsx, components/layout/Header.tsx
- 클라이언트에서 직접 useSearchParams()로 토큰을 다시 읽도록 보강
  → app/(auth)/reset-password/ResetPasswordForm.tsx
- [프론트]  prerender 에러를 막기 위해 /reset-password를 서버 페이지로 전환하고, 검색 파라미터 처리는 클라이언트 컴포넌트로 분리
  → app/(auth)/reset-password/ResetPasswordForm.tsx, app/(auth)/reset-password/page.tsx
- 비밀번호 재설정 관련 로직 수정 및 추가
  → app/(auth)/forgot-password/page.tsx, app/(auth)/login/page.tsx, app/(auth)/reset-password/page.tsx
- SheetHeader 내부의 <h2>/<p>를 SheetTitle/SheetDescription으로 교체
  → components/layout/ChatSidebar.tsx
- ADMIN_EMAILS 관리자 모드 설정
  → app/_types/auth.ts, components/dashboard/Dashboard.tsx
- nextjs더 높은버전
  → package.json
- nothing
  → components/dashboard/Dashboard.tsx
- eslint버전도 같이 업
  → package.json
- next js 버전업
  → package.json
- 분석 내 컴포넌트들
  → app/(main)/analytics/ai-usage/page.tsx, app/(main)/analytics/documents/page.tsx, app/(main)/analytics/layout.tsx, app/(main)/analytics/page.tsx, components/analytics/DonutChart.tsx, components/analytics/LineChart.tsx
- dash board 수정
  → components/dashboard/Dashboard.tsx
- 대쉬 보드 추가 및 메인페이지 삭제(메인페이지가 대쉬보드) 추가로 화면 개발
  → app/(main)/layout.tsx, app/(main)/main-page/page.tsx, app/(main)/page.tsx, app/page.tsx, components/dashboard/ActivitySection.tsx, components/dashboard/AppsSection.tsx, components/dashboard/Dashboard.tsx, components/dashboard/WorkspaceSection.tsx, components/dashboard/types.tsx
- Update demo video links in README.md
  → README.md
- 다크모드 대응 전체 적용
  → app/(auth)/login/page.tsx, app/(auth)/signup/page.tsx, app/(auth)/signup/success/page.tsx
- noting
  → app/page.tsx
- 다크모드 추가
  → app/(auth)/layout.tsx, app/(main)/analysis/[id]/page.tsx, app/(main)/analysis/loading/[id]/page.tsx, app/(main)/layout.tsx, app/(main)/main-page/page.tsx, app/(main)/mypage/page.tsx, app/(main)/setting/page.tsx, app/(main)/upload/page.tsx, app/globals.css, app/layout.tsx, app/page.tsx, components/home/ThemeToggle.tsx, components/layout/ChatSidebar.tsx, components/layout/Header.tsx, components/ui/mode-toggle.tsx
- 추후 다크모드 도입시 사용예정
  → app/providers.tsx, components/home/ThemeToggle.tsx
- 로고 클릭시 라우터 위치 변경
  → components/layout/Header.tsx
- 메인 화면 섹션 추가 섹션 수정
  → app/page.tsx, components/home/FeatureSection.tsx
- 메인 화면 섹션 추가
  → app/page.tsx
- 설정 페이지 색 변경
  → app/(main)/setting/page.tsx
- delete video
  → app/upload_files/ai_chat.mp4, app/upload_files/main_page.mp4
- Update README.md
  → README.md
- Update demo video section in README
  → README.md
- Update demo video sections in README.md
  → README.md
- upload-mp4확인
  → app/upload_files/ai_chat.mp4, app/upload_files/main_page.mp4
- 오른쪽 비는 공간 제거
  → app/(main)/analysis/[id]/page.tsx
- 전체적으로 보라색 톤으로 변경
  → app/(auth)/login/page.tsx, app/(auth)/signup/page.tsx, app/(auth)/signup/success/page.tsx, app/(main)/analysis/[id]/page.tsx, app/(main)/main-page/page.tsx, app/(main)/mypage/page.tsx, app/(main)/upload/page.tsx, app/page.tsx
- loaidng 시 진행률 화면에 표시
  → app/(main)/analysis/loading/[id]/page.tsx
- 마이페이지 x표시 호버 추가
  → app/(main)/mypage/page.tsx
- list에서 문서 삭제 기능 로직 수정
  → app/(main)/mypage/page.tsx
- list에서 x(삭제)버튼 추가
  → app/(main)/mypage/page.tsx
- 스켈레톤 ui추가 및 채팅 전송 시 엔터 눌러도 전송되도록
  → components/layout/ChatSidebar.tsx
- chat sidebar로 넘기는 prop이름 변경
  → app/(main)/analysis/[id]/page.tsx
- 평가하기 버튼  색 변경
  → app/(main)/analysis/[id]/page.tsx
- ===스켈레톤 ui적용====
  → components/ui/skeleton.tsx
- ===프론트=== 채팅 내 드롭다운(ai선택기능) 추가
  → components/layout/ChatSidebar.tsx, components/ui/dropdown-menu.tsx, package-lock.json, package.json
- ===프론트=== sheet추가(챗봇 슬라이딩구현)
  → app/(main)/analysis/[id]/page.tsx, components/layout/ChatSidebar.tsx, components/ui/sheet.tsx, package-lock.json, package.json
- ===프론트=== pdf원문보기 기능 추가
  → app/(main)/analysis/[id]/page.tsx
- ====프론트==== list api호출 시 header값으로 토큰 같이 넘기기
  → .idea/.gitignore, .idea/misc.xml, .idea/modules.xml, .idea/plainpaper.iml, .idea/vcs.xml, app/(main)/mypage/page.tsx
- 프론트 앤드 이슈 확인 관련 재배포
  → app/(auth)/login/page.tsx
- 프론트 앤드 url수정(라우팅 주소에  백엔드로 지정되어있었음)
  → app/(main)/analysis/loading/[id]/page.tsx
- 백엔드 배포 api 추가
  → app/(main)/analysis/[id]/page.tsx, app/(main)/analysis/loading/[id]/page.tsx
- ===front엔드=== 배포 전략
  → app/(main)/analysis/[id]/page.tsx
- ===프론트=== 서스펜스 추가및 실행로직 분리
  → app/(auth)/verify/VerifyContent.tsx, app/(auth)/verify/page.tsx
- ===프론트=== 마이페이지 실제 api로 랜더링
  → app/(main)/mypage/page.tsx
- =====프론트===== llm summary 랜더링
  → .vscode/launch.json, app/(main)/analysis/[id]/page.tsx, app/(main)/analysis/loading/[id]/page.tsx, app/mockUserData/mockUserData.ts
- 업로드 후 로딩페이지로
  → app/(main)/upload/page.tsx
- 로딩창
  → app/(main)/analysis/loading/[id]/page.tsx
- 파일업로드 api연동
  → app/(main)/upload/page.tsx
- 설정- page개발
  → app/(main)/setting/page.tsx
- ProtectedPage 를 페이지에 적용하기
  → app/(main)/analysis/[id]/page.tsx, app/(main)/main-page/page.tsx, app/(main)/mypage/page.tsx, app/(main)/setting/page.tsx
- 로그인 후 서버에서 실제 사용자 정보 가져오기 (프론트)
  → app/_contexts/AuthContext.tsx
- 1. 새로고침하면 로그인 페이지로 튕기는 문제 , 2. Hydration error (React SSR mismatch) 해결
  → app/_contexts/AuthClientWrapper.tsx, app/_contexts/AuthContext.tsx, app/_contexts/ProtectedPage.tsx, app/layout.tsx
- 분석결과서 페이지, 목데이터 생성, 평가하기, 마이페이지, 설정페이지 화면개발
  → app/(auth)/layout.tsx, app/(auth)/login/page.tsx, app/(auth)/signup/page.tsx, app/(auth)/signup/success/page.tsx, app/(main)/analysis/[id]/page.tsx, app/(main)/layout.tsx, app/(main)/main-page/page.tsx, app/(main)/mypage/page.tsx, app/(main)/setting/page.tsx, app/(main)/upload/page.tsx, app/layout.tsx, app/login/page.tsx, app/mockUserData/mockUserData.ts, app/page.tsx, app/signup/page.tsx, app/signup/success/page.tsx, app/upload/page.tsx, components/layout/Header.tsx, components/ui/dialog.tsx, components/ui/textarea.tsx, package-lock.json, package.json
- 메인 로그인 회원가입 회원가입 성공 페이지 완료
  → app/login/page.tsx, app/signup/page.tsx, app/signup/success/page.tsx, package-lock.json, package.json
- erd end
  → app/login/page.tsx
- 초안
  → .gitignore, README.md, app/favicon.ico, app/globals.css, app/layout.tsx, app/login/page.tsx, app/page.tsx, app/upload/page.tsx, components.json, components/ui/alert.tsx, components/ui/button.tsx, components/ui/card.tsx, components/ui/input.tsx, components/ui/tooltip.tsx, eslint.config.mjs, lib/utils.ts, next.config.ts, package-lock.json, package.json, postcss.config.mjs, public/file.svg, public/globe.svg, public/next.svg, public/vercel.svg, public/window.svg, tsconfig.json
- Initial commit
  → README.md
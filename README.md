# 📄 Plainpaper – 보험·계약서류 AI 분석 서비스

**Plainpaper**는 보험 약관, 금융 문서, 계약서처럼 길고 복잡한 문서를  
**업로드 → AI 자동 분석 → 핵심 요약 · 주의 문장 탐지 · 구조 분석(TOC)**  
까지 한 번에 처리해주는 웹 서비스입니다.

---

## 🔧 Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- React
- TypeScript
- Zustand
- SWR
- TailwindCSS
- Shadcn UI

### **Backend**
- FastAPI
- Python 3.11
- SQLAlchemy
- OpenAI API (LLM 기반 문서 분석)
- Pydantic

### **Database & Infra**
- PostgreSQL
- Docker / Docker Compose
- pgAdmin
- JWT Authentication

---

## 🚀 주요 기능

### 📤 문서 업로드
- PDF 업로드 지원
- 텍스트 추출 및 자동 전처리

### 🧠 AI 문서 분석
- LLM 기반 핵심 요약
- 위험·주의 문장 탐지
- 문서 구조 분석(TOC 자동화)
- 분석 리포트 생성

### 📊 분석 결과 화면
- 섹션별 분석 결과 표시
- 요약 / 중요 문장 하이라이팅
- 보고서 다운로드

### 🔐 인증 및 프로젝트 관리
- 회원가입 / 로그인(JWT)
- 프로젝트 생성 / 조회 / 삭제
- 분석 이력 저장

---

## 🛠️ Frontend 실행 방법

```bash
npm install
npm run dev

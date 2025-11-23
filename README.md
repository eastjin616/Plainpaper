# 📄 Plainpaper – 보험·계약서류 AI 분석 서비스

**Plainpaper**는 보험 약관, 금융 문서, 계약서처럼 길고 복잡한 문서를  
**업로드 → AI 자동 분석 → 핵심 요약 · 중요 문장 탐지 · 구조 분석(TOC)**  
까지 자동으로 처리해주는 웹 서비스입니다.

사용자는 복잡한 서류를 빠르게 이해할 수 있고, 핵심 정보만 모아보고 싶은 실사용자 경험을 목표로 하고 있습니다.

---

## 🎥 Demo Video

### ▸ 메인 기능 (PDF 분석 흐름)
[▶️ main_page.mp4](https://raw.githubusercontent.com/eastjin616/Plainpaper/main/app/upload_files/main_page.mp4)

---

### ▸ AI 채팅 기능
[▶️ ai_chat.mp4](https://raw.githubusercontent.com/eastjin616/Plainpaper/main/app/upload_files/ai_chat.mp4)
---

# 🏗️ Architecture
Next.js (Vercel)
-> (REST)
FastAPI (Cloudtype Docker)
->
PostgreSQL (Cloudtype Docker)

---
### 개발 환경
- 로컬에서는 **Docker + docker-compose** 로  
  Postgres + pgAdmin 환경 실행  
- 프론트는 로컬 Next.js dev 서버로 개발  
- 백엔드는 FastAPI + Uvicorn

---

# 🌐 Deployment

### 🟦 Frontend (Next.js)
- **Vercel** 배포  
- 자동 빌드 및 CI 지원  
- 환경 변수 기반으로 백엔드 URL 연동  

### 🟧 Backend (FastAPI)
- **Cloudtype Docker 이미지 기반 배포**
- Uvicorn 서버로 실행  
- OpenAI Key, DB URL, JWT Secret 등 환경 변수 적용

### 🟨 Database (PostgreSQL)
- **Cloudtype Docker PostgreSQL**
- 백엔드와 동일 프로젝트 내 서비스로 구성  
- 로컬 개발 시 docker-compose로 별도 실행

---

# 🐳 Local Development (Docker)

로컬에서 FastAPI + DB 테스트를 위해 Docker 설정을 사용합니다.

### PostgreSQL + pgAdmin 실행

```bash
docker-compose up -d
	•	PostgreSQL: localhost:5432
	•	pgAdmin: http://localhost:5050
🔧 Tech Stack

Frontend
	•	Next.js 14 (App Router)
	•	React
	•	TypeScript
	•	Zustand
	•	SWR
	•	TailwindCSS
	•	Shadcn UI

Backend
	•	FastAPI
	•	Python 3.11
	•	SQLAlchemy / Alembic
	•	Pydantic
	•	OpenAI API (LLM 기반 문서 분석)

Infra
	•	Docker / Docker Compose
	•	Cloudtype (Backend / DB 배포)
	•	Vercel (Frontend 배포)
	•	PostgreSQL
	•	JWT Auth

⸻

🚀 주요 기능

📤 문서 업로드
	•	PDF 업로드
	•	텍스트 자동 추출 & 전처리

🧠 AI 분석
	•	OpenAI 기반 LLM 분석 파이프라인
	•	핵심요약, 중요문장, 문서 구조 분석(TOC)
	•	분석 결과 재생성 기능

📊 분석 결과 페이지
	•	요약/하이라이트 표시
	•	프로젝트별 분석 이력 조회
	•	분석서 보기 / 분석서 재생성

🔐 유저 관리
	•	JWT 기반 로그인/회원가입
	•	프로젝트 CRUD
	•	분석 상태 실시간 확인

🗺️ Roadmap
	•	OCR 이미지 문서 분석 기능
	•	PDF 분석 속도 개선 (비동기 큐 처리)
	•	사용자 대시보드 강화
	•	분석서 PDF Export 고도화
	•	멀티 프로젝트/팀 기능

<div align="center">

# CareerPilot ✈️

**오픈소스 AI 취업 코파일럿** — 이력서 ATS 분석 · 자소서 첨삭 · 모의면접 · 지원 트래커

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)

이력서를 업로드하면 AI가 **자동 서류심사(ATS) 기준으로 점수를 매기고**, 개선 포인트를 알려줍니다.
자소서는 AI가 첨삭하고, 이력서를 읽은 면접관이 **모의면접**을 진행합니다. 지원 현황은 트래커로 관리하세요.

**자기 이력서·자소서는 가장 민감한 개인정보입니다. CareerPilot은 완전한 셀프호스트를 지원합니다.**

</div>

## ✨ 핵심 기능

| 기능 | 설명 |
|---|---|
| 📄 **ATS Analyzer** | 이력서 업로드 → ATS 점수(0~100) + 5개 카테고리 평가(연락처·섹션·성과·스킬·가독성) + 개선 포인트 + 핵심 스킬 추출 |
| ✍️ **Essay Studio** | 자소서 AI 첨삭 — 흔한 문장 → 경험 기반 문장, before/after 비교 + 피드백 |
| 🎤 **AI Interview** | 이력서 기반 질문 5개 생성 → STAR 기법(상황-과제-행동-결과) 답변 평가 |
| 📊 **Application Tracker** | 지원 현황 CRUD — 지원완료/서류통과/면접/합격/불합격 + 상태별 통계 |

## 🧠 도메인 지식 (AI만이 아니라 "규칙"이 안다)

CareerPilot의 ATS 점수는 LLM이 "잘해줄게" 하고 내는 숫자가 아닙니다.
실제 ATS 시스템이 파싱하는 **하드 규칙**을 반영한 휴리스틱 엔진입니다 (`services/ats.py`):

- **연락처 인식**: 이메일/전화번호 정규식 파싱 (ATS는 문단 중간에 숨은 연락처를 못 찾습니다)
- **섹션 헤딩**: `경력/프로젝트/학력/스킬` 표준 섹션이 없으면 파싱 실패
- **성과 신호**: 결과 동사(개선·향상·달성) + 수치(%, k, 만) — 추상 문장은 점수 감점
- **스킬 밀도**: JD 키워드 매칭 가능한 기술 스택 명시 여부
- **가독성**: ATS는 200자 미만·4000자 초과 문서를 파싱 실패 처리

LLM(OpenAI/Ollama)은 첨삭·모의면접처럼 **판단이 필요한 부분**에만 사용하고,
점수 산출은 로컬에서 즉시·무비용·무네트워크로 동작합니다.

## 🖥️ 라이브 데모

**https://plainpaper1.vercel.app** — 코드를 내려받기 전에 먼저 사용해보세요.

## 🚀 빠른 시작 (셀프호스트)
```bash
# 1. 저장소 클론
git clone https://github.com/eastjin616/Plainpaper.git
cd Plainpaper

# 2. 환경변수 설정
cp plainpaper_back/.env.example plainpaper_back/.env
#   → OPENAI_API_KEY 입력 (LLM 첨삭/면접용, 없어도 ATS 분석·트래커는 동작)

# 3. Docker Compose로 3계층 실행
docker compose up --build
```

| 서비스 | 주소 |
|---|---|
| 🌐 프론트 (Next.js) | http://localhost:3001 |
| 🔧 백엔드 API (FastAPI) | http://localhost:8000 |
| 🗄️ 데이터베이스 (PostgreSQL 15) | localhost:5432 |

> **LLM 없이 사용하기**: `plainpaper_back/.env`에서 `USE_OLLAMA=true`로 설정하면 로컬 Ollama로 동작합니다.
> ATS 분석과 지원 트래커는 LLM 자체가 필요 없어 오프라인에서도 완전히 사용할 수 있습니다.

## 🛠 기술 스택

- **Frontend**: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Shadcn UI
- **Backend**: FastAPI · SQLAlchemy · PostgreSQL 15 · OpenAI / Ollama
- **Infra**: Docker Compose

## 📁 저장소 구조

```
Plainpaper_compose/
├── Plainpaper/          # Next.js 프론트엔드
│   └── app/(main)/
│       ├── upload/          # 이력서 업로드
│       ├── analysis/[id]    # ATS 분석 결과
│       ├── essay/           # 자소서 첨삭 스튜디오
│       ├── interview/       # AI 모의면접
│       └── applications/    # 지원 트래커
├── plainpaper_back/     # FastAPI 백엔드
│   ├── services/ats.py        # ATS 점수 휴리스틱 엔진
│   ├── services/essay_revise.py
│   ├── services/interview.py
│   ├── routers/               # resume/essay/interview/application ...
│   └── workers/               # 문서 분석 파이프라인
└── docker-compose.yml
```

## 🧪 테스트

```bash
cd plainpaper_back
uv run python -m pytest tests/ -q   # 17 tests
```

## 📚 문서

- `ARCHITECTURE.md` — 모듈 구조와 데이터 흐름
- `docs/` — 페이지별 API 문서

## 🚧 로드맵

- [x] 이력서 업로드 + ATS 분석
- [x] 자소서 AI 첨삭 스튜디오
- [x] AI 모의면접 (STAR 피드백)
- [x] 지원 트래커
- [ ] 채용공고(JD) 대비 적합도 분석
- [ ] 다국어 지원 (EN)
- [ ] 이력서 템플릿 다운로드

## 🤝 기여

스타 ⭐ 한 번 눌러주시면 개발에 큰 힘이 됩니다.
Issue · PR 환영합니다. 행동 강령은 [Contributor Covenant](https://www.contributor-covenant.org/)를 따릅니다.

## 📄 라이선스

[MIT](LICENSE) — 자유롭게 사용하고, 포크하고, 배포하세요.

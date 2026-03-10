# CLAUDE.md

## 프로젝트 개요

23명 규모 부서의 LLM/ERP 서비스 피드백을 익명으로 수집하고 관리자가 취합/관리하는 내부 MVP 웹앱

## 주요 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19, TypeScript 5.6+
- **인증/데이터베이스**: Supabase (Auth, PostgreSQL, RLS)
- **스타일링**: TailwindCSS v4
- **UI 컴포넌트**: shadcn/ui (base-nova), Lucide React
- **폼/검증**: React Hook Form 7.x, Zod v4
- **엑셀**: ExcelJS
- **배포**: Vercel

## 개발 명령어

```bash
# 개발 서버 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# 린트
npm run lint

# 포맷 검사 / 자동 포맷
npm run format:check
npm run format

# 타입 체크
npm run typecheck

# 전체 검사 (커밋 전 필수)
npm run check-all
```

## 프로젝트 구조 및 아키텍처

```
src/
├── app/
│   ├── layout.tsx, globals.css
│   ├── (auth)/login/              # 로그인 페이지
│   ├── (main)/feedbacks/          # 피드백 목록/작성/수정
│   ├── api/feedbacks/export/      # 엑셀 다운로드 API
│   └── actions/                   # Server Actions (auth.ts, feedback.ts)
├── components/
│   ├── ui/                        # shadcn/ui 컴포넌트
│   ├── layout/                    # 공통 레이아웃
│   └── feedback/                  # 피드백 도메인 컴포넌트
├── lib/
│   ├── utils.ts                   # cn() 유틸리티
│   ├── env.ts                     # 환경변수 검증 (Zod)
│   ├── types/                     # TypeScript 타입 (database.ts: Supabase 자동 생성)
│   ├── schemas/                   # Zod 스키마
│   └── supabase/                  # Supabase 클라이언트 (server/client/middleware/admin)
└── middleware.ts                   # 인증 라우트 보호
```

### 클라이언트 패턴

| 클라이언트 | 파일                         | 사용 환경                       |
| ---------- | ---------------------------- | ------------------------------- |
| Server     | `lib/supabase/server.ts`     | Server Component, Server Action |
| Browser    | `lib/supabase/client.ts`     | Client Component                |
| Middleware | `lib/supabase/middleware.ts` | middleware.ts                   |
| Admin      | `lib/supabase/admin.ts`      | Service Role (서버 전용)        |

모든 클라이언트에 `Database` 제네릭 타입 적용됨 (`lib/types/database.ts`).
DB 스키마 변경 시 Supabase MCP `generate_typescript_types`로 타입 재생성 필요.

### 인증 흐름

이름 + 비밀번호 기반 로그인/자동가입 통합 방식. Supabase Auth 연동은 Server Action 내부 구현 상세로 캡슐화.

- 로그인 상태 → `/feedbacks` 리다이렉트
- 비로그인 → `/login` 리다이렉트
- 관리자: `name='최정인'` → `is_admin=true`

### 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=           # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase service role key (서버 전용)
```

### 경로 별칭

`@/*` → `./src/*` (tsconfig.json에 설정)

```tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

## 코드 작성 가이드라인

- **Server Component 기본**, `'use client'`는 상호작용 필요 시에만
- **파일명**: kebab-case (`feedback-card.tsx`)
- **컴포넌트명**: PascalCase (`FeedbackCard`)
- **Server Actions 위치**: `src/app/actions/` (lib/actions/ 금지)
- **익명성 필수**: 클라이언트에 `author_id` 절대 반환 금지, `is_mine` 플래그 사용
- **상세 규칙**: `shrimp-rules.md` 참조

## MCP 서버 설정

- **context7**: 라이브러리 문서 조회
- **shadcn**: UI 컴포넌트 검색/설치
- **supabase**: DB 마이그레이션, SQL 실행
- **playwright**: E2E 테스트
- **shrimp-task-manager**: 작업 관리

## 작업 완료 체크리스트

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] 타입 에러 없음
- [ ] 불필요한 console.log 제거

## 참고사항

- 전체 기능 목록: `docs/PRD.md` (F001~F011)
- 개발 로드맵: `ROADMAP.md` (Task 001~017)
- 상세 코드 규칙: `shrimp-rules.md`
- 개발 가이드: `docs/guides/*.md`

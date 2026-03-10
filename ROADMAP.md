# 부서 피드백 관리 시스템 개발 로드맵

23명 규모 부서의 LLM/ERP 서비스 피드백을 익명으로 수집하고 관리자가 취합/관리할 수 있는 내부 웹앱

## 개요

부서 피드백 관리 시스템은 부서원들이 LLM/ERP 서비스에 대한 피드백을 익명으로 제출하고, 관리자(최정인)가 이를 취합/관리할 수 있는 MVP 내부 웹앱으로 다음 기능을 제공합니다:

- **익명 피드백 수집**: 일반 사용자의 피드백 작성자 정보를 완전히 숨기고, 본인 작성건만 `is_mine` 플래그로 식별 (F004, F005)
- **카테고리별 관리**: LLM/ERP 탭 전환을 통한 피드백 분류 및 검색 (F003, F008, F009)
- **인증 및 권한**: 이름 기반 로그인/자동가입 통합, 관리자 작성자 확인 및 엑셀 다운로드 (F001, F002, F010, F011)
- **피드백 CRUD**: 피드백 작성/수정/삭제 및 본인 작성건 권한 제어 (F005~F007)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router), React 19, TypeScript 5.6+ |
| 스타일링/UI | TailwindCSS v4, shadcn/ui (new-york), Lucide React |
| 폼/검증 | React Hook Form 7.x, Zod |
| 인증/DB | Supabase (Auth, PostgreSQL, RLS) |
| 엑셀 | ExcelJS |
| 배포 | Vercel |

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

---

## 개발 단계

### Phase 1: 프로젝트 초기화 및 애플리케이션 골격 구축

> 전체 프로젝트 구조를 잡고, 라우트 골격과 타입 시스템을 먼저 완성하는 단계

- **Task 001: 프로젝트 초기화 및 개발 환경 설정** - 우선순위
  - [FE] Next.js 15 프로젝트 생성 (App Router, TypeScript, TailwindCSS v4, Turbopack)
  - [FE] 필수 패키지 설치: react-hook-form, @hookform/resolvers, zod, exceljs, @supabase/supabase-js, @supabase/ssr
  - [FE] ESLint, Prettier 설정 및 `check-all` 스크립트 구성
  - [FE] `components.json` 설정 (shadcn/ui new-york 스타일, 경로 별칭 `@/`)
  - [FE] 환경변수 파일 구성: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - [FE] `CLAUDE.md` 프로젝트 지침 파일 생성
  - 관련 기능: 전체 (F001~F011 기반 인프라)
  - 생성 파일:
    ```
    package.json, tsconfig.json, next.config.ts, .env.local, .env.example, CLAUDE.md, src/lib/env.ts
    ```

- **Task 002: App Router 라우트 구조 및 레이아웃 골격 생성** - 우선순위
  - [FE] Route Group 기반 전체 라우트 구조 생성 (빈 페이지 껍데기)
  - [FE] `(auth)` 그룹: 로그인 페이지 (중앙 정렬 레이아웃, 헤더 없음)
  - [FE] `(main)` 그룹: 피드백 목록/작성/수정 페이지 (Header 포함 레이아웃)
  - [FE] 루트 `/` 에서 `/feedbacks` 로 리다이렉트 설정
  - [FE] `loading.tsx` 골격 파일 생성
  - [FE] API Route 골격 생성: `/api/feedbacks/export/route.ts` (엑셀 다운로드 전용)
  - 관련 기능: F001~F011 (전체 라우팅)
  - 생성 파일:
    ```
    src/app/layout.tsx
    src/app/globals.css
    src/app/(auth)/layout.tsx
    src/app/(auth)/login/page.tsx
    src/app/(main)/layout.tsx
    src/app/(main)/page.tsx                    # / -> /feedbacks 리다이렉트
    src/app/(main)/feedbacks/page.tsx
    src/app/(main)/feedbacks/loading.tsx
    src/app/(main)/feedbacks/new/page.tsx
    src/app/(main)/feedbacks/[id]/edit/page.tsx
    src/app/api/feedbacks/export/route.ts
    ```

- **Task 003: TypeScript 타입 정의 및 Zod 스키마 설계**
  - [FE/BE] 피드백 도메인 타입 정의 (Feedback, FeedbackListItem, FeedbackFormData)
  - [FE/BE] 사용자 도메인 타입 정의 (User, AuthUser, UserProfile)
  - [FE/BE] API 응답 타입 정의: 일반 사용자 응답 (is_mine 플래그), 관리자 응답 (author_name 포함)
  - [FE] Zod 스키마 정의: 로그인 (이름+비밀번호), 비밀번호 확인 (비밀번호+비밀번호확인)
  - [FE] Zod 스키마 정의: 피드백 작성/수정 (category, content)
  - [FE/BE] Server Action 반환 타입 정의 (ActionResult)
  - 관련 기능: 전체 (F001~F011 타입 기반)
  - 생성 파일:
    ```
    src/lib/types/feedback.ts
    src/lib/types/auth.ts
    src/lib/types/common.ts
    src/lib/schemas/auth.ts         # loginSchema, passwordConfirmSchema
    src/lib/schemas/feedback.ts     # feedbackCreateSchema, feedbackUpdateSchema
    ```

---

### Phase 2: UI/UX 완성 (더미 데이터 활용)

> shadcn/ui 컴포넌트를 설치하고, 모든 페이지 UI를 하드코딩된 더미 데이터로 완성하는 단계. 이 단계 완료 시 전체 사용자 플로우를 화면으로 확인 가능

- **Task 004: shadcn/ui 컴포넌트 설치 및 공통 레이아웃 컴포넌트 구현**
  - [FE] shadcn/ui 컴포넌트 12개 설치: button, input, textarea, label, form, card, separator, tabs, alert-dialog, sonner, badge, skeleton
  - [FE] 공통 레이아웃 컴포넌트 구현:
    - `AppHeader`: 로고/서비스명 + 사용자 이름 표시 + 로그아웃 버튼 (F002)
    - `PageContainer`: max-width 제한, 반응형 패딩 (md:768px 이상 container)
    - `PageHeader`: 페이지 제목 + 우측 액션 버튼 영역
  - [FE] 반응형 기준: 모바일 우선, sm(640px) 이상 액션바 수평 배치
  - 관련 기능: F002 (로그아웃 버튼), 전체 레이아웃
  - 생성 파일:
    ```
    src/components/ui/button.tsx ... (shadcn 12개)
    src/components/layout/app-header.tsx
    src/components/layout/page-container.tsx
    src/components/layout/page-header.tsx
    ```

- **Task 005: 인증 페이지 UI 구현 (로그인/자동가입 통합)**
  - [FE] `LoginForm` (Client Component): 이름 + 비밀번호 + 로그인 버튼 (단일 폼으로 로그인/가입 통합)
    - React Hook Form + Zod 연동 (loginSchema)
    - 이름 입력 필드: type="text", placeholder="이름을 입력하세요"
    - 비밀번호 입력 필드: type="password"
    - [신규 사용자 감지 시] 비밀번호 확인 필드 동적 표시 + 안내 문구 ("처음 사용하시는 분입니다. 비밀번호를 다시 입력해주세요")
    - 비밀번호 확인 일치 검증 (클라이언트)
    - 에러 메시지 표시 영역, 로딩 상태 처리
    - 더미 onSubmit 핸들러로 동작 확인
  - [FE] (auth) 레이아웃에 중앙 정렬 카드 스타일 적용
  - 관련 기능: F001 (로그인/자동가입)
  - 생성 파일:
    ```
    src/components/login-form.tsx
    ```

- **Task 006: 피드백 목록 페이지 UI 구현 (더미 데이터)**
  - [FE] 더미 데이터 생성 유틸리티: 피드백 목록 mock 데이터 (LLM/ERP 각 5건 이상)
  - [FE] `FeedbackTabs` (Client Component): LLM/ERP 탭 전환, searchParams `?category=llm|erp` 방식 (F003)
  - [FE] `FeedbackGuideBanner` (Server Component): 카테고리별 안내 메시지 표시 (F009)
    - LLM: "LLM 서비스 사용 중 필요한 기능, 불편한 점, 개선 아이디어를 자유롭게 작성해주세요"
    - ERP: "ERP 시스템 사용 중 필요한 기능, 불편한 점, 개선 아이디어를 자유롭게 작성해주세요"
  - [FE] `FeedbackSearchBar` (Client Component): 키워드 검색 입력 (F008)
  - [FE] `FeedbackCard` (Server Component): 피드백 카드 (내용, 작성일, 본인 작성건 수정 버튼) (F004, F006)
    - 일반 사용자: 익명 표시, `is_mine=true`인 경우 [수정] 버튼 노출
    - 관리자: 작성자 이름(author_name) Badge로 표시 (F010)
  - [FE] `FeedbackEmptyState`: 피드백 없을 때 빈 상태 화면
  - [FE] `FeedbackSkeletonList`: 로딩 시 스켈레톤 UI
  - [FE] `ExcelDownloadButton` (Client Component): 엑셀 다운로드 버튼 (F011)
  - [FE] 피드백 목록 페이지 조합: 탭 + 안내 + 검색 + 작성버튼 + 엑셀버튼 + 목록/빈상태
  - [FE] 반응형: 모바일에서 검색바/버튼 세로 배치, sm 이상에서 수평 배치
  - 관련 기능: F003, F004, F008, F009, F010, F011
  - 생성 파일:
    ```
    src/lib/data/mock-feedbacks.ts
    src/components/feedback/feedback-tabs.tsx
    src/components/feedback/feedback-guide-banner.tsx
    src/components/feedback/feedback-search-bar.tsx
    src/components/feedback/feedback-card.tsx
    src/components/feedback/feedback-empty-state.tsx
    src/components/feedback/feedback-skeleton-list.tsx
    src/components/feedback/excel-download-button.tsx
    ```

- **Task 007: 피드백 작성/수정 페이지 UI 구현 (더미 데이터)**
  - [FE] `FeedbackForm` (Client Component): 피드백 작성 폼 (F005)
    - React Hook Form + Zod 연동 (feedbackCreateSchema)
    - 현재 카테고리(LLM/ERP) 표시 (searchParams에서 전달)
    - textarea 내용 입력 영역
    - 저장/취소 버튼 (취소 시 목록 복귀)
    - 더미 onSubmit 핸들러
  - [FE] `FeedbackEditForm` (Client Component): 피드백 수정 폼 (F006, F007)
    - React Hook Form + Zod 연동 (feedbackUpdateSchema)
    - 기존 피드백 내용 프리필
    - 저장/삭제/취소 버튼
    - 삭제 시 AlertDialog 확인 팝업 (F007)
    - 더미 onSubmit/onDelete 핸들러
  - [FE] 작성/수정 페이지에 PageHeader + PageContainer 적용
  - 관련 기능: F005 (작성), F006 (수정), F007 (삭제)
  - 생성 파일:
    ```
    src/components/feedback/feedback-form.tsx
    src/components/feedback/feedback-edit-form.tsx
    ```

---

### Phase 3: 데이터베이스 및 인증 시스템 구축

> Supabase 데이터베이스 스키마, RLS 정책, 인증 흐름을 구현하고 더미 데이터를 실제 데이터로 교체하는 단계

- **Task 008: Supabase 데이터베이스 스키마 및 RLS 정책 구축** - 우선순위
  - [DB] Supabase 대시보드 설정: 이메일 확인(Email Confirmations) 비활성화
  - [DB] pg_trgm 확장 활성화 (피드백 내용 검색용)
  - [DB] `users` 테이블 생성:
    - id (UUID PK, gen_random_uuid)
    - auth_id (UUID UNIQUE, FK -> auth.users.id ON DELETE CASCADE)
    - name (TEXT UNIQUE, NOT NULL) — 로그인 식별자
    - is_admin (BOOLEAN DEFAULT false)
    - created_at (TIMESTAMPTZ DEFAULT now())
  - [DB] `feedbacks` 테이블 생성:
    - id (UUID PK, gen_random_uuid)
    - category (TEXT CHECK (category IN ('llm', 'erp')))
    - content (TEXT NOT NULL)
    - author_id (UUID FK -> users.id, NOT NULL)
    - created_at (TIMESTAMPTZ DEFAULT now())
    - updated_at (TIMESTAMPTZ DEFAULT now())
  - [DB] 인덱스 생성:
    - feedbacks(category, created_at DESC) - 목록 조회 최적화
    - feedbacks(author_id) - 본인 작성건 조회
    - feedbacks USING GIN (content gin_trgm_ops) - 키워드 검색
  - [DB] 트리거 2종 생성:
    - feedbacks.updated_at 자동 갱신 (BEFORE UPDATE)
    - auth.users INSERT 시 public.users 자동 생성 (메타데이터에서 name 추출, name='최정인'이면 is_admin=true)
  - [DB] RLS 정책 설정:
    - users: 본인 조회 가능, 관리자 전체 조회, INSERT는 트리거(service_role)만
    - feedbacks: 인증 사용자 전체 SELECT, INSERT는 인증+본인, UPDATE/DELETE는 본인만
  - 관련 기능: 전체 (F001~F011 데이터 기반)
  - 생성 파일:
    ```
    supabase/migrations/001_create_tables.sql
    supabase/migrations/002_create_triggers.sql
    supabase/migrations/003_create_rls_policies.sql
    supabase/migrations/004_create_indexes.sql
    ```
  - **테스트 체크리스트:**
    - [ ] users 테이블 CRUD 동작 확인
    - [ ] feedbacks 테이블 CRUD 동작 확인
    - [ ] updated_at 트리거 자동 갱신 확인
    - [ ] auth.users 가입 시 public.users 자동 생성 확인
    - [ ] name='최정인' 가입 시 is_admin=true 확인
    - [ ] RLS: 비인증 사용자 접근 차단 확인
    - [ ] RLS: 타인 피드백 수정/삭제 차단 확인

- **Task 009: Supabase 클라이언트 설정 및 인증 Server Actions 구현**
  - [BE] Supabase 클라이언트 유틸리티 파일 생성:
    - `server.ts`: Server Component/Server Action용 (createServerClient)
    - `client.ts`: Client Component용 (createBrowserClient)
    - `middleware.ts`: 미들웨어용 (createServerClient with cookie handling)
    - `admin.ts`: Service Role 키 사용 (사용자 존재 확인 등)
  - [BE] 인증 Server Actions 구현 (`app/actions/auth.ts`):
    - `checkUserExists(name)`: Service Role로 이름 존재 여부 확인
    - `signIn(formData)`: 이름 -> `{이름}@feedback.internal` 변환 -> signInWithPassword
    - `signUp(formData)`: 이름/비밀번호 -> signUp (data.name 메타데이터) -> 자동 로그인
    - `signOut()`: 세션 종료 후 /login 리다이렉트
  - [FE] 미들웨어 구현 (`middleware.ts`):
    - /login 경로: 공개 (로그인 상태면 /feedbacks 리다이렉트)
    - /feedbacks/* 경로: 인증 필수 (비로그인 시 /login 리다이렉트)
    - Supabase 세션 갱신 처리
  - 관련 기능: F001 (로그인/자동가입), F002 (로그아웃)
  - 생성 파일:
    ```
    src/lib/supabase/server.ts
    src/lib/supabase/client.ts
    src/lib/supabase/middleware.ts
    src/lib/supabase/admin.ts
    src/app/actions/auth.ts
    src/middleware.ts
    ```
  - **테스트 체크리스트:**
    - [ ] Playwright: /feedbacks 접근 시 비로그인 상태에서 /login 리다이렉트 확인
    - [ ] Playwright: 기존 사용자 로그인 성공 -> /feedbacks 이동 확인
    - [ ] Playwright: 신규 사용자 입력 -> 비밀번호 확인 필드 표시 -> 자동 가입 + 로그인 확인
    - [ ] Playwright: 잘못된 비밀번호 -> 에러 메시지 표시 확인
    - [ ] Playwright: 로그아웃 -> /login 이동 확인
    - [ ] Playwright: 로그인 상태에서 /login 접근 시 /feedbacks 리다이렉트 확인

- **Task 010: 인증 UI와 Server Actions 연동**
  - [FE] LoginForm에 실제 Server Actions 연동 (로그인/자동가입 통합):
    - 이름 제출 시 checkUserExists 호출로 신규/기존 사용자 판별
    - 기존 사용자: signIn Server Action 호출
    - 신규 사용자: 비밀번호 확인 필드 표시 → signUp Server Action 호출 → 자동 로그인
    - 이름 -> 더미 이메일 변환은 Server Action 내부에서 처리
    - 에러 표시: "비밀번호가 일치하지 않습니다" 등
  - [FE] AppHeader에 실제 사용자 정보 표시 + signOut 연동
    - Server Component에서 현재 사용자 정보 조회 (Supabase getUser)
    - LogoutButton (Client Component) -> signOut Server Action 호출
  - 관련 기능: F001 (로그인/자동가입), F002 (로그아웃)
  - 수정 파일:
    ```
    src/components/login-form.tsx
    src/components/layout/app-header.tsx
    src/app/(auth)/login/page.tsx
    ```
  - **테스트 체크리스트:**
    - [ ] Playwright: 신규 사용자 전체 플로우 (이름/비밀번호 입력 -> 비밀번호 확인 -> 자동 가입 + 로그인 -> 피드백 목록)
    - [ ] Playwright: 기존 사용자 로그인 전체 플로우 (이름/비밀번호 입력 -> 로그인 -> 피드백 목록)
    - [ ] Playwright: 로그아웃 전체 플로우 (로그아웃 버튼 -> /login)
    - [ ] Playwright: 유효성 검증 에러 메시지 표시 (빈 필드, 비밀번호 불일치 등)
    - [ ] Playwright: 헤더에 사용자 이름 표시 확인

---

### Phase 4: 핵심 비즈니스 로직 구현

> 피드백 CRUD, 검색, 익명성 보장 등 핵심 비즈니스 로직을 구현하고 더미 데이터를 실제 API로 교체하는 단계

- **Task 011: 피드백 CRUD Server Actions 구현** - 우선순위
  - [BE] 피드백 Server Actions 구현 (`app/actions/feedback.ts`):
    - `getFeedbacks(category, searchQuery?)`: 카테고리별 피드백 목록 조회
      - 서버에서 author_id 제거, is_mine 플래그 추가
      - 관리자인 경우 author_name 포함 (users 테이블 JOIN)
      - 검색어 있으면 content ILIKE 또는 pg_trgm 검색
      - 정렬: created_at DESC
    - `createFeedback(formData)`: 피드백 생성 (category + content)
      - 현재 사용자 ID를 author_id로 설정
      - 성공 시 revalidatePath('/feedbacks')
    - `updateFeedback(id, formData)`: 피드백 수정 (본인 작성건만)
      - RLS + 서버 레이어 이중 검증
    - `deleteFeedback(id)`: 피드백 삭제 (본인 작성건만)
      - RLS + 서버 레이어 이중 검증
    - `getFeedbackById(id)`: 단건 조회 (수정 페이지용, 본인 작성건만)
  - [BE] 익명성 보장: 서버 레이어에서 author_id 제거, is_mine 플래그 추가
  - 관련 기능: F004 (목록 조회), F005 (작성), F006 (수정), F007 (삭제), F008 (검색), F010 (관리자 작성자 확인)
  - 생성 파일:
    ```
    src/app/actions/feedback.ts
    ```
  - **테스트 체크리스트:**
    - [ ] 피드백 생성 후 목록에 노출 확인
    - [ ] 카테고리별 피드백 분리 조회 확인
    - [ ] 본인 작성건 is_mine=true, 타인 작성건 is_mine=false 확인
    - [ ] 본인 작성건만 수정/삭제 가능 확인
    - [ ] 타인 작성건 수정/삭제 시도 시 에러 확인
    - [ ] 관리자 계정으로 author_name 포함 확인
    - [ ] 일반 사용자 응답에 author_id, author_name 미포함 확인
    - [ ] 검색어로 피드백 필터링 확인

- **Task 012: 피드백 목록 페이지 실제 데이터 연동**
  - [FE] 피드백 목록 페이지(feedbacks/page.tsx)를 Server Component로 구현
    - searchParams에서 category(기본값: 'llm'), search 쿼리 추출
    - getFeedbacks Server Action으로 실제 데이터 조회
    - 더미 데이터 제거, 실제 데이터 바인딩
  - [FE] FeedbackTabs: searchParams 기반 탭 상태 동기화 (URL 유지)
  - [FE] FeedbackSearchBar: 검색어 입력 -> searchParams 업데이트 (디바운스 적용)
  - [FE] FeedbackCard: 실제 데이터 바인딩 (is_mine 기반 수정 버튼, 관리자 author_name)
  - [FE] FeedbackEmptyState/FeedbackSkeletonList: 실제 상태에 따라 표시
  - 관련 기능: F003 (탭 전환), F004 (목록 조회), F008 (검색), F009 (안내), F010 (관리자)
  - 수정 파일:
    ```
    src/app/(main)/feedbacks/page.tsx
    src/app/(main)/feedbacks/loading.tsx
    src/components/feedback/feedback-tabs.tsx
    src/components/feedback/feedback-search-bar.tsx
    src/components/feedback/feedback-card.tsx
    ```
  - **테스트 체크리스트:**
    - [ ] Playwright: /feedbacks 접근 시 LLM 탭이 기본 선택 상태 확인
    - [ ] Playwright: LLM/ERP 탭 전환 시 URL searchParams 변경 및 목록 갱신 확인
    - [ ] Playwright: 검색어 입력 시 피드백 필터링 확인
    - [ ] Playwright: 피드백 없을 때 빈 상태 화면 표시 확인
    - [ ] Playwright: 본인 작성건에 [수정] 버튼 표시 확인
    - [ ] Playwright: 안내 배너 카테고리별 다른 메시지 확인

- **Task 013: 피드백 작성/수정/삭제 기능 실제 데이터 연동**
  - [FE] 피드백 작성 페이지(feedbacks/new/page.tsx):
    - searchParams에서 category 추출, FeedbackForm에 전달
    - FeedbackForm에 createFeedback Server Action 연동
    - 성공 시 /feedbacks?category={category} 리다이렉트 + 성공 토스트
  - [FE] 피드백 수정 페이지(feedbacks/[id]/edit/page.tsx):
    - getFeedbackById로 기존 데이터 조회 (본인 작성건 아닌 경우 리다이렉트)
    - FeedbackEditForm에 updateFeedback, deleteFeedback Server Action 연동
    - 수정 성공 시 /feedbacks 리다이렉트 + 성공 토스트
    - 삭제: AlertDialog 확인 -> deleteFeedback -> /feedbacks 리다이렉트 + 삭제 토스트
  - [FE] 더미 onSubmit/onDelete 핸들러 제거, 실제 Server Action으로 교체
  - 관련 기능: F005 (작성), F006 (수정), F007 (삭제)
  - 수정 파일:
    ```
    src/app/(main)/feedbacks/new/page.tsx
    src/app/(main)/feedbacks/[id]/edit/page.tsx
    src/components/feedback/feedback-form.tsx
    src/components/feedback/feedback-edit-form.tsx
    ```
  - **테스트 체크리스트:**
    - [ ] Playwright: 피드백 작성 전체 플로우 (작성 버튼 -> 내용 입력 -> 저장 -> 목록에서 확인)
    - [ ] Playwright: 피드백 수정 전체 플로우 (수정 버튼 -> 내용 변경 -> 저장 -> 목록에서 변경 확인)
    - [ ] Playwright: 피드백 삭제 전체 플로우 (수정 페이지 -> 삭제 -> 확인 팝업 -> 목록에서 제거 확인)
    - [ ] Playwright: 취소 버튼 클릭 시 목록 복귀 확인
    - [ ] Playwright: 빈 내용 제출 시 유효성 검증 에러 확인
    - [ ] Playwright: 타인 작성건 수정 페이지 직접 접근 시 리다이렉트 확인

- **Task 014: 핵심 기능 통합 테스트**
  - [QA] Playwright MCP를 사용한 전체 사용자 플로우 E2E 테스트
    - 신규 사용자 자동 가입 -> 로그인 -> 피드백 작성 -> 목록 확인 -> 수정 -> 삭제 -> 로그아웃
  - [QA] 관리자 플로우 테스트
    - 관리자(최정인) 로그인 -> 작성자 이름 표시 확인 -> 피드백 작성/수정/삭제
  - [QA] 익명성 보장 테스트
    - 일반 사용자 브라우저 네트워크 탭에서 author_id, author_name 미포함 확인
    - 관리자 브라우저에서 author_name 포함 확인
  - [QA] 에러 핸들링 테스트
    - 네트워크 오류 시 에러 메시지 표시
    - 권한 없는 작업 시도 시 에러 처리
    - 존재하지 않는 피드백 접근 시 404/리다이렉트 처리
  - [QA] 탭 전환 + 검색 복합 시나리오 테스트
    - LLM 탭에서 검색 -> ERP 탭으로 전환 -> 검색어 초기화 확인
  - 관련 기능: F001~F011 통합 테스트
  - **테스트 체크리스트:**
    - [ ] Playwright: 전체 사용자 플로우 (가입 -> 로그인 -> 작성 -> 조회 -> 수정 -> 삭제 -> 로그아웃)
    - [ ] Playwright: 관리자 플로우 (로그인 -> 작성자 이름 확인 -> CRUD)
    - [ ] Playwright: 익명성 보장 (네트워크 응답에서 author_id 미포함 확인)
    - [ ] Playwright: 에러 핸들링 (잘못된 접근, 권한 없는 작업)
    - [ ] Playwright: 다중 사용자 시나리오 (A 작성 -> B가 수정 불가 확인)

---

### Phase 5: 부가 기능 구현 및 최적화

> 엑셀 다운로드, 성능 최적화, 에러 처리 강화 등 MVP 완성에 필요한 부가 기능 구현 단계

- **Task 015: 엑셀 다운로드 기능 구현 (F011)**
  - [BE] API Route 구현 (`/api/feedbacks/export/route.ts`):
    - GET 요청, query parameter: category (llm/erp)
    - ExcelJS로 엑셀 파일 생성
    - 일반 사용자: 번호, 카테고리, 내용, 작성일 (작성자 가림)
    - 관리자: 번호, 카테고리, 내용, 작성자, 작성일 (작성자 포함)
    - Content-Disposition 헤더로 파일 다운로드 (`피드백_{category}_{날짜}.xlsx`)
    - 인증 확인 (비인증 시 401)
  - [FE] ExcelDownloadButton에 실제 다운로드 연동
    - fetch('/api/feedbacks/export?category=llm') -> blob -> 다운로드 트리거
    - 다운로드 중 로딩 상태 표시
  - [FE] lib/excel.ts 유틸리티: ExcelJS 워크북 생성 헬퍼 함수
  - 관련 기능: F011 (엑셀 다운로드), F010 (관리자 작성자 포함)
  - 생성/수정 파일:
    ```
    src/app/api/feedbacks/export/route.ts    # 수정
    src/lib/excel.ts                          # 생성
    src/components/feedback/excel-download-button.tsx  # 수정
    ```
  - **테스트 체크리스트:**
    - [ ] Playwright: 일반 사용자 엑셀 다운로드 -> 작성자 열 미포함 확인
    - [ ] Playwright: 관리자 엑셀 다운로드 -> 작성자 열 포함 확인
    - [ ] Playwright: 비인증 상태에서 API 직접 호출 시 401 응답 확인
    - [ ] Playwright: 다운로드 버튼 클릭 -> 파일 다운로드 시작 확인

- **Task 016: 에러 처리, 접근성, UX 개선**
  - [FE] 전역 에러 처리:
    - `error.tsx` 페이지 구현 (피드백 목록, 작성, 수정 페이지별)
    - `not-found.tsx` 페이지 구현
    - toast 알림 통합 (sonner): 성공/실패/경고 메시지 통일
  - [FE] 접근성 개선:
    - 폼 필드 aria-label, aria-describedby 적용
    - 키보드 네비게이션 지원 (탭 전환, 폼 제출)
    - 스크린 리더 지원 (sr-only 텍스트)
  - [FE] UX 개선:
    - 피드백 작성/수정 시 페이지 이탈 경고 (unsaved changes)
    - 삭제 확인 팝업 개선 (AlertDialog 텍스트)
    - 로딩 상태 개선 (버튼 disabled + spinner)
    - 빈 상태 개선 (피드백 작성 유도 CTA)
  - [FE] SEO 기본 설정:
    - metadata 설정 (title, description)
    - robots.txt (내부 앱이므로 noindex)
  - 관련 기능: 전체 UX 개선
  - 생성/수정 파일:
    ```
    src/app/(main)/feedbacks/error.tsx
    src/app/(main)/feedbacks/not-found.tsx
    src/app/(main)/feedbacks/new/error.tsx
    src/app/(main)/feedbacks/[id]/edit/error.tsx
    src/app/not-found.tsx
    ```

- **Task 017: 성능 최적화 및 배포 준비**
  - [FE] 성능 최적화:
    - next.config.ts: optimizePackageImports 설정 (lucide-react 등)
    - 이미지 최적화 (favicon, og:image)
    - 불필요한 클라이언트 컴포넌트 서버 컴포넌트로 변환 검토
  - [BE] 데이터 페칭 최적화:
    - 피드백 목록 조회 쿼리 최적화 (인덱스 활용 확인)
    - 불필요한 데이터 전송 최소화 (select 필드 제한)
  - [DEPLOY] Vercel 배포 준비:
    - 환경변수 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
    - 프로덕션 빌드 테스트 (npm run build)
    - Vercel 프로젝트 생성 및 배포
  - [QA] 최종 검증:
    - 프로덕션 환경 전체 사용자 플로우 테스트
    - 모바일/데스크톱 반응형 확인
    - 다크모드/라이트모드 동작 확인 (사용하는 경우)
  - 관련 기능: 전체 (F001~F011 최종 검증)
  - **테스트 체크리스트:**
    - [ ] npm run build 성공 확인
    - [ ] npm run check-all 통과 확인
    - [ ] Playwright: 프로덕션 빌드에서 전체 플로우 동작 확인
    - [ ] Playwright: 모바일 뷰포트(375px)에서 레이아웃 깨짐 없음 확인
    - [ ] Playwright: 태블릿 뷰포트(768px)에서 레이아웃 확인
    - [ ] Lighthouse 성능 점수 80점 이상 확인

---

## 기능 ID - Task 매핑 표

| 기능 ID | 기능명 | 관련 Task |
|---------|--------|-----------|
| F001 | 로그인/자동가입 | Task 005, 009, 010 |
| F002 | 로그아웃 | Task 004, 009, 010 |
| F003 | 탭 전환 | Task 006, 012 |
| F004 | 피드백 목록 조회 | Task 006, 011, 012 |
| F005 | 피드백 작성 | Task 007, 011, 013 |
| F006 | 피드백 수정 | Task 007, 011, 013 |
| F007 | 피드백 삭제 | Task 007, 011, 013 |
| F008 | 피드백 검색 | Task 006, 011, 012 |
| F009 | 피드백 안내 표시 | Task 006, 012 |
| F010 | 관리자 작성자 확인 | Task 006, 011, 012 |
| F011 | 엑셀 다운로드 | Task 006, 015 |

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

- **Task 001: 프로젝트 초기화 및 개발 환경 설정** ✅ - 완료
  - ✅ [FE] Next.js 15 프로젝트 생성 (App Router, TypeScript, TailwindCSS v4, Turbopack)
  - ✅ [FE] 필수 패키지 설치: react-hook-form, @hookform/resolvers, zod, exceljs, @supabase/supabase-js, @supabase/ssr
  - ✅ [FE] ESLint, Prettier 설정 및 `check-all` 스크립트 구성
  - ✅ [FE] `components.json` 설정 (shadcn/ui base-nova 스타일, 경로 별칭 `@/`)
  - ✅ [FE] 환경변수 파일 구성: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - ✅ [FE] `CLAUDE.md` 프로젝트 지침 파일 생성
  - 관련 기능: 전체 (F001~F011 기반 인프라)
  - 생성 파일:
    ```
    package.json, tsconfig.json, next.config.ts, .env.local, .env.example, CLAUDE.md, src/lib/env.ts
    ```

- **Task 002: App Router 라우트 구조 및 레이아웃 골격 생성** ✅ - 완료
  - ✅ [FE] Route Group 기반 전체 라우트 구조 생성 (빈 페이지 껍데기)
  - ✅ [FE] `(auth)` 그룹: 로그인 페이지 (중앙 정렬 레이아웃, 헤더 없음)
  - ✅ [FE] `(main)` 그룹: 피드백 목록/작성/수정 페이지 (Header 포함 레이아웃)
  - ✅ [FE] 루트 `/` 에서 `/feedbacks` 로 리다이렉트 설정
  - ✅ [FE] `loading.tsx` 골격 파일 생성
  - ✅ [FE] API Route 골격 생성: `/api/feedbacks/export/route.ts` (엑셀 다운로드 전용)
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

- **Task 003: TypeScript 타입 정의 및 Zod 스키마 설계** ✅ - 완료
  - ✅ [FE/BE] 피드백 도메인 타입 정의 (Feedback, FeedbackListItem, AdminFeedbackListItem, FeedbackDetail)
  - ✅ [FE/BE] 사용자 도메인 타입 정의 (User, AuthUser, UserProfile)
  - ✅ [FE/BE] API 응답 타입 정의: 일반 사용자 응답 (is_mine 플래그), 관리자 응답 (author_name 포함)
  - ✅ [FE] Zod 스키마 정의: 로그인 (이름+비밀번호), 비밀번호 확인 (비밀번호+비밀번호확인)
  - ✅ [FE] Zod 스키마 정의: 피드백 작성/수정 (category, content)
  - ✅ [FE/BE] Server Action 반환 타입 정의 (ActionResult)
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

- **Task 004: shadcn/ui 컴포넌트 설치 및 공통 레이아웃 컴포넌트 구현** ✅ - 완료
  - ✅ [FE] shadcn/ui 컴포넌트 11개 설치: button, input, textarea, label, card, separator, tabs, alert-dialog, sonner, badge, skeleton
  - ✅ [FE] 공통 레이아웃 컴포넌트 구현:
    - `AppHeader`: 로고/서비스명 + 사용자 이름 표시 + 로그아웃 버튼 (F002)
    - `PageContainer`: max-width 제한, 반응형 패딩 (md:768px 이상 container)
    - `PageHeader`: 페이지 제목 + 우측 액션 버튼 영역
  - ✅ [FE] 반응형 기준: 모바일 우선, sm(640px) 이상 액션바 수평 배치
  - 관련 기능: F002 (로그아웃 버튼), 전체 레이아웃
  - 생성 파일:
    ```
    src/components/ui/button.tsx ... (shadcn 12개)
    src/components/layout/app-header.tsx
    src/components/layout/page-container.tsx
    src/components/layout/page-header.tsx
    ```

- **Task 005: 인증 페이지 UI 구현 (로그인/자동가입 통합)** ✅ - 완료
  - ✅ [FE] `LoginForm` (Client Component): 이름 + 비밀번호 + 로그인 버튼 (단일 폼으로 로그인/가입 통합)
    - React Hook Form + Zod 연동 (loginSchema)
    - 이름 입력 필드: type="text", placeholder="이름을 입력하세요"
    - 비밀번호 입력 필드: type="password"
    - [신규 사용자 감지 시] 비밀번호 확인 필드 동적 표시 + 안내 문구 ("처음 사용하시는 분입니다. 비밀번호를 다시 입력해주세요")
    - 비밀번호 확인 일치 검증 (클라이언트)
    - 에러 메시지 표시 영역, 로딩 상태 처리
    - 더미 onSubmit 핸들러로 동작 확인
  - ✅ [FE] (auth) 레이아웃에 중앙 정렬 카드 스타일 적용
  - 관련 기능: F001 (로그인/자동가입)
  - 생성 파일:
    ```
    src/components/login-form.tsx
    ```

- **Task 006: 피드백 목록 페이지 UI 구현 (더미 데이터)** ✅ - 완료
  - ✅ [FE] 더미 데이터 생성 유틸리티: 피드백 목록 mock 데이터 (LLM/ERP 각 5건 이상)
  - ✅ [FE] `FeedbackTabs` (Client Component): LLM/ERP 탭 전환, searchParams `?category=llm|erp` 방식 (F003)
  - ✅ [FE] `FeedbackGuideBanner` (Server Component): 카테고리별 안내 메시지 표시 (F009)
    - LLM: "LLM 서비스 사용 중 필요한 기능, 불편한 점, 개선 아이디어를 자유롭게 작성해주세요"
    - ERP: "ERP 시스템 사용 중 필요한 기능, 불편한 점, 개선 아이디어를 자유롭게 작성해주세요"
  - ✅ [FE] `FeedbackSearchBar` (Client Component): 키워드 검색 입력 (F008)
  - ✅ [FE] `FeedbackCard` (Server Component): 피드백 카드 (내용, 작성일, 본인 작성건 수정 버튼) (F004, F006)
    - 일반 사용자: 익명 표시, `is_mine=true`인 경우 [수정] 버튼 노출
    - 관리자: 작성자 이름(author_name) Badge로 표시 (F010)
  - ✅ [FE] `FeedbackEmptyState`: 피드백 없을 때 빈 상태 화면
  - ✅ [FE] `FeedbackSkeletonList`: 로딩 시 스켈레톤 UI
  - ✅ [FE] `ExcelDownloadButton` (Client Component): 엑셀 다운로드 버튼 (F011)
  - ✅ [FE] 피드백 목록 페이지 조합: 탭 + 안내 + 검색 + 작성버튼 + 엑셀버튼 + 목록/빈상태
  - ✅ [FE] 반응형: 모바일에서 검색바/버튼 세로 배치, sm 이상에서 수평 배치
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

- **Task 007: 피드백 작성/수정 페이지 UI 구현 (더미 데이터)** ✅ - 완료
  - ✅ [FE] `FeedbackForm` (Client Component): 피드백 작성 폼 (F005)
    - React Hook Form + Zod 연동 (feedbackCreateSchema)
    - 현재 카테고리(LLM/ERP) 표시 (searchParams에서 전달)
    - textarea 내용 입력 영역
    - 저장/취소 버튼 (취소 시 목록 복귀)
    - 더미 onSubmit 핸들러
  - ✅ [FE] `FeedbackEditForm` (Client Component): 피드백 수정 폼 (F006, F007)
    - React Hook Form + Zod 연동 (feedbackUpdateSchema)
    - 기존 피드백 내용 프리필
    - 저장/삭제/취소 버튼
    - 삭제 시 AlertDialog 확인 팝업 (F007)
    - 더미 onSubmit/onDelete 핸들러
  - ✅ [FE] 작성/수정 페이지에 PageHeader + PageContainer 적용
  - 관련 기능: F005 (작성), F006 (수정), F007 (삭제)
  - 생성 파일:
    ```
    src/components/feedback/feedback-form.tsx
    src/components/feedback/feedback-edit-form.tsx
    ```

---

### Phase 3: 데이터베이스 및 인증 시스템 구축

> Supabase 데이터베이스 스키마, RLS 정책, 인증 흐름을 구현하고 더미 데이터를 실제 데이터로 교체하는 단계

- **Task 008: Supabase 데이터베이스 스키마 및 RLS 정책 구축** ✅ - 완료
  - ✅ [DB] pg_trgm 확장 활성화 (피드백 내용 검색용)
  - ✅ [DB] `users` 테이블 생성 (id, auth_id, name, is_admin, created_at)
  - ✅ [DB] `feedbacks` 테이블 생성 (id, category, content, author_id, created_at, updated_at)
  - ✅ [DB] 인덱스 3개 생성 (복합 2개 + GIN 1개)
  - ✅ [DB] 헬퍼 함수 2개 (get_my_user_id, is_admin) + 트리거 2종 생성
  - ✅ [DB] RLS 정책 5개 설정 (users 1개, feedbacks 4개)
  - 관련 기능: 전체 (F001~F011 데이터 기반)
  - 생성 파일:
    ```
    supabase/migrations/001_create_tables.sql
    supabase/migrations/002_create_triggers.sql
    supabase/migrations/003_create_rls_policies.sql
    supabase/migrations/004_create_indexes.sql
    ```
  - **테스트 체크리스트:**
    - [x] users 테이블 CRUD 동작 확인
    - [x] feedbacks 테이블 CRUD 동작 확인
    - [x] updated_at 트리거 자동 갱신 확인
    - [x] auth.users 가입 시 public.users 자동 생성 확인
    - [x] name='최정인' 가입 시 is_admin=true 확인
    - [x] RLS: 비인증 사용자 접근 차단 확인 (정책 없음 = 차단)
    - [x] CASCADE 삭제 동작 확인

- **Task 009: Supabase 클라이언트 설정 및 인증 Server Actions 구현** ✅ - 완료
  - ✅ [BE] Supabase 클라이언트 유틸리티 4종: server.ts, client.ts, middleware.ts, admin.ts
  - ✅ [BE] 인증 Server Actions: checkUserExists, signIn, signUp, signOut
  - ✅ [FE] 미들웨어: /login 공개, /feedbacks/* 보호, 세션 갱신
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
    - [x] 미들웨어: /feedbacks 비로그인 → /login 리다이렉트 (307) 확인
    - [x] 미들웨어: /feedbacks/new 비로그인 → /login 리다이렉트 (307) 확인
    - [x] 미들웨어: /api/feedbacks/export 비로그인 → /login 리다이렉트 (307) 확인
    - [x] 미들웨어: /login 비로그인 → 200 OK 정상 접근 확인
    - [x] Playwright: 기존 사용자 로그인 성공 → /feedbacks 이동 확인
    - [x] Playwright: 신규 사용자 자동 가입 + 로그인 확인
    - [x] Playwright: 잘못된 비밀번호 → 에러 메시지 표시 확인
    - [x] Playwright: 로그아웃 → /login 이동 확인
    - [x] Playwright: 로그인 상태에서 /login → /feedbacks 리다이렉트 확인

- **Task 010: 인증 UI와 Server Actions 연동** ✅ - 완료
  - ✅ [FE] LoginForm에 실제 Server Actions 연동 (로그인/자동가입 통합):
    - 이름 제출 시 checkUserExists 호출로 신규/기존 사용자 판별
    - 기존 사용자: signIn Server Action 호출
    - 신규 사용자: 비밀번호 확인 필드 표시 → signUp Server Action 호출 → 자동 로그인
    - Supabase Auth 연동은 Server Action 내부에서 처리 (사용자에게 비노출)
    - 에러 표시: "비밀번호가 일치하지 않습니다" 등
  - ✅ [FE] AppHeader에 실제 사용자 정보 표시 + signOut 연동
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
    - [x] Playwright: 신규 사용자 전체 플로우 (이름/비밀번호 입력 -> 비밀번호 확인 -> 자동 가입 + 로그인 -> 피드백 목록)
    - [x] Playwright: 기존 사용자 로그인 전체 플로우 (이름/비밀번호 입력 -> 로그인 -> 피드백 목록)
    - [x] Playwright: 로그아웃 전체 플로우 (로그아웃 버튼 -> /login)
    - [x] Playwright: 유효성 검증 에러 메시지 표시 (빈 필드, 비밀번호 불일치 등)
    - [x] Playwright: 헤더에 사용자 이름 표시 확인

---

### Phase 4: 핵심 비즈니스 로직 구현

> 피드백 CRUD, 검색, 익명성 보장 등 핵심 비즈니스 로직을 구현하고 더미 데이터를 실제 API로 교체하는 단계

- **Task 011: 피드백 CRUD Server Actions 구현** ✅ - 완료
  - ✅ [BE] 피드백 Server Actions 구현 (`app/actions/feedback.ts`):
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
  - ✅ [BE] 익명성 보장: 서버 레이어에서 author_id 제거, is_mine 플래그 추가
  - 관련 기능: F004 (목록 조회), F005 (작성), F006 (수정), F007 (삭제), F008 (검색), F010 (관리자 작성자 확인)
  - 생성 파일:
    ```
    src/app/actions/feedback.ts
    ```
  - **테스트 체크리스트:**
    - [x] 피드백 생성 후 목록에 노출 확인
    - [x] 카테고리별 피드백 분리 조회 확인
    - [x] 본인 작성건 is_mine=true, 타인 작성건 is_mine=false 확인
    - [x] 본인 작성건만 수정/삭제 가능 확인
    - [x] 타인 작성건 수정/삭제 시도 시 에러 확인
    - [x] 관리자 계정으로 author_name 포함 확인
    - [x] 일반 사용자 응답에 author_id, author_name 미포함 확인
    - [x] 검색어로 피드백 필터링 확인

- **Task 012: 피드백 목록 페이지 실제 데이터 연동** ✅ - 완료
  - ✅ [FE] 피드백 목록 페이지(feedbacks/page.tsx)를 Server Component로 구현
    - searchParams에서 category(기본값: 'llm'), search 쿼리 추출
    - getFeedbacks Server Action으로 실제 데이터 조회
    - 더미 데이터 import 제거, 실제 데이터 바인딩
  - ✅ [FE] 관리자 여부(isAdmin) 페이지에서 판별 후 FeedbackCard에 전달
  - ✅ [FE] FeedbackTabs/FeedbackSearchBar/FeedbackCard: 기존 컴포넌트 변경 없이 동작 (이미 실제 데이터 구조 지원)
  - 관련 기능: F003 (탭 전환), F004 (목록 조회), F008 (검색), F009 (안내), F010 (관리자)
  - 수정 파일:
    ```
    src/app/(main)/feedbacks/page.tsx
    ```
  - **테스트 체크리스트:**
    - [x] Playwright: /feedbacks 접근 시 LLM 탭이 기본 선택 상태 확인
    - [x] Playwright: LLM/ERP 탭 전환 시 URL searchParams 변경 및 목록 갱신 확인
    - [x] Playwright: 검색어 입력 시 피드백 필터링 확인
    - [x] Playwright: 피드백 없을 때 빈 상태 화면 표시 확인
    - [x] Playwright: 본인 작성건에 [수정] 버튼 표시 확인
    - [x] Playwright: 안내 배너 카테고리별 다른 메시지 확인

- **Task 013: 피드백 작성/수정/삭제 기능 실제 데이터 연동** ✅ - 완료
  - ✅ [FE] 수정 페이지: mock → `getFeedbackById` 교체, 본인 작성건 아닌 경우 `/feedbacks` redirect
  - ✅ [FE] 작성 폼: `createFeedback` Server Action 연동 + toast 알림
  - ✅ [FE] 수정 폼: `updateFeedback`/`deleteFeedback` Server Action 연동 + toast 알림
  - ✅ [FE] `mock-feedbacks.ts` 및 `src/lib/data/` 디렉토리 삭제
  - 관련 기능: F005 (작성), F006 (수정), F007 (삭제)
  - 수정/삭제 파일:
    ```
    src/app/(main)/feedbacks/[id]/edit/page.tsx    # 수정
    src/components/feedback/feedback-form.tsx       # 수정
    src/components/feedback/feedback-edit-form.tsx  # 수정
    src/lib/data/mock-feedbacks.ts                 # 삭제
    ```
  - **테스트 체크리스트:**
    - [x] Playwright: 피드백 작성 전체 플로우 (작성 버튼 -> 내용 입력 -> 저장 -> 목록에서 확인)
    - [x] Playwright: 피드백 수정 전체 플로우 (수정 버튼 -> 내용 변경 -> 저장 -> 목록에서 변경 확인)
    - [x] Playwright: 피드백 삭제 전체 플로우 (수정 페이지 -> 삭제 -> 확인 팝업 -> 목록에서 제거 확인)
    - [x] Playwright: 취소 버튼 클릭 시 목록 복귀 확인
    - [x] Playwright: 빈 내용 제출 시 유효성 검증 에러 확인
    - [x] Playwright: 타인 작성건 수정 페이지 직접 접근 시 리다이렉트 확인

- **Task 014: 핵심 기능 통합 테스트** ✅ - 완료
  - ✅ [QA] 전체 사용자 플로우 E2E 테스트 (가입 → 로그인 → CRUD → 로그아웃)
  - ✅ [QA] 관리자 플로우 (작성자 이름 Badge 표시 + CRUD)
  - ✅ [QA] 익명성 보장 (일반: Badge 미표시, 관리자: Badge 표시)
  - ✅ [QA] 에러 핸들링 (존재하지 않는/타인 피드백 → 리다이렉트)
  - ✅ [QA] 탭 전환 + 검색 복합 (탭 전환 시 검색어 초기화)
  - ✅ [QA] 다중 사용자 시나리오 (A 작성 → B 수정 불가)
  - 관련 기능: F001~F011 통합 테스트
  - **테스트 체크리스트:**
    - [x] 전체 사용자 플로우 (가입 -> 로그인 -> 작성 -> 조회 -> 수정 -> 삭제 -> 로그아웃)
    - [x] 관리자 플로우 (로그인 -> 작성자 이름 확인 -> CRUD)
    - [x] 익명성 보장 (일반 사용자: Badge 미표시, 관리자: Badge 표시)
    - [x] 에러 핸들링 (잘못된 접근, 권한 없는 작업)
    - [x] 다중 사용자 시나리오 (A 작성 -> B가 수정 불가 확인)

---

### Phase 5: 부가 기능 구현 및 최적화

> 엑셀 다운로드, 성능 최적화, 에러 처리 강화 등 MVP 완성에 필요한 부가 기능 구현 단계

- **Task 015: 엑셀 다운로드 기능 구현 (F011)** ✅ - 완료
  - ✅ [BE] API Route: ExcelJS 엑셀 생성, 인증 확인, 관리자/일반 분기
  - ✅ [FE] ExcelDownloadButton: fetch → blob → 다운로드 트리거 + toast
  - ✅ [FE] lib/excel.ts: 워크북 생성 헬퍼
  - 관련 기능: F011 (엑셀 다운로드), F010 (관리자 작성자 포함)
  - 생성/수정 파일:
    ```
    src/app/api/feedbacks/export/route.ts    # 수정
    src/lib/excel.ts                          # 생성
    src/components/feedback/excel-download-button.tsx  # 수정
    ```
  - **테스트 체크리스트:**
    - [x] 일반 사용자 엑셀 다운로드 -> 작성자 열 미포함 확인
    - [x] 관리자 엑셀 다운로드 -> 작성자 열 포함 확인
    - [x] 비인증 상태에서 API 직접 호출 시 401 응답 확인
    - [x] 다운로드 버튼 클릭 -> 파일 다운로드 시작 확인

- **Task 016: 에러 처리, 접근성, UX 개선** ✅ - 완료
  - ✅ [FE] 전역 404 페이지 (`not-found.tsx`)
  - ✅ [FE] 에러 페이지: 피드백 목록 + 수정 페이지 (`error.tsx`)
  - ✅ [FE] robots.ts (내부 앱 noindex)
  - ✅ [FE] toast/로딩 상태/AlertDialog — Phase 4에서 이미 구현 완료
  - 관련 기능: 전체 UX 개선
  - 생성 파일:
    ```
    src/app/not-found.tsx
    src/app/(main)/feedbacks/error.tsx
    src/app/(main)/feedbacks/[id]/edit/error.tsx
    src/app/robots.ts
    ```

- **Task 017: 성능 최적화 및 배포 준비** ✅ - 완료
  - ✅ [FE] next.config.ts: `optimizePackageImports` 설정 (lucide-react, exceljs)
  - ✅ [QA] 프로덕션 빌드 + check-all 최종 검증 통과
  - [DEPLOY] Vercel 배포: 환경변수 설정 후 배포 (별도 진행)
  - 관련 기능: 전체 (F001~F011 최종 검증)
  - **테스트 체크리스트:**
    - [x] npm run build 성공 확인
    - [x] npm run check-all 통과 확인

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

---

**📅 최종 업데이트**: 2026-03-10
**📊 진행 상황**: 전체 완료 (17/17 Tasks 완료) — Vercel 배포 별도 진행

# 부서 피드백 관리 시스템 개발 로드맵 v2

v1 로드맵(Task 001~017) 전체 완료 후, 실제 부서 배포를 위한 후속 작업

## 개요

Phase 6에서는 실제 배포를 위한 준비 작업과 사용성 개선을 다룹니다:

- **사용자 시딩**: 22명 부서원 사전 등록 (초기 비밀번호 `000000`)
- **데이터 마이그레이션**: 기존 Excel 피드백 41건(LLM 17건 + ERP 24건) DB 이관
- **비밀번호 변경**: 초기 비밀번호 변경을 위한 기능 신규 개발
- **UX 개선**: 실시간 검색, 탭 커서 스타일 등 사용성 개선

## 참조 문서

- v1 로드맵: `docs/ROADMAP_v1.md` (Task 001~017, 전체 완료)
- PRD: `docs/PRD.md` (F001~F011)
- 코드 규칙: `shrimp-rules.md`

---

## Phase 6: 배포 준비 및 UX 개선

### Task 018: 초기 사용자 시딩 스크립트 ✅

- **영향**: DB / BE
- **사전 준비**: `tsx` devDependency 추가 (`npm i -D tsx`)
- **파일**:
  - 수정: `src/app/actions/auth.ts` (toEmail import 경로 변경)
  - 생성: `src/lib/auth-utils.ts` (toEmail 추출 — 서버 전용, Buffer API 사용), `scripts/seed-users.ts`
- **구현 단계**:
  1. `toEmail()` 함수를 `src/app/actions/auth.ts`에서 `src/lib/auth-utils.ts`로 추출 (Buffer API는 Node.js 전용이므로 `utils.ts` 대신 서버 전용 파일로 분리)
  2. `auth.ts`에서 `toEmail` import 경로를 `@/lib/auth-utils`로 변경
  3. `scripts/seed-users.ts` 생성
     - `--env-file=.env.local` 옵션으로 환경변수 로드 (`npx tsx --env-file=.env.local`)
     - Supabase Admin API `admin.auth.admin.createUser()` 사용
     - 22명 사용자 생성, 초기 비밀번호 `000000`
     - `email_confirm` 비활성화 상태 (별도 설정 불필요)
     - `최정인` 사용자는 DB 트리거(`handle_new_auth_user`)가 자동으로 `is_admin = true` 설정
     - 기존 사용자 스킵 처리 (idempotent)
  4. 실행 및 검증: `npx tsx --env-file=.env.local scripts/seed-users.ts`
- **검증**:
  - [x] Supabase Dashboard에서 auth.users 22명 확인
  - [x] public.users 22명 확인 (트리거에 의한 자동 생성)
  - [x] `최정인` 사용자 `is_admin = true` 확인

### Task 019: 피드백 데이터 마이그레이션 스크립트 ✅

- **영향**: DB / BE
- **의존**: Task 018 완료 후
- **파일**:
  - 생성: `scripts/seed-feedbacks.ts`
  - 참조: `src/lib/auth-utils.ts` (toEmail), `src/lib/supabase/admin.ts`
- **구현 단계**:
  1. `scripts/seed-feedbacks.ts` 생성
  2. ExcelJS로 `피드백.xlsx` 파싱 → LLM 시트(17건) + ERP 시트(24건)
  3. author_id(이름) → `public.users.id` 매핑 (admin 클라이언트로 name 조회)
     - 매핑 실패 시 (이름 불일치 등) 해당 건 로그 출력 후 스킵
  4. `created_at`, `updated_at` 원본 타임스탬프 유지
  5. 중복 방지: content + author_id + category 기준 SELECT 후 비교 (소프트 체크)
  6. 실행 및 검증: `npx tsx --env-file=.env.local scripts/seed-feedbacks.ts`
- **검증**:
  - [x] feedbacks 테이블 41건 확인
  - [x] 작성자/카테고리/타임스탬프 정합성 확인

### Task 020: 비밀번호 변경 기능 ✅

- **영향**: FE / BE
- **파일**:
  - 수정: `src/lib/schemas/auth.ts`, `src/app/actions/auth.ts`, `src/components/layout/app-header.tsx`
  - 생성: `src/components/layout/password-change-dialog.tsx`, `src/components/layout/user-menu.tsx`
  - 삭제: `src/components/layout/logout-button.tsx` (드롭다운에 통합)
- **구현 단계**:
  1. shadcn/ui `dialog`, `dropdown-menu` 컴포넌트 설치
  2. `src/lib/schemas/auth.ts`에 `passwordChangeSchema` 추가
     - currentPassword, newPassword, newPasswordConfirm
     - newPassword ≠ currentPassword 검증
  3. `src/app/actions/auth.ts`에 `changePassword()` Server Action 추가
     - `signInWithPassword`로 현재 비밀번호 검증
     - `supabase.auth.updateUser({ password })` 로 변경
  4. `src/components/layout/user-menu.tsx` 생성
     - AppHeader(Server Component)에서 `userName` prop으로 사용자 이름 전달
     - 사용자 이름 클릭 → DropdownMenu (비밀번호 변경, 로그아웃)
  5. `src/components/layout/password-change-dialog.tsx` 생성
     - React Hook Form + Zod 연동
     - 현재 비밀번호 / 새 비밀번호 / 새 비밀번호 확인
     - 성공 시 toast + Dialog 닫기
  6. `src/components/layout/app-header.tsx` 수정 (LogoutButton → UserMenu 교체)
  7. `src/components/layout/logout-button.tsx` 삭제
- **검증**:
  - [ ] 로그인 → 헤더 드롭다운 메뉴 표시
  - [ ] 비밀번호 변경 다이얼로그 정상 동작
  - [ ] 현재 비밀번호 틀림 → 에러 표시
  - [ ] 새 비밀번호로 재로그인 성공

### Task 021: UX 개선 (실시간 검색 + 탭 커서) ✅

- **영향**: FE
- **파일**:
  - 수정: `src/components/feedback/feedback-search-bar.tsx`
  - 수정: `src/components/feedback/feedback-tabs.tsx`
- **구현 단계**:
  1. **실시간 검색** (`feedback-search-bar.tsx`):
     - `handleKeyDown` (Enter 키 핸들러) 제거
     - `useEffect` + 300ms debounce로 value 변경 시 자동 `router.push()`
     - 초기값과 동일하면 push 스킵 (불필요한 네비게이션 방지)
  2. **탭 커서** (`feedback-tabs.tsx`):
     - `TabsTrigger`에 `className="cursor-pointer"` 추가
- **검증**:
  - [ ] 검색어 입력 시 자동 필터링 (Enter 불필요)
  - [ ] 검색어 삭제 시 전체 목록 복원
  - [ ] 탭 호버 시 pointer 커서 표시

---

## 전체 검증 체크리스트

- [x] `npm run check-all` 통과
- [x] `npm run build` 성공
- [x] Task 018~021 개별 검증 항목 통과

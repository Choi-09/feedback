# Task 008: Supabase 데이터베이스 스키마 및 RLS 정책 구축

## 상태: 완료

## 명세서

Phase 3의 첫 단계로, Supabase 프로젝트에 DB 스키마(테이블, 트리거, RLS 정책, 인덱스)를 구축한다.
4개 마이그레이션으로 분리하여 디버깅 용이성을 확보하고, 헬퍼 함수로 RLS 정책 중복을 제거한다.

## 영향 범위

- **DB**: 테이블 2개, 함수 4개, 트리거 2개, RLS 정책 5개, 인덱스 3개 생성
- **FE/BE**: 코드 변경 없음

## 관련 기능

- F001~F011: 전체 기능의 데이터 기반

## 관련 파일

```
supabase/migrations/001_create_tables.sql      # pg_trgm 확장 + users, feedbacks 테이블
supabase/migrations/002_create_triggers.sql     # 헬퍼 함수 + 트리거
supabase/migrations/003_create_rls_policies.sql # RLS 정책
supabase/migrations/004_create_indexes.sql      # 인덱스
```

## 수락 기준

- [x] users, feedbacks 테이블 생성 (TypeScript 타입과 컬럼 매핑 일치)
- [x] RLS 활성화 및 정책 적용 (users 1개, feedbacks 4개)
- [x] handle_new_auth_user 트리거: auth.users 가입 시 public.users 자동 생성
- [x] name='최정인' 가입 시 is_admin=true 자동 설정
- [x] updated_at 트리거: UPDATE 시 자동 갱신
- [x] pg_trgm GIN 인덱스로 키워드 검색 지원
- [x] CASCADE 삭제 동작 확인

## 구현 단계

### 1단계: Migration 1 — 확장 + 테이블 생성

- [x] pg_trgm 확장 활성화
- [x] users 테이블 생성 (id, auth_id, name, is_admin, created_at)
- [x] feedbacks 테이블 생성 (id, category, content, author_id, created_at, updated_at)
- [x] FK, CHECK 제약조건, 기본값 설정

### 2단계: Migration 2 — 헬퍼 함수 + 트리거

- [x] get_my_user_id() 함수 (SECURITY DEFINER, STABLE)
- [x] is_admin() 함수 (SECURITY DEFINER, STABLE)
- [x] update_updated_at() 트리거 함수 + set_updated_at 트리거
- [x] handle_new_auth_user() 트리거 함수 + on_auth_user_created 트리거

### 3단계: Migration 3 — RLS 정책

- [x] users: SELECT (본인 OR 관리자)
- [x] feedbacks: SELECT (authenticated 전체), INSERT/UPDATE/DELETE (본인만)

### 4단계: Migration 4 — 인덱스

- [x] idx_feedbacks_category_created_at (category, created_at DESC)
- [x] idx_feedbacks_author_id (author_id)
- [x] idx_feedbacks_content_trgm GIN (content gin_trgm_ops)

### 5단계: 통합 검증

- [x] 테이블 구조 확인
- [x] RLS 상태/정책 확인
- [x] 트리거 동작 테스트 (INSERT → UPDATE → updated_at 갱신)
- [x] 관리자 자동 설정 테스트 (name='최정인' → is_admin=true)
- [x] CASCADE 삭제 테스트
- [x] 테스트 데이터 정리 완료

## 변경 사항 요약

4개 마이그레이션 파일 생성:
- `supabase/migrations/001_create_tables.sql` — pg_trgm + users/feedbacks 테이블
- `supabase/migrations/002_create_triggers.sql` — 헬퍼 함수 4개 + 트리거 2개
- `supabase/migrations/003_create_rls_policies.sql` — RLS 정책 5개
- `supabase/migrations/004_create_indexes.sql` — 인덱스 3개

DB 구조 요약:
- **테이블**: users (5 컬럼), feedbacks (6 컬럼)
- **함수**: get_my_user_id(), is_admin() (DEFINER), update_updated_at(), handle_new_auth_user() (DEFINER)
- **트리거**: set_updated_at (feedbacks BEFORE UPDATE), on_auth_user_created (auth.users AFTER INSERT)
- **RLS 정책**: users_select_own_or_admin, feedbacks_select/insert/update/delete (5개)
- **인덱스**: 복합 2개 + GIN 1개

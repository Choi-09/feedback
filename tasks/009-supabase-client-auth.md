# Task 009: Supabase 클라이언트 설정 및 인증 Server Actions 구현

## 상태: 완료

## 명세서

Phase 3의 두 번째 단계로, Supabase 클라이언트 유틸리티 4종과 인증 Server Actions, 미들웨어를 구현한다.
Task 008에서 구축한 DB 스키마를 기반으로 실제 인증 흐름을 구현한다.

## 영향 범위

- **BE**: Supabase 클라이언트 4종, Server Actions 4개, 미들웨어
- **FE**: 이 Task에서 UI 변경 없음 (Task 010에서 연동)

## 관련 기능

- F001 (로그인/자동가입), F002 (로그아웃)

## 관련 파일

```
src/lib/supabase/server.ts      # Server Component/Server Action용
src/lib/supabase/client.ts      # Client Component용
src/lib/supabase/middleware.ts   # 미들웨어용
src/lib/supabase/admin.ts       # Service Role 서버 전용
src/app/actions/auth.ts          # 인증 Server Actions
src/middleware.ts                # 인증 라우트 보호 미들웨어
```

## 수락 기준

- [x] Supabase 클라이언트 4종 생성 (@supabase/ssr 0.9.x getAll/setAll 패턴)
- [x] checkUserExists: admin 클라이언트로 이름 존재 여부 확인
- [x] signIn: 이름+비밀번호 로그인, 내부 이메일 변환 캡슐화
- [x] signUp: 자동가입 + metadata에 name 포함, 내부 이메일 변환 캡슐화
- [x] signOut: 세션 종료 후 /login 리다이렉트
- [x] 미들웨어: /login 공개(로그인 시 리다이렉트), /feedbacks/* 보호
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

### 1단계: Supabase 클라이언트 유틸리티 4종

- [x] server.ts — createServerClient + async cookies()
- [x] client.ts — createBrowserClient
- [x] middleware.ts — request/response 쿠키 핸들링
- [x] admin.ts — Service Role + getServerEnv()

### 2단계: 인증 Server Actions

- [x] toEmail() 내부 private 함수 (export 금지)
- [x] checkUserExists, signIn, signUp, signOut 구현
- [x] 'use server' 지시문 적용
- [x] ActionResult<T> 반환 타입 사용

### 3단계: Next.js 미들웨어

- [x] /login 공개 + 로그인 상태 리다이렉트
- [x] /feedbacks/*, /api/feedbacks/* 보호
- [x] matcher config 설정

### 4단계: 빌드 검증

- [x] npm run check-all 통과
- [x] npm run build 성공 (Middleware 108 kB 포함)

## 변경 사항 요약

6개 파일 신규 생성:
- `src/lib/supabase/server.ts` — Server 환경 Supabase 클라이언트
- `src/lib/supabase/client.ts` — Browser 환경 Supabase 클라이언트
- `src/lib/supabase/middleware.ts` — 미들웨어 환경 Supabase 클라이언트
- `src/lib/supabase/admin.ts` — Service Role 서버 전용 클라이언트
- `src/app/actions/auth.ts` — 인증 Server Actions 4개
- `src/middleware.ts` — 인증 라우트 보호 미들웨어

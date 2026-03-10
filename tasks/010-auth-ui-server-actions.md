# Task 010: 인증 UI와 Server Actions 연동

## 상태: 완료 ✅

## 명세

Phase 2에서 더미 데이터로 구현된 인증 UI(LoginForm, AppHeader)를 Phase 3에서 구현된 실제 Server Actions(checkUserExists, signIn, signUp, signOut)와 연동하여 실제 인증 플로우를 완성한다.

## 영향 범위

- **FE**: LoginForm, AppHeader, LogoutButton

## 관련 기능

- F001: 로그인/자동가입
- F002: 로그아웃

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| src/components/login-form.tsx | 수정 | 더미 핸들러 → checkUserExists, signIn, signUp 연동 |
| src/components/layout/app-header.tsx | 수정 | async Server Component, Supabase 사용자 조회 |
| src/components/layout/logout-button.tsx | 신규 | Client Component, signOut 호출 |

## 수락 기준

- [x] LoginForm에서 checkUserExists로 신규/기존 사용자 판별
- [x] 기존 사용자: signIn Server Action 호출 → /feedbacks 리다이렉트
- [x] 신규 사용자: 비밀번호 확인 필드 표시 → signUp 호출 → /feedbacks 리다이렉트
- [x] AppHeader에서 실제 사용자 이름 표시 (Supabase getUser + users 테이블)
- [x] LogoutButton에서 signOut 호출 → /login 리다이렉트
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

- [x] 1단계: LogoutButton Client Component 생성
- [x] 2단계: AppHeader async Server Component 변환
- [x] 3단계: LoginForm Server Actions 연동
- [x] 4단계: 통합 검증 (check-all, build)

## 테스트 체크리스트

- [ ] Playwright: 신규 사용자 전체 플로우 (이름/비밀번호 → 비밀번호 확인 → 자동가입 + 로그인 → /feedbacks)
- [ ] Playwright: 기존 사용자 로그인 전체 플로우 (이름/비밀번호 → 로그인 → /feedbacks)
- [ ] Playwright: 로그아웃 전체 플로우 (로그아웃 버튼 → /login)
- [ ] Playwright: 유효성 검증 에러 메시지 (빈 필드, 비밀번호 불일치 등)
- [ ] Playwright: 헤더에 사용자 이름 표시 확인

# Task 005: 인증 페이지 UI 구현 (로그인/자동가입 통합)

## 상태: 완료

## 명세서

LoginForm 컴포넌트를 구현하여 이름 기반 로그인/자동가입 통합 UI를 완성한다.

## 영향 범위

- **FE**: 로그인 페이지 UI

## 관련 기능

- F001 (로그인/자동가입)

## 관련 파일

```
src/components/login-form.tsx         # LoginForm (Client Component)
src/app/(auth)/login/page.tsx         # 로그인 페이지
```

## 수락 기준

- [x] RHF + Zod 연동 (loginSchema, passwordConfirmSchema)
- [x] 신규 사용자 감지 시 비밀번호 확인 필드 동적 표시
- [x] 에러 메시지 표시, 로딩 상태 처리
- [x] 더미 onSubmit 핸들러 동작 확인
- [x] npm run check-all 통과

## 변경 사항 요약

- LoginForm 컴포넌트 생성 (이름/비밀번호 → 신규 사용자 시 비밀번호 확인)
- 로그인 페이지에 Card 레이아웃 + LoginForm 적용

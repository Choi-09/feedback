# Task 003: TypeScript 타입 정의 및 Zod 스키마 설계

## 상태: 완료

## 명세서

피드백 관리 시스템의 도메인 타입(auth, feedback, common)과 Zod v4 폼 검증 스키마를 정의하여,
이후 Task 004~017에서 사용할 타입 시스템 기반을 구축한다.

## 영향 범위

- **FE**: 폼 검증 스키마 (React Hook Form + zodResolver 연동)
- **BE**: Server Action 반환 타입, DB 모델 타입

## 관련 기능

- F001~F011: 전체 기능의 타입 기반

## 관련 파일

```
src/lib/types/common.ts        # FeedbackCategory, ActionResult<T>
src/lib/types/auth.ts           # User, AuthUser, UserProfile
src/lib/types/feedback.ts       # Feedback, FeedbackListItem, AdminFeedbackListItem, FeedbackDetail
src/lib/schemas/auth.ts         # loginSchema, passwordConfirmSchema
src/lib/schemas/feedback.ts     # categorySchema, feedbackCreateSchema, feedbackUpdateSchema
```

## 수락 기준

- [x] npm run typecheck 통과
- [x] 모든 타입이 Named export로 정의
- [x] 익명성 보장: FeedbackListItem에 author_id 미포함, is_mine 포함
- [x] Zod 스키마에서 z.infer로 폼 데이터 타입 자동 추출
- [x] 한국어 주석 및 에러 메시지 적용

## 구현 단계

### 1단계: 공통 타입 정의

- [x] src/lib/types/common.ts 생성
- [x] FeedbackCategory, ActionResult<T> 타입 정의

### 2단계: 도메인 타입 정의

- [x] src/lib/types/auth.ts 생성 (User, AuthUser, UserProfile)
- [x] src/lib/types/feedback.ts 생성 (Feedback, FeedbackListItem, AdminFeedbackListItem, FeedbackDetail)

### 3단계: Zod 스키마 정의

- [x] src/lib/schemas/auth.ts 생성 (loginSchema, passwordConfirmSchema)
- [x] src/lib/schemas/feedback.ts 생성 (categorySchema, feedbackCreateSchema, feedbackUpdateSchema)

### 4단계: 검증

- [x] npm run check-all 통과

## 변경 사항 요약

5개 파일 신규 생성:
- `src/lib/types/common.ts` — FeedbackCategory, ActionResult<T> 공통 타입
- `src/lib/types/auth.ts` — User(DB), AuthUser(앱 내부), UserProfile(클라이언트) 타입
- `src/lib/types/feedback.ts` — Feedback(서버 내부), FeedbackListItem(익명), AdminFeedbackListItem(관리자), FeedbackDetail(수정용) 타입
- `src/lib/schemas/auth.ts` — loginSchema, passwordConfirmSchema + z.infer 타입 추출
- `src/lib/schemas/feedback.ts` — categorySchema, feedbackCreateSchema, feedbackUpdateSchema + z.infer 타입 추출

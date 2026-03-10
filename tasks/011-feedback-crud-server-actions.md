# Task 011: 피드백 CRUD Server Actions 구현

## 상태: 완료 ✅

## 명세

피드백의 목록 조회, 단건 조회, 생성, 수정, 삭제를 처리하는 Server Actions를 구현한다. 익명성 보장(author_id 미반환, is_mine 플래그), 관리자 작성자 확인(author_name), 검색(ILIKE + pg_trgm), 본인 작성건 이중 검증(RLS + Server Action) 등 핵심 비즈니스 로직을 포함한다.

## 영향 범위

- **BE**: Server Actions (`src/app/actions/feedback.ts`)

## 관련 기능

- F004: 피드백 목록 조회 (익명)
- F005: 피드백 작성
- F006: 피드백 수정 (본인만)
- F007: 피드백 삭제 (본인만)
- F008: 피드백 검색
- F010: 관리자 작성자 확인

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| src/app/actions/feedback.ts | 신규 | 피드백 CRUD Server Actions 5개 + 헬퍼 함수 |

## 수락 기준

- [x] getFeedbacks: 카테고리별 목록 조회 + is_mine 플래그 + 검색 지원
- [x] getFeedbacks: 관리자인 경우 author_name 포함
- [x] getFeedbackById: 본인 작성건 단건 조회 (수정 페이지용)
- [x] createFeedback: Zod 서버 검증 + 피드백 생성 + revalidatePath
- [x] updateFeedback: 본인 작성건 이중 검증 + 수정 + revalidatePath
- [x] deleteFeedback: 본인 작성건 이중 검증 + 삭제 + revalidatePath
- [x] 익명성 보장: author_id를 클라이언트에 절대 반환하지 않음
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

- [x] 1단계: getCurrentUser 헬퍼 함수 구현
- [x] 2단계: getFeedbacks (목록 조회 + 검색 + 관리자 분기)
- [x] 3단계: getFeedbackById (단건 조회)
- [x] 4단계: createFeedback (생성)
- [x] 5단계: updateFeedback (수정)
- [x] 6단계: deleteFeedback (삭제)
- [x] 7단계: 통합 검증 (check-all, build)

## 테스트 체크리스트

- [x] 피드백 생성 후 목록에 노출 확인
- [x] 카테고리별 피드백 분리 조회 확인
- [x] 본인 작성건 is_mine=true, 타인 작성건 is_mine=false 확인
- [x] 본인 작성건만 수정/삭제 가능 확인
- [x] 타인 작성건 수정/삭제 시도 시 에러 확인
- [x] 관리자 계정으로 author_name 포함 확인
- [x] 일반 사용자 응답에 author_id, author_name 미포함 확인
- [x] 검색어로 피드백 필터링 확인

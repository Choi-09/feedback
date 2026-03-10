# Task 013: 피드백 작성/수정/삭제 기능 실제 데이터 연동

## 상태: 완료 ✅

## 명세

피드백 작성/수정/삭제 페이지의 더미 핸들러를 실제 Server Action으로 교체한다. 수정 페이지는 getFeedbackById로 본인 작성건만 조회하고, 작성/수정/삭제 폼은 각각 createFeedback, updateFeedback, deleteFeedback Server Action을 호출한다.

## 영향 범위

- **FE**: 작성 폼, 수정 폼, 수정 페이지

## 관련 기능

- F005: 피드백 작성
- F006: 피드백 수정 (본인만)
- F007: 피드백 삭제 (본인만)

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| src/app/(main)/feedbacks/[id]/edit/page.tsx | 수정 | mock → getFeedbackById 교체 |
| src/components/feedback/feedback-form.tsx | 수정 | 더미 → createFeedback 연동 |
| src/components/feedback/feedback-edit-form.tsx | 수정 | 더미 → updateFeedback/deleteFeedback 연동 |
| src/lib/data/mock-feedbacks.ts | 삭제 | 더 이상 사용처 없음 |

## 수락 기준

- [x] 수정 페이지: getFeedbackById로 실제 데이터 조회
- [x] 수정 페이지: 본인 작성건 아닌 경우 /feedbacks 리다이렉트
- [x] 작성 폼: createFeedback Server Action 연동 + toast 알림
- [x] 수정 폼: updateFeedback Server Action 연동 + toast 알림
- [x] 수정 폼: deleteFeedback Server Action 연동 + toast 알림
- [x] mock-feedbacks.ts 삭제
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

- [x] 1단계: feedbacks/[id]/edit/page.tsx 수정
- [x] 2단계: feedback-form.tsx 수정 (createFeedback 연동)
- [x] 3단계: feedback-edit-form.tsx 수정 (updateFeedback/deleteFeedback 연동)
- [x] 4단계: mock-feedbacks.ts 삭제
- [x] 5단계: 통합 검증 (check-all, build)

## 테스트 체크리스트

- [x] 피드백 작성 전체 플로우 (작성 버튼 → 내용 입력 → 저장 → 목록에서 확인)
- [x] 피드백 수정 전체 플로우 (수정 버튼 → 내용 변경 → 저장 → 목록에서 변경 확인)
- [x] 피드백 삭제 전체 플로우 (수정 페이지 → 삭제 → 확인 팝업 → 목록에서 제거 확인)
- [x] 취소 버튼 클릭 시 목록 복귀 확인
- [x] 빈 내용 제출 시 유효성 검증 에러 확인
- [x] 타인 작성건 수정 페이지 직접 접근 시 리다이렉트 확인

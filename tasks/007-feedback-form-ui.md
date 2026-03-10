# Task 007: 피드백 작성/수정 페이지 UI 구현 (더미 데이터)

## 상태: 완료

## 명세서

피드백 작성 폼(FeedbackForm)과 수정 폼(FeedbackEditForm)을 구현한다.

## 영향 범위

- **FE**: 피드백 작성/수정 페이지 UI

## 관련 기능

- F005 (작성), F006 (수정), F007 (삭제)

## 관련 파일

```
src/components/feedback/feedback-form.tsx
src/components/feedback/feedback-edit-form.tsx
src/app/(main)/feedbacks/new/page.tsx
src/app/(main)/feedbacks/[id]/edit/page.tsx
```

## 수락 기준

- [x] FeedbackForm: RHF + Zod (feedbackCreateSchema), 카테고리 표시, 저장/취소
- [x] FeedbackEditForm: RHF + Zod (feedbackUpdateSchema), 기존 데이터 프리필, 저장/삭제/취소
- [x] 삭제 시 AlertDialog 확인 팝업
- [x] 더미 onSubmit/onDelete 핸들러
- [x] npm run check-all 통과
- [x] npm run build 성공

## 변경 사항 요약

- FeedbackForm, FeedbackEditForm 컴포넌트 생성
- 작성/수정 페이지에 PageHeader + PageContainer 적용
- AlertDialog (base-ui) render prop 패턴 사용

# Task 006: 피드백 목록 페이지 UI 구현 (더미 데이터)

## 상태: 완료

## 명세서

피드백 목록 페이지의 전체 UI를 mock 데이터 기반으로 완성한다.

## 영향 범위

- **FE**: 피드백 목록 페이지 UI

## 관련 기능

- F003 (탭 전환), F004 (목록 조회), F008 (검색), F009 (안내), F010 (관리자), F011 (엑셀)

## 관련 파일

```
src/lib/data/mock-feedbacks.ts
src/components/feedback/feedback-tabs.tsx
src/components/feedback/feedback-guide-banner.tsx
src/components/feedback/feedback-search-bar.tsx
src/components/feedback/feedback-card.tsx
src/components/feedback/feedback-empty-state.tsx
src/components/feedback/feedback-skeleton-list.tsx
src/components/feedback/excel-download-button.tsx
src/app/(main)/feedbacks/page.tsx
src/app/(main)/feedbacks/loading.tsx
```

## 수락 기준

- [x] mock 데이터 생성 (LLM 5건, ERP 5건)
- [x] 7개 피드백 컴포넌트 구현
- [x] 목록 페이지 조합 (탭 + 안내 + 검색 + 작성 + 엑셀 + 목록/빈상태)
- [x] npm run check-all 통과

## 변경 사항 요약

- mock 데이터 파일 생성
- 피드백 컴포넌트 7개 생성
- 목록 페이지/로딩 페이지 업데이트
- base-nova Button은 asChild 미지원 → buttonVariants + Link 조합 사용

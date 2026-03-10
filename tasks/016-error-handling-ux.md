# Task 016: 에러 처리, 접근성, UX 개선

## 상태: 완료 ✅

## 명세

에러 페이지(error.tsx, not-found.tsx), robots.txt 추가로 프로덕션 안정성을 높인다. 23명 내부 앱이므로 MVP 수준의 에러 처리에 집중.

## 영향 범위

- **FE**: 에러 페이지, robots.txt

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| src/app/not-found.tsx | 신규 | 전역 404 페이지 |
| src/app/(main)/feedbacks/error.tsx | 신규 | 피드백 목록 에러 페이지 |
| src/app/(main)/feedbacks/[id]/edit/error.tsx | 신규 | 수정 페이지 에러 페이지 |
| src/app/robots.ts | 신규 | 검색 엔진 크롤링 차단 |

## 구현 단계

- [x] 1단계: 전역 not-found.tsx
- [x] 2단계: 피드백 목록 error.tsx
- [x] 3단계: 수정 페이지 error.tsx
- [x] 4단계: robots.ts (noindex)
- [x] 5단계: 통합 검증 (check-all, build)

## 테스트 체크리스트

- [x] 존재하지 않는 경로 접근 시 404 페이지 표시 확인
- [x] 피드백 목록 에러 시 에러 페이지 + 재시도 버튼 확인
- [x] robots.txt 접근 시 noindex 확인

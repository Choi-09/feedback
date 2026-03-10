# Task 012: 피드백 목록 페이지 실제 데이터 연동

## 상태: 완료 ✅

## 명세

피드백 목록 페이지(feedbacks/page.tsx)의 더미 데이터를 실제 Server Action(getFeedbacks)으로 교체한다. 관리자 여부를 페이지에서 판별하여 FeedbackCard에 isAdmin 플래그를 전달한다.

## 영향 범위

- **FE**: 피드백 목록 페이지 (`src/app/(main)/feedbacks/page.tsx`)

## 관련 기능

- F003: 탭 전환
- F004: 피드백 목록 조회 (익명)
- F008: 피드백 검색
- F009: 피드백 안내 표시
- F010: 관리자 작성자 확인

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| src/app/(main)/feedbacks/page.tsx | 수정 | mock → getFeedbacks 교체, isAdmin 전달 |

## 수락 기준

- [x] getFeedbacks Server Action으로 실제 데이터 조회
- [x] 관리자 여부(isAdmin) 판별 후 FeedbackCard에 전달
- [x] 더미 데이터 import 제거 (mock-feedbacks.ts는 edit 페이지에서 사용 중이므로 유지)
- [x] 검색 + 카테고리 필터링 동작 확인
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

- [x] 1단계: feedbacks/page.tsx 수정 (mock → getFeedbacks + isAdmin 쿼리)
- [x] 2단계: 통합 검증 (check-all, build)

## 테스트 체크리스트

- [x] /feedbacks 접근 시 LLM 탭이 기본 선택 상태 확인
- [x] LLM/ERP 탭 전환 시 URL searchParams 변경 및 목록 갱신 확인
- [x] 검색어 입력 시 피드백 필터링 확인
- [x] 피드백 없을 때 빈 상태 화면 표시 확인
- [x] 본인 작성건에 [수정] 버튼 표시 확인
- [x] 안내 배너 카테고리별 다른 메시지 확인

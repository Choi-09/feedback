# Task 015: 엑셀 다운로드 기능 구현

## 상태: 완료 ✅

## 명세

ExcelJS를 사용하여 피드백 목록을 엑셀 파일로 다운로드하는 API Route와 프론트엔드 버튼을 구현한다. 관리자는 작성자 열 포함, 일반 사용자는 미포함.

## 영향 범위

- **BE**: API Route (`src/app/api/feedbacks/export/route.ts`)
- **FE**: 다운로드 버튼 (`src/components/feedback/excel-download-button.tsx`)

## 관련 기능

- F011: 엑셀 다운로드
- F010: 관리자 작성자 포함

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| src/app/api/feedbacks/export/route.ts | 수정 | 엑셀 생성 API |
| src/lib/excel.ts | 신규 | ExcelJS 워크북 생성 헬퍼 |
| src/components/feedback/excel-download-button.tsx | 수정 | 실제 다운로드 연동 |

## 수락 기준

- [x] API Route: 인증 확인 (비인증 시 401)
- [x] API Route: category query param으로 필터링
- [x] API Route: 관리자 → 작성자 열 포함, 일반 → 미포함
- [x] API Route: Content-Disposition 헤더로 파일 다운로드
- [x] ExcelDownloadButton: fetch → blob → 다운로드 트리거
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

- [x] 1단계: lib/excel.ts 헬퍼 함수 구현
- [x] 2단계: API Route 구현
- [x] 3단계: ExcelDownloadButton 실제 다운로드 연동
- [x] 4단계: 통합 검증 (check-all, build)

## 테스트 체크리스트

- [x] 일반 사용자 엑셀 다운로드 → 작성자 열 미포함 확인
- [x] 관리자 엑셀 다운로드 → 작성자 열 포함 확인
- [x] 비인증 상태에서 API 직접 호출 시 401 응답 확인
- [x] 다운로드 버튼 클릭 → 파일 다운로드 시작 확인

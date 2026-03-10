# Task 002: App Router 라우트 구조 및 레이아웃 골격 생성

## 상태: 완료

## 명세서

Next.js 15 App Router의 Route Group 기반 전체 라우트 구조를 생성하고, 각 페이지의 빈 껍데기를 만든다.
이후 태스크(003~017)에서 실제 UI와 로직을 채워넣을 기반을 마련한다.

## 영향 범위

- **FE**: Route Group 구조, 레이아웃, 빈 페이지, API Route 골격

## 관련 기능

- 전체 (F001~F011 라우팅)

## 관련 파일

```
src/app/(auth)/layout.tsx                  # 인증 그룹 레이아웃 (중앙 정렬, 헤더 없음)
src/app/(auth)/login/page.tsx              # 로그인 페이지 껍데기
src/app/(main)/layout.tsx                  # 메인 그룹 레이아웃 (Header placeholder)
src/app/(main)/page.tsx                    # / -> /feedbacks 리다이렉트
src/app/(main)/feedbacks/page.tsx          # 피드백 목록 페이지 껍데기
src/app/(main)/feedbacks/loading.tsx       # 피드백 목록 로딩 스켈레톤
src/app/(main)/feedbacks/new/page.tsx      # 피드백 작성 페이지 껍데기
src/app/(main)/feedbacks/[id]/edit/page.tsx # 피드백 수정 페이지 껍데기
src/app/api/feedbacks/export/route.ts      # 엑셀 다운로드 API Route 골격
```

## 수락 기준

- [x] npm run build 성공
- [x] npm run check-all 통과 (lint + typecheck + format:check)
- [x] 모든 라우트 접근 가능 (빈 페이지라도 에러 없이 렌더링)
- [x] / 접근 시 /feedbacks로 리다이렉트
- [x] /login 접근 시 로그인 페이지 렌더링
- [x] /feedbacks, /feedbacks/new, /feedbacks/[id]/edit 접근 가능
- [x] /api/feedbacks/export GET 요청 시 JSON 응답

## 구현 단계

### 1단계: 기존 파일 정리 및 (auth) Route Group 생성

- [x] src/app/page.tsx 삭제 (Route 충돌 방지)
- [x] (auth)/layout.tsx — 중앙 정렬 flex 레이아웃
- [x] (auth)/login/page.tsx — 로그인 placeholder

### 2단계: (main) Route Group 생성

- [x] (main)/layout.tsx — Header placeholder + container 레이아웃
- [x] (main)/page.tsx — redirect('/feedbacks')

### 3단계: 피드백 페이지 골격 및 API Route

- [x] feedbacks/page.tsx — 피드백 목록 placeholder
- [x] feedbacks/loading.tsx — animate-pulse 스켈레톤 3개
- [x] feedbacks/new/page.tsx — 피드백 작성 placeholder
- [x] feedbacks/[id]/edit/page.tsx — params Promise 패턴 적용
- [x] api/feedbacks/export/route.ts — GET 501 응답

### 4단계: 검증

- [x] Prettier 포맷 확인 (모든 파일 unchanged)
- [x] npm run check-all 통과
- [x] npm run build 성공 (7개 라우트 정상 빌드)

## 변경 사항 요약

- 삭제: src/app/page.tsx (기존 placeholder)
- 생성: 9개 신규 파일 (2 auth + 6 main + 1 api)
- Route Group: (auth) 중앙 정렬 / (main) Header + container
- Next.js 15 패턴: params Promise 타입, redirect(), NextResponse
- 빌드 결과: 7개 라우트 (/ ○, /login ○, /feedbacks ○, /feedbacks/new ○, /feedbacks/[id]/edit ƒ, /api/feedbacks/export ƒ, /_not-found ○)

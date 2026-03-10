# Task 004: shadcn/ui 컴포넌트 설치 및 공통 레이아웃 컴포넌트 구현

## 상태: 완료

## 명세서

shadcn/ui 컴포넌트 11개를 설치하고, 공통 레이아웃 컴포넌트(AppHeader, PageContainer, PageHeader)를 구현한다.

## 영향 범위

- **FE**: UI 컴포넌트 기반 구축, 레이아웃 시스템

## 관련 기능

- F002 (로그아웃 버튼), 전체 레이아웃

## 관련 파일

```
src/components/ui/*.tsx              # shadcn/ui 11개 컴포넌트
src/components/layout/app-header.tsx  # 헤더 (로고 + 사용자 + 로그아웃)
src/components/layout/page-container.tsx  # 반응형 컨테이너
src/components/layout/page-header.tsx     # 페이지 제목 + 액션
src/app/(main)/layout.tsx             # AppHeader 적용
src/app/layout.tsx                    # Toaster 추가
```

## 수락 기준

- [x] shadcn/ui 컴포넌트 설치 완료
- [x] AppHeader, PageContainer, PageHeader 구현
- [x] (main)/layout.tsx에 AppHeader 적용
- [x] npm run check-all 통과
- [x] npm run build 성공

## 변경 사항 요약

- shadcn/ui 11개 컴포넌트 설치 (button, input, textarea, label, card, separator, tabs, alert-dialog, sonner, badge, skeleton)
- sonner.tsx에서 next-themes 의존성 제거 (미사용)
- 공통 레이아웃 컴포넌트 3개 생성
- 루트 레이아웃에 Toaster 추가

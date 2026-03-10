# Task 001: 프로젝트 초기화 및 개발 환경 설정

## 상태: 완료

## 명세서

부서 피드백 관리 시스템의 Next.js 15 프로젝트를 초기화하고 개발 환경을 설정한다.
전체 프로젝트 인프라를 구축하여 이후 태스크(002~017)의 기반을 마련한다.

## 영향 범위

- **FE**: Next.js 15 프로젝트 생성, 패키지 설치, 린트/포맷 설정, shadcn/ui 초기화

## 관련 기능

- 전체 (F001~F011 기반 인프라)

## 관련 파일

```
package.json
tsconfig.json
next.config.ts
.env.local
.env.example
CLAUDE.md
src/lib/env.ts
src/lib/utils.ts
components.json
.prettierrc
.prettierignore
.gitignore
eslint.config.mjs
postcss.config.mjs
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
```

## 수락 기준

- [x] Next.js 15.x + React 19.x + TypeScript 5.x 설치
- [x] TailwindCSS v4 정상 동작
- [x] shadcn/ui 초기화 (base-nova 스타일, CSS variables)
- [x] ESLint + Prettier 통합 설정
- [x] check-all 스크립트 동작 (lint + typecheck + format:check)
- [x] 환경변수 파일 (.env.local, .env.example) 생성
- [x] src/lib/env.ts Zod 검증 유틸리티 생성
- [x] CLAUDE.md 프로젝트 지침 파일 생성
- [x] 경로 별칭 @/ → src/ 설정
- [x] npm run build 성공
- [x] 기존 파일 보존 (docs/, tasks/, ROADMAP.md 등)

## 구현 단계

### 1단계: Git 초기화 및 Next.js 프로젝트 생성

- [x] git init
- [x] create-next-app@15 (임시 디렉토리 → 파일 복사 방식)
- [x] 보일러플레이트 정리 (한국어 메타데이터, 빈 페이지)

### 2단계: 패키지 설치 및 코드 품질 도구

- [x] 런타임 패키지 6개 설치
- [x] Prettier + ESLint 통합 설정
- [x] check-all 스크립트 구성

### 3단계: shadcn/ui 및 환경변수

- [x] shadcn/ui 초기화 (base-nova, neutral)
- [x] .env.local, .env.example 생성
- [x] src/lib/env.ts Zod 검증 유틸리티

### 4단계: 문서화

- [x] CLAUDE.md 생성
- [x] tasks/001-setup.md 생성

## 변경 사항 요약

- Next.js 15.5.12 프로젝트 초기화 완료
- 패키지: react-hook-form, zod v4, exceljs, @supabase/supabase-js, @supabase/ssr 등
- ESLint flat config + Prettier 통합, check-all 스크립트
- shadcn/ui v4 (base-nova 스타일) 초기화
- Zod v4 기반 환경변수 검증 유틸리티
- CLAUDE.md 프로젝트 지침서 (글로벌 템플릿 준수)

# Task 017: 성능 최적화 및 배포 준비

## 상태: 완료 ✅

## 명세

Next.js 성능 최적화 설정, 프로덕션 빌드 검증, Vercel 배포 준비를 수행한다.

## 영향 범위

- **FE**: next.config.ts 최적화
- **DEPLOY**: Vercel 배포 준비

## 관련 파일

| 파일 | 유형 | 설명 |
|------|------|------|
| next.config.ts | 수정 | optimizePackageImports 설정 |

## 구현 단계

- [x] 1단계: next.config.ts 최적화 (optimizePackageImports: lucide-react, exceljs)
- [x] 2단계: 프로덕션 빌드 최종 검증 (check-all, build)
- [x] 3단계: ROADMAP + Task 파일 업데이트

## 테스트 체크리스트

- [x] npm run build 성공 확인
- [x] npm run check-all 통과 확인

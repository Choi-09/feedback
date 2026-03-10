-- Migration 004: 인덱스 생성
-- 영향 범위: DB 전용

-- 카테고리별 최신순 목록 조회 최적화
CREATE INDEX idx_feedbacks_category_created_at
  ON public.feedbacks (category, created_at DESC);

-- 본인 작성건 조회 최적화
CREATE INDEX idx_feedbacks_author_id
  ON public.feedbacks (author_id);

-- 피드백 내용 키워드 검색 (pg_trgm GIN 인덱스)
CREATE INDEX idx_feedbacks_content_trgm
  ON public.feedbacks USING GIN (content gin_trgm_ops);

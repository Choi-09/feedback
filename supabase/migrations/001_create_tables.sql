-- Migration 001: pg_trgm 확장 활성화 + users, feedbacks 테이블 생성
-- 영향 범위: DB 전용

-- 피드백 내용 검색을 위한 pg_trgm 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 사용자 테이블: auth.users와 1:1 매핑
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT UNIQUE NOT NULL CHECK (char_length(name) <= 20),
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 피드백 테이블
CREATE TABLE public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('llm', 'erp')),
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 테이블 코멘트
COMMENT ON TABLE public.users IS '사용자 테이블 (auth.users와 1:1 매핑)';
COMMENT ON TABLE public.feedbacks IS '피드백 테이블 (LLM/ERP 카테고리별 익명 피드백)';

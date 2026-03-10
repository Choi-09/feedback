-- Migration 003: RLS 정책 설정
-- 영향 범위: DB 전용

-- ========================================
-- users 테이블 RLS
-- ========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 본인 또는 관리자만 조회 가능
CREATE POLICY "users_select_own_or_admin"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid() OR public.is_admin());

-- INSERT/UPDATE/DELETE: service_role만 가능 (정책 없음 = 차단)

-- ========================================
-- feedbacks 테이블 RLS
-- ========================================
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자 전체 조회
CREATE POLICY "feedbacks_select_authenticated"
  ON public.feedbacks
  FOR SELECT
  TO authenticated
  USING (true);

-- 인증된 사용자 본인 피드백 작성
CREATE POLICY "feedbacks_insert_own"
  ON public.feedbacks
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = public.get_my_user_id());

-- 본인 피드백만 수정
CREATE POLICY "feedbacks_update_own"
  ON public.feedbacks
  FOR UPDATE
  TO authenticated
  USING (author_id = public.get_my_user_id())
  WITH CHECK (author_id = public.get_my_user_id());

-- 본인 피드백만 삭제
CREATE POLICY "feedbacks_delete_own"
  ON public.feedbacks
  FOR DELETE
  TO authenticated
  USING (author_id = public.get_my_user_id());

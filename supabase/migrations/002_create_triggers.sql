-- Migration 002: 헬퍼 함수 + 트리거 생성
-- 영향 범위: DB 전용

-- 헬퍼 함수: auth.uid() → users.id 매핑
CREATE OR REPLACE FUNCTION public.get_my_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid();
$$;

-- 헬퍼 함수: 현재 사용자 관리자 여부
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE auth_id = auth.uid()),
    false
  );
$$;

-- 트리거 함수: feedbacks.updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 트리거: feedbacks UPDATE 시 updated_at 자동 갱신
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 트리거 함수: auth.users 가입 시 public.users 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
BEGIN
  user_name := NEW.raw_user_meta_data->>'name';

  INSERT INTO public.users (auth_id, name, is_admin)
  VALUES (
    NEW.id,
    user_name,
    CASE WHEN user_name = '최정인' THEN true ELSE false END
  );

  RETURN NEW;
END;
$$;

-- 트리거: auth.users INSERT 시 public.users 자동 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

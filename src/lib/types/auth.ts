// DB users 테이블 매핑 타입
export type User = {
  id: string;
  auth_id: string;
  name: string;
  is_admin: boolean;
  created_at: string;
};

// 인증된 사용자 정보 (앱 내부에서 사용, Supabase Auth + users 테이블 조합)
export type AuthUser = {
  id: string;
  name: string;
  is_admin: boolean;
};

// 클라이언트 표시용 프로필 정보 (헤더 등 UI 표시)
export type UserProfile = {
  name: string;
  is_admin: boolean;
};

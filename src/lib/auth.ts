import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';

// 같은 서버 렌더링 내에서 getUser() 중복 호출 방지
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

// 같은 서버 렌더링 내에서 profile 쿼리 중복 호출 방지
export const getProfile = cache(async () => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('id, name, is_admin')
    .eq('auth_id', user.id)
    .single();
  return data;
});

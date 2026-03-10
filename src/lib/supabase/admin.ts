import { createClient } from '@supabase/supabase-js';

import { clientEnv, getServerEnv } from '@/lib/env';
import type { Database } from '@/lib/types/database';

// Service Role 서버 전용 클라이언트 (RLS 우회, 관리자 작업용)
export function createAdminClient() {
  const serverEnv = getServerEnv();

  return createClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  );
}

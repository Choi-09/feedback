import { createBrowserClient } from '@supabase/ssr';

import { clientEnv } from '@/lib/env';

// Client Component용 Supabase 클라이언트
export function createClient() {
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

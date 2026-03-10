import { z } from 'zod';

// 클라이언트 환경변수 (NEXT_PUBLIC_ 접두사, 브라우저에서 접근 가능)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

// 서버 환경변수 (서버에서만 접근 가능)
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

// 클라이언트 환경변수 검증
const clientResult = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

if (!clientResult.success) {
  console.error(
    '❌ 클라이언트 환경변수 검증 실패:',
    clientResult.error.format(),
  );
  throw new Error('클라이언트 환경변수가 올바르지 않습니다.');
}

// 서버 환경변수 검증 (서버 환경에서만 실행)
function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('서버 환경변수는 서버에서만 접근할 수 있습니다.');
  }

  const result = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) {
    console.error('❌ 서버 환경변수 검증 실패:', result.error.format());
    throw new Error('서버 환경변수가 올바르지 않습니다.');
  }

  return result.data;
}

export const clientEnv = clientResult.data;
export { getServerEnv };

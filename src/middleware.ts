import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // 세션 갱신 (미들웨어에서 반드시 호출해야 세션 유지)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // /login: 로그인 상태면 /feedbacks로 리다이렉트
  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/feedbacks', request.url));
  }

  // /feedbacks/*, /api/feedbacks/*: 비로그인이면 /login으로 리다이렉트
  if (
    (path.startsWith('/feedbacks') || path.startsWith('/api/feedbacks')) &&
    !user
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/login', '/feedbacks/:path*', '/api/feedbacks/:path*'],
};

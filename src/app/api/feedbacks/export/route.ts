import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { createFeedbackWorkbook } from '@/lib/excel';
import { categorySchema } from '@/lib/schemas/feedback';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: '인증이 필요합니다' }, { status: 401 });
  }

  // 카테고리 파라미터 검증
  const categoryResult = categorySchema.safeParse(
    request.nextUrl.searchParams.get('category'),
  );
  const category = categoryResult.success ? categoryResult.data : 'llm';

  // 프로필 + 피드백 병렬 조회
  const [profileResult, feedbacksResult] = await Promise.all([
    supabase.from('users').select('is_admin').eq('auth_id', user.id).single(),
    supabase
      .from('feedbacks')
      .select('id, category, content, created_at, keyword_label, users(name)')
      .eq('category', category)
      .order('created_at', { ascending: false }),
  ]);

  if (!profileResult.data) {
    return NextResponse.json(
      { message: '사용자 정보를 찾을 수 없습니다' },
      { status: 401 },
    );
  }

  if (feedbacksResult.error || !feedbacksResult.data) {
    return NextResponse.json(
      { message: '피드백 조회에 실패했습니다' },
      { status: 500 },
    );
  }

  const isAdmin = profileResult.data.is_admin;

  // 데이터 매핑 (관리자만 작성자 포함)
  const rows = feedbacksResult.data.map((row, i) => ({
    index: i + 1,
    category: row.category.toUpperCase(),
    keyword: row.keyword_label ?? '피드백',
    content: row.content,
    ...(isAdmin && { author: row.users?.name ?? '알 수 없음' }),
    created_at: row.created_at.replace('T', ' ').slice(0, 16),
  }));

  // ExcelJS 워크북 생성
  const workbook = await createFeedbackWorkbook(rows, {
    includeAuthor: isAdmin,
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `피드백_${category.toUpperCase()}_${date}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}

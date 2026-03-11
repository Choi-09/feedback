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

  // 현재 사용자 프로필 조회 (관리자 여부)
  const { data: profile } = await supabase
    .from('users')
    .select('id, is_admin')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { message: '사용자 정보를 찾을 수 없습니다' },
      { status: 401 },
    );
  }

  // 카테고리 파라미터 검증
  const categoryResult = categorySchema.safeParse(
    request.nextUrl.searchParams.get('category'),
  );
  const category = categoryResult.success ? categoryResult.data : 'llm';

  // 피드백 조회 (관리자: users JOIN, 일반: 기본)
  const isAdmin = profile.is_admin;

  let rows;
  if (isAdmin) {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('id, category, content, created_at, users(name)')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return NextResponse.json(
        { message: '피드백 조회에 실패했습니다' },
        { status: 500 },
      );
    }

    rows = data.map((row, i) => ({
      index: i + 1,
      category: row.category.toUpperCase(),
      content: row.content,
      author: row.users?.name ?? '알 수 없음',
      created_at: new Date(row.created_at).toLocaleDateString('ko-KR'),
    }));
  } else {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('id, category, content, created_at')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return NextResponse.json(
        { message: '피드백 조회에 실패했습니다' },
        { status: 500 },
      );
    }

    rows = data.map((row, i) => ({
      index: i + 1,
      category: row.category.toUpperCase(),
      content: row.content,
      created_at: new Date(row.created_at).toLocaleDateString('ko-KR'),
    }));
  }

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

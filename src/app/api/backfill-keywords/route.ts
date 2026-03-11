// 임시 백필 API: 기존 피드백에 키워드 분류 적용 (1회 실행 후 삭제)
import { NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/admin';
import { classifyKeyword } from '@/lib/classify-keyword';

export async function POST() {
  const supabase = createAdminClient();
  const { data: feedbacks, error } = await supabase
    .from('feedbacks')
    .select('id, content');

  if (error || !feedbacks) {
    return NextResponse.json(
      { message: '피드백 조회 실패', detail: error?.message },
      { status: 500 },
    );
  }

  if (feedbacks.length === 0) {
    return NextResponse.json({ message: '백필할 데이터가 없습니다' });
  }

  // 순차 처리 (Gemini API 무료 티어 rate limit 고려)
  let successCount = 0;
  const errors: { id: string; error: string }[] = [];

  for (const feedback of feedbacks) {
    try {
      const keyword = await classifyKeyword(feedback.content);
      const { error: updateError } = await supabase
        .from('feedbacks')
        .update({
          keyword_emoji: keyword.emoji,
          keyword_label: keyword.label,
        })
        .eq('id', feedback.id);

      if (updateError) {
        errors.push({ id: feedback.id, error: updateError.message });
      } else {
        successCount++;
      }
    } catch (e) {
      errors.push({
        id: feedback.id,
        error: e instanceof Error ? e.message : 'unknown',
      });
    }
  }

  return NextResponse.json({
    message: `백필 완료: ${successCount}/${feedbacks.length}건 성공`,
    successCount,
    totalCount: feedbacks.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

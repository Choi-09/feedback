'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import {
  feedbackCreateSchema,
  feedbackUpdateSchema,
} from '@/lib/schemas/feedback';
import type {
  FeedbackCreateData,
  FeedbackUpdateData,
} from '@/lib/schemas/feedback';
import type {
  FeedbackListItem,
  AdminFeedbackListItem,
  FeedbackDetail,
} from '@/lib/types/feedback';
import type { FeedbackCategory, ActionResult } from '@/lib/types/common';

// 현재 로그인 사용자의 users 테이블 정보 조회
async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('id, is_admin')
    .eq('auth_id', user.id)
    .single();

  return profile;
}

// 카테고리별 피드백 목록 조회
// - 일반 사용자: FeedbackListItem[] (is_mine 플래그, author_id 미포함)
// - 관리자: AdminFeedbackListItem[] (author_name 포함)
export async function getFeedbacks(
  category: FeedbackCategory,
  searchQuery?: string,
): Promise<FeedbackListItem[] | AdminFeedbackListItem[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const supabase = await createClient();

  // 관리자: users JOIN으로 author_name 포함 (단일 쿼리)
  if (currentUser.is_admin) {
    let adminQuery = supabase
      .from('feedbacks')
      .select(
        'id, category, content, author_id, created_at, updated_at, users(name)',
      )
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (searchQuery && searchQuery.trim()) {
      adminQuery = adminQuery.ilike('content', `%${searchQuery.trim()}%`);
    }

    const { data, error } = await adminQuery;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      category: row.category as FeedbackCategory,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_mine: row.author_id === currentUser.id,
      author_name: row.users?.name ?? '알 수 없음',
    }));
  }

  // 일반 사용자: author_id로 is_mine만 계산, 클라이언트에 author_id 미반환
  let query = supabase
    .from('feedbacks')
    .select('id, category, content, author_id, created_at, updated_at')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (searchQuery && searchQuery.trim()) {
    query = query.ilike('content', `%${searchQuery.trim()}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    category: row.category as FeedbackCategory,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_mine: row.author_id === currentUser.id,
  }));
}

// 단건 조회 (수정 페이지용, 본인 작성건만)
export async function getFeedbackById(
  id: string,
): Promise<FeedbackDetail | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feedbacks')
    .select('id, category, content, author_id, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  // 서버 레이어 이중 검증: 본인 작성건만 반환
  if (data.author_id !== currentUser.id) return null;

  return {
    id: data.id,
    category: data.category as FeedbackCategory,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

// 피드백 생성
export async function createFeedback(
  formData: FeedbackCreateData,
): Promise<ActionResult> {
  const parsed = feedbackCreateSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: '입력값이 올바르지 않습니다',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: '로그인이 필요합니다' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('feedbacks').insert({
    category: parsed.data.category,
    content: parsed.data.content,
    author_id: currentUser.id,
  });

  if (error) {
    return { success: false, message: '피드백 작성에 실패했습니다' };
  }

  revalidatePath('/feedbacks');
  return { success: true, message: '피드백이 작성되었습니다' };
}

// 피드백 수정 (본인 작성건만)
export async function updateFeedback(
  id: string,
  formData: FeedbackUpdateData,
): Promise<ActionResult> {
  const parsed = feedbackUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: '입력값이 올바르지 않습니다',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: '로그인이 필요합니다' };
  }

  const supabase = await createClient();

  // 서버 레이어 이중 검증: 본인 작성건 확인
  const { data: existing } = await supabase
    .from('feedbacks')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!existing || existing.author_id !== currentUser.id) {
    return { success: false, message: '수정 권한이 없습니다' };
  }

  const { error } = await supabase
    .from('feedbacks')
    .update({ content: parsed.data.content })
    .eq('id', id);

  if (error) {
    return { success: false, message: '피드백 수정에 실패했습니다' };
  }

  revalidatePath('/feedbacks');
  return { success: true, message: '피드백이 수정되었습니다' };
}

// 피드백 삭제 (본인 작성건만)
export async function deleteFeedback(id: string): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: '로그인이 필요합니다' };
  }

  const supabase = await createClient();

  // 서버 레이어 이중 검증: 본인 작성건 확인
  const { data: existing } = await supabase
    .from('feedbacks')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!existing || existing.author_id !== currentUser.id) {
    return { success: false, message: '삭제 권한이 없습니다' };
  }

  const { error } = await supabase.from('feedbacks').delete().eq('id', id);

  if (error) {
    return { success: false, message: '피드백 삭제에 실패했습니다' };
  }

  revalidatePath('/feedbacks');
  return { success: true, message: '피드백이 삭제되었습니다' };
}

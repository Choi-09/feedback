'use server';

import { redirect } from 'next/navigation';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type {
  LoginFormData,
  PasswordConfirmFormData,
} from '@/lib/schemas/auth';
import type { ActionResult } from '@/lib/types/common';

// Supabase Auth는 email 필수 — 이름을 내부 더미 이메일로 변환 (외부 비노출)
// 한글 이름은 Supabase 이메일 검증을 통과하지 못하므로 hex 인코딩 사용
function toEmail(name: string): string {
  const encoded = Buffer.from(name, 'utf-8').toString('hex');
  return `u-${encoded}@feedback.internal`;
}

// 이름으로 사용자 존재 여부 확인 (service_role)
export async function checkUserExists(name: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('users')
    .select('id')
    .eq('name', name)
    .maybeSingle();

  return !!data;
}

// 로그인 (이름 + 비밀번호)
export async function signIn(formData: LoginFormData): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: toEmail(formData.name),
    password: formData.password,
  });

  if (error) {
    return {
      success: false,
      message: '이름 또는 비밀번호가 올바르지 않습니다',
    };
  }

  redirect('/feedbacks');
}

// 자동가입 (이름 + 비밀번호, metadata에 name 포함)
export async function signUp(
  formData: PasswordConfirmFormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: toEmail(formData.name),
    password: formData.password,
    options: { data: { name: formData.name } },
  });

  if (error) {
    return {
      success: false,
      message: '가입에 실패했습니다. 다시 시도해주세요',
    };
  }

  redirect('/feedbacks');
}

// 로그아웃
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

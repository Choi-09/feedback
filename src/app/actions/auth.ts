'use server';

import { redirect } from 'next/navigation';

import { toEmail } from '@/lib/auth-utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import {
  passwordChangeSchema,
  type LoginFormData,
  type PasswordConfirmFormData,
  type PasswordChangeFormData,
} from '@/lib/schemas/auth';
import type { ActionResult } from '@/lib/types/common';

// 로그인 통합: 존재 확인 + signIn을 서버 내에서 원자적으로 처리
export async function login(
  formData: LoginFormData,
): Promise<ActionResult<{ isNewUser: boolean }>> {
  const admin = createAdminClient();
  const { data: existingUser } = await admin
    .from('users')
    .select('id')
    .eq('name', formData.name)
    .maybeSingle();

  // 신규 사용자 → 클라이언트에서 비밀번호 확인 UI 표시
  if (!existingUser) {
    return { success: true, message: '', data: { isNewUser: true } };
  }

  // 기존 사용자 → 즉시 로그인 시도
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

// 비밀번호 변경
export async function changePassword(
  formData: PasswordChangeFormData,
): Promise<ActionResult> {
  const parsed = passwordChangeSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { success: false, message: '로그인 상태를 확인해주세요' };
  }

  // 현재 비밀번호 검증
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });
  if (signInError) {
    return { success: false, message: '현재 비밀번호가 올바르지 않습니다' };
  }

  // 새 비밀번호로 변경
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });
  if (updateError) {
    return { success: false, message: '비밀번호 변경에 실패했습니다' };
  }

  return { success: true, message: '비밀번호가 변경되었습니다' };
}

// 로그아웃
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

// 22명 부서원 Supabase Auth 사전 등록 스크립트
// 실행: npx tsx --env-file=.env.local scripts/seed-users.ts

import { toEmail } from '@/lib/auth-utils';
import { createAdminClient } from '@/lib/supabase/admin';

// 부서원 22명 (Excel users 시트 기준)
const USERS = [
  '황지중',
  '신재구',
  '최문일',
  '손경훈',
  '성진호',
  '윤병일',
  '김상인',
  '안정현',
  '박상우',
  '김태종',
  '김정찬',
  '김규현',
  '천경원',
  '김재균',
  '김기덕',
  '이영근',
  '정현우',
  '김혜진',
  '임대섭',
  '안재완',
  '최한수',
  '최정인',
] as const;

const DEFAULT_PASSWORD = '000000';

async function main() {
  const admin = createAdminClient();

  // 기존 사용자 목록 조회 (idempotent 처리용)
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const existingEmails = new Set(
    existingUsers?.users.map((u) => u.email) ?? [],
  );

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const name of USERS) {
    const email = toEmail(name);

    if (existingEmails.has(email)) {
      console.log(`SKIP: ${name} (이미 존재)`);
      skipped++;
      continue;
    }

    // user_metadata.name → 트리거가 public.users 자동 생성 + 최정인은 is_admin=true
    // email_confirm: true → admin API 생성 시 이메일 확인 완료 처리 필수
    const { error } = await admin.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      console.error(`FAIL: ${name} — ${error.message}`);
      failed++;
    } else {
      console.log(`OK: ${name}`);
      created++;
    }
  }

  console.log(
    `\n완료: 생성 ${created}, 스킵 ${skipped}, 실패 ${failed} (총 ${USERS.length}명)`,
  );
}

main().catch(console.error);

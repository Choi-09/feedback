// 기존 Excel 피드백 데이터(41건) DB 마이그레이션 스크립트
// 실행: npx tsx --env-file=.env.local scripts/seed-feedbacks.ts
// 의존: Task 018 완료 (22명 사용자 시딩 필수)

import ExcelJS from 'exceljs';

import { createAdminClient } from '@/lib/supabase/admin';

const EXCEL_PATH = 'C:/Users/gc/Downloads/피드백.xlsx';
const SHEETS = ['LLM', 'ERP'] as const;

// ExcelJS의 Date 객체 또는 문자열을 ISO 형식으로 변환
function toISOString(value: ExcelJS.CellValue): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return new Date(value).toISOString();
  return new Date().toISOString();
}

interface FeedbackRow {
  category: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

async function main() {
  const admin = createAdminClient();

  // 1. public.users 전체 조회 → name→id 매핑
  const { data: users, error: usersError } = await admin
    .from('users')
    .select('id, name');

  if (usersError || !users) {
    console.error('사용자 조회 실패:', usersError?.message);
    return;
  }

  const nameToId = new Map(users.map((u) => [u.name, u.id]));
  console.log(`사용자 ${nameToId.size}명 로드 완료`);

  // 2. Excel 파싱
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);

  const rows: FeedbackRow[] = [];

  for (const sheetName of SHEETS) {
    const ws = wb.getWorksheet(sheetName);
    if (!ws) {
      console.warn(`${sheetName} 시트를 찾을 수 없습니다`);
      continue;
    }

    ws.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return; // 헤더 스킵

      const category = String(row.getCell(1).value ?? '').toLowerCase();
      const authorName = String(row.getCell(2).value ?? '').trim();
      const content = String(row.getCell(3).value ?? '').trim();
      const createdAt = toISOString(row.getCell(4).value);
      const updatedAt = toISOString(row.getCell(5).value);

      if (!content || !authorName) return;

      rows.push({ category, authorName, content, createdAt, updatedAt });
    });
  }

  console.log(`Excel에서 ${rows.length}건 파싱 완료`);

  // 3. 기존 피드백 조회 (중복 방지용)
  const { data: existingFeedbacks } = await admin
    .from('feedbacks')
    .select('author_id, category, content');

  const existingSet = new Set(
    (existingFeedbacks ?? []).map(
      (f) => `${f.author_id}|${f.category}|${f.content}`,
    ),
  );

  // 4. 피드백 삽입
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const userId = nameToId.get(row.authorName);
    if (!userId) {
      console.warn(`SKIP: 사용자 "${row.authorName}" 매핑 실패`);
      failed++;
      continue;
    }

    // 중복 체크 (content + author_id + category)
    const key = `${userId}|${row.category}|${row.content}`;
    if (existingSet.has(key)) {
      console.log(`SKIP: 중복 — ${row.authorName} / ${row.category}`);
      skipped++;
      continue;
    }

    const { error } = await admin.from('feedbacks').insert({
      author_id: userId,
      category: row.category,
      content: row.content,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    });

    if (error) {
      console.error(
        `FAIL: ${row.authorName} / ${row.category} — ${error.message}`,
      );
      failed++;
    } else {
      console.log(`OK: ${row.authorName} / ${row.category}`);
      created++;
      existingSet.add(key);
    }
  }

  console.log(
    `\n완료: 생성 ${created}, 스킵 ${skipped}, 실패 ${failed} (총 ${rows.length}건)`,
  );
}

main().catch(console.error);

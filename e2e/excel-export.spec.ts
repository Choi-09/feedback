import { test, expect, type Page } from '@playwright/test';
import ExcelJS from 'exceljs';

const ADMIN_NAME = '최정인';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || '153666';
// 이름 최대 20자 제한 → 짧은 접두사 + 타임스탬프 끝 8자리
const TEST_USER = `xl${String(Date.now()).slice(-8)}`;
const TEST_PASSWORD = 'test1234';

// 로그인 + 자동가입 처리 헬퍼 (cold start 대비 넉넉한 타임아웃)
async function loginAndWait(page: Page, name: string, password: string) {
  await page.goto('/login');
  await page.fill('#name', name);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');

  // 신규 사용자(비밀번호 확인 필드) 또는 기존 사용자(바로 리다이렉트) 분기
  const isNewUser = await Promise.race([
    page
      .locator('#password-confirm')
      .waitFor({ state: 'visible', timeout: 20000 })
      .then(() => true),
    page
      .waitForURL('**/feedbacks**', { timeout: 20000 })
      .then(() => false),
  ]);

  if (isNewUser) {
    await page.fill('#password-confirm', password);
    await page.click('button[type="submit"]');
  }

  await page.waitForURL('**/feedbacks**', { timeout: 15000 });
}

// 엑셀 응답 파싱 → 헤더 배열 반환
async function getExcelHeaders(buffer: Buffer): Promise<string[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  const values = sheet.getRow(1).values as (string | undefined)[];
  return values.filter((v): v is string => typeof v === 'string');
}

test.describe.serial('엑셀 다운로드 E2E 테스트', () => {
  test('일반 사용자: 엑셀에 작성자 컬럼 미포함', async ({ page, context }) => {
    await loginAndWait(page, TEST_USER, TEST_PASSWORD);

    // 인증된 컨텍스트로 엑셀 API 호출
    const response = await context.request.get(
      '/api/feedbacks/export?category=llm',
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain(
      'spreadsheetml.sheet',
    );

    // 엑셀 헤더 검증
    const buffer = await response.body();
    const headers = await getExcelHeaders(buffer);

    expect(headers).toContain('번호');
    expect(headers).toContain('카테고리');
    expect(headers).toContain('키워드');
    expect(headers).toContain('내용');
    expect(headers).toContain('작성일');
    expect(headers).not.toContain('작성자');
  });

  test('관리자: 엑셀에 작성자 컬럼 포함', async ({ page, context }) => {
    await loginAndWait(page, ADMIN_NAME, ADMIN_PASSWORD);

    const response = await context.request.get(
      '/api/feedbacks/export?category=llm',
    );
    expect(response.status()).toBe(200);

    const buffer = await response.body();
    const headers = await getExcelHeaders(buffer);

    expect(headers).toContain('번호');
    expect(headers).toContain('카테고리');
    expect(headers).toContain('키워드');
    expect(headers).toContain('내용');
    expect(headers).toContain('작성자');
    expect(headers).toContain('작성일');
  });

  test('ERP 카테고리 엑셀 다운로드 정상 응답', async ({ page, context }) => {
    await loginAndWait(page, TEST_USER, TEST_PASSWORD);

    const response = await context.request.get(
      '/api/feedbacks/export?category=erp',
    );
    expect(response.status()).toBe(200);

    // Content-Disposition에 ERP 파일명 포함
    const disposition = response.headers()['content-disposition'] ?? '';
    expect(disposition).toContain('ERP');
  });

  test('비인증 요청: 리다이렉트 또는 401', async ({ request }) => {
    // 쿠키 없는 새 request 컨텍스트 → 미들웨어가 리다이렉트
    const response = await request.get('/api/feedbacks/export?category=llm', {
      maxRedirects: 0,
    });

    // 미들웨어 리다이렉트(302) 또는 401
    expect([302, 307, 401]).toContain(response.status());
  });
});

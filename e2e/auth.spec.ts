import { test, expect } from '@playwright/test';

// 테스트용 고유 사용자 이름 (타임스탬프 기반, ASCII only)
const ts = Date.now();
const TEST_USER = `e2euser${ts}`;
const TEST_PASSWORD = 'test1234';

// 로그인 헬퍼
async function login(
  page: import('@playwright/test').Page,
  name: string,
  password: string,
) {
  await page.goto('/login');
  await page.fill('#name', name);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
}

test.describe.serial('Task 009/010: 인증 플로우 E2E 테스트', () => {
  test('T010-1: 신규 사용자 자동 가입 + 로그인 → /feedbacks 이동', async ({
    page,
  }) => {
    await login(page, TEST_USER, TEST_PASSWORD);

    // 신규 사용자 → 비밀번호 확인 필드 표시
    await expect(page.getByText('처음 사용하시는 분입니다')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('#password-confirm')).toBeVisible();

    // 비밀번호 확인 입력 후 가입
    await page.fill('#password-confirm', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // /feedbacks로 리다이렉트 확인
    await page.waitForURL('**/feedbacks**', { timeout: 15000 });
    expect(page.url()).toContain('/feedbacks');
  });

  test('T010-2: 기존 사용자 로그인 성공 → /feedbacks 이동', async ({
    page,
  }) => {
    await login(page, TEST_USER, TEST_PASSWORD);

    // 기존 사용자 → 바로 로그인 → /feedbacks 이동
    await page.waitForURL('**/feedbacks**', { timeout: 15000 });
    expect(page.url()).toContain('/feedbacks');
  });

  test('T010-3: 헤더에 사용자 이름 표시 확인', async ({ page }) => {
    await login(page, TEST_USER, TEST_PASSWORD);
    await page.waitForURL('**/feedbacks**', { timeout: 15000 });

    // 헤더에 사용자 이름 표시 확인
    await expect(page.getByText(TEST_USER)).toBeVisible({ timeout: 5000 });
  });

  test('T010-4: 로그아웃 → /login 이동 확인', async ({ page }) => {
    await login(page, TEST_USER, TEST_PASSWORD);
    await page.waitForURL('**/feedbacks**', { timeout: 15000 });

    // 로그아웃 버튼 클릭
    await page.getByRole('button', { name: /로그아웃/ }).click();

    // /login으로 리다이렉트 확인
    await page.waitForURL('**/login**', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('T010-5: 잘못된 비밀번호 → 에러 메시지 표시', async ({ page }) => {
    await login(page, TEST_USER, 'wrongpassword');

    // 에러 메시지 확인
    await expect(page.getByText('올바르지 않습니다')).toBeVisible({
      timeout: 10000,
    });
  });

  test('T010-6: 유효성 검증 - 빈 필드 에러 메시지', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');

    await expect(page.getByText('이름을 입력해주세요')).toBeVisible();
  });

  test('T010-7: 유효성 검증 - 비밀번호 확인 불일치', async ({ page }) => {
    const newUser = `mm${ts}`;
    await login(page, newUser, TEST_PASSWORD);

    // 비밀번호 확인 필드 표시 대기
    await expect(page.locator('#password-confirm')).toBeVisible({
      timeout: 10000,
    });

    // 다른 비밀번호 입력
    await page.fill('#password-confirm', 'differentpassword');
    await page.click('button[type="submit"]');

    // 불일치 에러 메시지 확인
    await expect(page.getByText('비밀번호가 일치하지 않습니다')).toBeVisible();
  });

  test('T009-9: 로그인 상태에서 /login → /feedbacks 리다이렉트', async ({
    page,
  }) => {
    await login(page, TEST_USER, TEST_PASSWORD);
    await page.waitForURL('**/feedbacks**', { timeout: 15000 });

    // 로그인 상태에서 /login 접근 시도
    await page.goto('/login');

    // /feedbacks로 리다이렉트 확인
    await page.waitForURL('**/feedbacks**', { timeout: 10000 });
    expect(page.url()).toContain('/feedbacks');
  });
});

import { getProfile } from '@/lib/auth';
import { UserMenu } from '@/components/layout/user-menu';

export async function AppHeader() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-base font-semibold">사용자 피드백 현황</h1>
          <p className="text-xs text-muted-foreground">
            LLM 솔루션 및 ERP 시스템 개선 요청 사항 정리
          </p>
        </div>

        <UserMenu userName={profile.name} />
      </div>
    </header>
  );
}

import { createClient } from '@/lib/supabase/server';
import { UserMenu } from '@/components/layout/user-menu';

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('name, is_admin')
    .eq('auth_id', user.id)
    .single();

  const userName = profile?.name ?? '사용자';

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-base font-semibold">사용자 피드백 현황</h1>
          <p className="text-xs text-muted-foreground">
            LLM 솔루션 및 ERP 시스템 개선 요청 사항 정리
          </p>
        </div>

        <UserMenu userName={userName} />
      </div>
    </header>
  );
}

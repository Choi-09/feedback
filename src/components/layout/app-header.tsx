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
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:px-6">
        <span className="text-base font-semibold">피드백</span>

        <UserMenu userName={userName} />
      </div>
    </header>
  );
}

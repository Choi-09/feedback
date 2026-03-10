import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// 더미 사용자 정보 (Task 010에서 실제 Supabase 세션으로 교체 예정)
const DUMMY_USER = { name: '홍길동', is_admin: false };

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="text-base font-semibold">피드백</span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {DUMMY_USER.name}
          </span>
          <Separator orientation="vertical" className="!h-4" />
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

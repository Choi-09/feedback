'use client';

import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';

import { signOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      <span className="hidden sm:inline">로그아웃</span>
    </Button>
  );
}

'use client';

import { useState } from 'react';
import { KeyRound, LogOut, Loader2 } from 'lucide-react';

import { signOut } from '@/app/actions/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PasswordChangeDialog } from '@/components/layout/password-change-dialog';

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
          render={<button />}
        >
          {userName}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setPasswordDialogOpen(true)}
          >
            <KeyRound className="size-4" />
            비밀번호 변경
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PasswordChangeDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </>
  );
}

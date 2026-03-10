'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  loginSchema,
  passwordConfirmSchema,
  type LoginFormData,
  type PasswordConfirmFormData,
} from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 폼 (기존 사용자)
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', password: '' },
  });

  // 비밀번호 확인 폼 (신규 사용자)
  const confirmForm = useForm<PasswordConfirmFormData>({
    resolver: zodResolver(passwordConfirmSchema),
    defaultValues: { name: '', password: '', passwordConfirm: '' },
  });

  // 더미 로그인 핸들러 (Task 010에서 실제 Server Action으로 교체 예정)
  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    // 더미: '신규사용자' 이름 입력 시 신규 사용자 플로우 시뮬레이션
    await new Promise((r) => setTimeout(r, 500));

    if (data.name === '신규사용자') {
      setIsNewUser(true);
      confirmForm.setValue('name', data.name);
      confirmForm.setValue('password', data.password);
      setIsLoading(false);
      return;
    }

    // 더미: 비밀번호가 '1234'가 아니면 에러
    if (data.password !== '1234') {
      setError('비밀번호가 올바르지 않습니다');
      setIsLoading(false);
      return;
    }

    alert(`로그인 성공: ${data.name}`);
    setIsLoading(false);
  };

  // 더미 회원가입 핸들러
  const handleSignUp = async (data: PasswordConfirmFormData) => {
    setError(null);
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    alert(`자동가입 성공: ${data.name}`);
    setIsLoading(false);
  };

  // 신규 사용자 → 기존 사용자 폼으로 돌아가기
  const handleBack = () => {
    setIsNewUser(false);
    setError(null);
  };

  if (isNewUser) {
    return (
      <form
        onSubmit={confirmForm.handleSubmit(handleSignUp)}
        className="space-y-4"
      >
        <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          처음 사용하시는 분입니다. 비밀번호를 다시 입력해주세요.
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-name">이름</Label>
          <Input id="confirm-name" disabled {...confirmForm.register('name')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">비밀번호</Label>
          <Input
            id="confirm-password"
            type="password"
            disabled
            {...confirmForm.register('password')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-confirm">비밀번호 확인</Label>
          <Input
            id="password-confirm"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            autoFocus
            {...confirmForm.register('passwordConfirm')}
          />
          {confirmForm.formState.errors.passwordConfirm && (
            <p className="text-sm text-destructive">
              {confirmForm.formState.errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleBack}
            disabled={isLoading}
          >
            뒤로
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '가입하기'
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          placeholder="이름을 입력하세요"
          autoFocus
          {...loginForm.register('name')}
        />
        {loginForm.formState.errors.name && (
          <p className="text-sm text-destructive">
            {loginForm.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...loginForm.register('password')}
        />
        {loginForm.formState.errors.password && (
          <p className="text-sm text-destructive">
            {loginForm.formState.errors.password.message}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          '로그인'
        )}
      </Button>
    </form>
  );
}

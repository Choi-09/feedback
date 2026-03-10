'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { Loader2 } from 'lucide-react';

import { checkUserExists, signIn, signUp } from '@/app/actions/auth';
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

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', password: '' },
  });

  const confirmForm = useForm<PasswordConfirmFormData>({
    resolver: zodResolver(passwordConfirmSchema),
    defaultValues: { name: '', password: '', passwordConfirm: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const exists = await checkUserExists(data.name);

      if (exists) {
        const result = await signIn(data);
        // signIn 성공 시 redirect → 이 줄에 도달하지 않음
        if (result && !result.success) {
          setError(result.message);
        }
      } else {
        setIsNewUser(true);
        confirmForm.setValue('name', data.name);
        confirmForm.setValue('password', data.password);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError('오류가 발생했습니다. 다시 시도해주세요');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: PasswordConfirmFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signUp(data);
      // signUp 성공 시 redirect → 이 줄에 도달하지 않음
      if (result && !result.success) {
        setError(result.message);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError('오류가 발생했습니다. 다시 시도해주세요');
    } finally {
      setIsLoading(false);
    }
  };

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

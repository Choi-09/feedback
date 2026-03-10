import { z } from 'zod';

// 로그인 폼 스키마 (기존 사용자)
export const loginSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 최대 20자까지 입력 가능합니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

// 비밀번호 확인 스키마 (신규 사용자 자동가입 시)
export const passwordConfirmSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요').max(20),
    password: z.string().min(4, '비밀번호는 최소 4자 이상이어야 합니다'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

// 스키마에서 추출한 폼 데이터 타입
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordConfirmFormData = z.infer<typeof passwordConfirmSchema>;

import { z } from 'zod';

// 카테고리 검증 스키마 (searchParams 검증 등에서도 재사용)
export const categorySchema = z.enum(['llm', 'erp']);

// 피드백 작성 폼 스키마
export const feedbackCreateSchema = z.object({
  category: categorySchema,
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(2000, '내용은 최대 2000자까지 입력 가능합니다'),
});

// 피드백 수정 폼 스키마 (카테고리 변경 불가, content만 검증)
export const feedbackUpdateSchema = z.object({
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(2000, '내용은 최대 2000자까지 입력 가능합니다'),
});

// 스키마에서 추출한 폼 데이터 타입
export type FeedbackCreateData = z.infer<typeof feedbackCreateSchema>;
export type FeedbackUpdateData = z.infer<typeof feedbackUpdateSchema>;

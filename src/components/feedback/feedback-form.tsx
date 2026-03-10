'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  feedbackCreateSchema,
  type FeedbackCreateData,
} from '@/lib/schemas/feedback';
import type { FeedbackCategory } from '@/lib/types/common';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

type FeedbackFormProps = {
  category: FeedbackCategory;
};

export function FeedbackForm({ category }: FeedbackFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackCreateData>({
    resolver: zodResolver(feedbackCreateSchema),
    defaultValues: { category, content: '' },
  });

  // 더미 핸들러 (Task 013에서 실제 Server Action으로 교체 예정)
  const onSubmit = async (data: FeedbackCreateData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    alert(
      `피드백 작성 완료: ${data.category} - ${data.content.slice(0, 30)}...`,
    );
    setIsLoading(false);
    router.push(`/feedbacks?category=${category}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>카테고리</Label>
        <div>
          <Badge variant="secondary">{category.toUpperCase()}</Badge>
        </div>
        <input type="hidden" {...register('category')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="피드백 내용을 입력하세요"
          className="min-h-32"
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/feedbacks?category=${category}`)}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              저장 중...
            </>
          ) : (
            '저장'
          )}
        </Button>
      </div>
    </form>
  );
}

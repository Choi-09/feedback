'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { updateFeedback, deleteFeedback } from '@/app/actions/feedback';
import {
  feedbackUpdateSchema,
  type FeedbackUpdateData,
} from '@/lib/schemas/feedback';
import type { FeedbackDetail } from '@/lib/types/feedback';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type FeedbackEditFormProps = {
  feedback: FeedbackDetail;
};

export function FeedbackEditForm({ feedback }: FeedbackEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackUpdateData>({
    resolver: zodResolver(feedbackUpdateSchema),
    defaultValues: { content: feedback.content },
  });

  const onSubmit = async (data: FeedbackUpdateData) => {
    setIsLoading(true);
    const result = await updateFeedback(feedback.id, data);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.push('/feedbacks');
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteFeedback(feedback.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message);
      router.push('/feedbacks');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>카테고리</Label>
        <div>
          <Badge variant="secondary">{feedback.category.toUpperCase()}</Badge>
        </div>
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
          onClick={() => router.push('/feedbacks')}
          disabled={isLoading || isDeleting}
        >
          취소
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  '삭제'
                )}
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>피드백을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                삭제된 피드백은 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDelete}>
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button type="submit" disabled={isLoading || isDeleting}>
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

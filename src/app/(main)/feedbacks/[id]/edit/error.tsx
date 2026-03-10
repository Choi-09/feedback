'use client';

import { useRouter } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button-variants';

export default function EditFeedbackError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-4 py-20">
      <h2 className="text-xl font-semibold">오류가 발생했습니다</h2>
      <p className="text-muted-foreground">
        피드백을 불러오는 중 문제가 발생했습니다
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => router.push('/feedbacks')}
          className={buttonVariants({ variant: 'outline' })}
        >
          목록으로 돌아가기
        </button>
        <button onClick={reset} className={buttonVariants()}>
          다시 시도
        </button>
      </div>
    </div>
  );
}

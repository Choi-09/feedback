'use client';

import { buttonVariants } from '@/components/ui/button-variants';

export default function FeedbacksError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-4 py-20">
      <h2 className="text-xl font-semibold">오류가 발생했습니다</h2>
      <p className="text-muted-foreground">
        피드백 목록을 불러오는 중 문제가 발생했습니다
      </p>
      <button
        onClick={reset}
        className={buttonVariants({ variant: 'outline' })}
      >
        다시 시도
      </button>
    </div>
  );
}

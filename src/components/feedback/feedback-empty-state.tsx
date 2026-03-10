import { MessageSquarePlus } from 'lucide-react';

export function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MessageSquarePlus className="size-10 text-muted-foreground/50" />
      <p className="mt-3 text-sm font-medium text-muted-foreground">
        아직 등록된 피드백이 없습니다
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        첫 번째 피드백을 작성해보세요
      </p>
    </div>
  );
}

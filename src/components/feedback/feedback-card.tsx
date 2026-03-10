import Link from 'next/link';
import { Pencil } from 'lucide-react';

import type {
  FeedbackListItem,
  AdminFeedbackListItem,
} from '@/lib/types/feedback';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button-variants';

type FeedbackCardProps = {
  feedback: FeedbackListItem | AdminFeedbackListItem;
  isAdmin?: boolean;
};

function isAdminItem(
  feedback: FeedbackListItem | AdminFeedbackListItem,
): feedback is AdminFeedbackListItem {
  return 'author_name' in feedback;
}

export function FeedbackCard({ feedback, isAdmin }: FeedbackCardProps) {
  const date = new Date(feedback.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
          {feedback.content}
        </p>
        {feedback.is_mine && (
          <Link
            href={`/feedbacks/${feedback.id}/edit`}
            className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">수정</span>
          </Link>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{date}</span>
        {isAdmin && isAdminItem(feedback) && (
          <Badge variant="outline" className="text-xs">
            {feedback.author_name}
          </Badge>
        )}
      </div>
    </div>
  );
}

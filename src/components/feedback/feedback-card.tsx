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
  index: number;
};

function isAdminItem(
  feedback: FeedbackListItem | AdminFeedbackListItem,
): feedback is AdminFeedbackListItem {
  return 'author_name' in feedback;
}

export function FeedbackCard({ feedback, isAdmin, index }: FeedbackCardProps) {
  const keyword = {
    emoji: feedback.keyword_emoji ?? '💬',
    label: feedback.keyword_label ?? '피드백',
  };
  // DB에 KST 기준으로 저장되어 있으므로 문자열에서 직접 추출
  const date = feedback.created_at.replace('T', ' ').slice(0, 16);

  return (
    <div className="flex h-full flex-col justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
      {/* 상단: 번호 + 수정 버튼 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">
            # {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1">
            {isAdmin && isAdminItem(feedback) && (
              <Badge variant="outline" className="text-[10px]">
                {feedback.author_name}
              </Badge>
            )}
            {feedback.is_mine && (
              <Link
                href={`/feedbacks/${feedback.id}/edit`}
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'icon-sm',
                })}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">수정</span>
              </Link>
            )}
          </div>
        </div>

        {/* 본문 */}
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
          {feedback.content}
        </p>
      </div>

      {/* 하단: 키워드 뱃지 + 날짜 */}
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
          {keyword.emoji} {keyword.label}
        </span>
        <span className="text-[10px] text-muted-foreground">{date}</span>
      </div>
    </div>
  );
}

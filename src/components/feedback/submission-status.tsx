import type { FeedbackCategory } from '@/lib/types/common';
import { NonSubmittersBadge } from '@/components/feedback/non-submitters-badge';

interface SubmissionStatusProps {
  category: FeedbackCategory;
  stats: {
    myStats: { llm: number; erp: number };
    overallStats: { llm: number; erp: number };
    feedbackCounts: { llm: number; erp: number; total: number };
    totalUsers: number;
  };
  nonSubmitters?: string[];
  isAdmin?: boolean;
}

export function SubmissionStatus({
  category,
  stats,
  nonSubmitters,
  isAdmin,
}: SubmissionStatusProps) {
  const currentTabSubmitted =
    category === 'llm' ? stats.overallStats.llm : stats.overallStats.erp;

  return (
    <div className="space-y-2">
      {/* 피드백 건수 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
          <span className="size-1.5 rounded-full bg-blue-500" />
          LLM 피드백
          <strong className="text-foreground">
            {stats.feedbackCounts.llm}
          </strong>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
          <span className="size-1.5 rounded-full bg-orange-500" />
          ERP 피드백
          <strong className="text-foreground">
            {stats.feedbackCounts.erp}
          </strong>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
          <span className="size-1.5 rounded-full bg-muted-foreground" />총
          피드백
          <strong className="text-foreground">
            {stats.feedbackCounts.total}
          </strong>
        </span>
        {isAdmin && nonSubmitters && (
          <NonSubmittersBadge names={nonSubmitters} category={category} />
        )}
      </div>

      {/* 제출 현황 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
        <span>
          {category.toUpperCase()} 제출:{' '}
          <strong className="text-foreground">
            {currentTabSubmitted}/{stats.totalUsers}
          </strong>
          명
        </span>
        <span className="text-border">|</span>
        <span>
          내 작성: LLM{' '}
          <strong className="text-foreground">{stats.myStats.llm}</strong>건 ·
          ERP <strong className="text-foreground">{stats.myStats.erp}</strong>건
        </span>
      </div>
    </div>
  );
}

import { getSubmissionStats } from '@/app/actions/feedback';
import type { FeedbackCategory } from '@/lib/types/common';

interface SubmissionStatusProps {
  category: FeedbackCategory;
}

export async function SubmissionStatus({ category }: SubmissionStatusProps) {
  const stats = await getSubmissionStats();
  const currentTabSubmitted =
    category === 'llm' ? stats.overallStats.llm : stats.overallStats.erp;

  return (
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
        <strong className="text-foreground">{stats.myStats.llm}</strong>건 · ERP{' '}
        <strong className="text-foreground">{stats.myStats.erp}</strong>건
      </span>
    </div>
  );
}

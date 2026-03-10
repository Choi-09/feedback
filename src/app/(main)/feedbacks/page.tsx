import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button';
import { FeedbackTabs } from '@/components/feedback/feedback-tabs';
import { FeedbackGuideBanner } from '@/components/feedback/feedback-guide-banner';
import { FeedbackSearchBar } from '@/components/feedback/feedback-search-bar';
import { FeedbackCard } from '@/components/feedback/feedback-card';
import { FeedbackEmptyState } from '@/components/feedback/feedback-empty-state';
import { FeedbackSkeletonList } from '@/components/feedback/feedback-skeleton-list';
import { ExcelDownloadButton } from '@/components/feedback/excel-download-button';
import { mockFeedbacks } from '@/lib/data/mock-feedbacks';
import type { FeedbackCategory } from '@/lib/types/common';

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function FeedbacksPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = (params.category as FeedbackCategory) || 'llm';
  const search = params.search || '';

  // 더미 데이터 필터링 (Task 012에서 실제 Server Action으로 교체 예정)
  const feedbacks = mockFeedbacks.filter((f) => {
    if (f.category !== category) return false;
    if (search && !f.content.includes(search)) return false;
    return true;
  });

  return (
    <PageContainer>
      <div className="space-y-4">
        <PageHeader title="피드백">
          <ExcelDownloadButton category={category} />
          <Link
            href={`/feedbacks/new?category=${category}`}
            className={buttonVariants({ size: 'sm' })}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">작성</span>
          </Link>
        </PageHeader>

        <Suspense>
          <FeedbackTabs />
        </Suspense>

        <FeedbackGuideBanner category={category} />

        <Suspense>
          <FeedbackSearchBar />
        </Suspense>

        <Suspense fallback={<FeedbackSkeletonList />}>
          {feedbacks.length > 0 ? (
            <div className="space-y-3">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          ) : (
            <FeedbackEmptyState />
          )}
        </Suspense>
      </div>
    </PageContainer>
  );
}

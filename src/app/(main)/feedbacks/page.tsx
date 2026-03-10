import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getFeedbacks } from '@/app/actions/feedback';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button-variants';
import { FeedbackTabs } from '@/components/feedback/feedback-tabs';
import { DeadlineCountdown } from '@/components/feedback/deadline-countdown';
import { SubmissionStatus } from '@/components/feedback/submission-status';
import { FeedbackGuideBanner } from '@/components/feedback/feedback-guide-banner';
import { FeedbackSearchBar } from '@/components/feedback/feedback-search-bar';
import { FeedbackCard } from '@/components/feedback/feedback-card';
import { FeedbackEmptyState } from '@/components/feedback/feedback-empty-state';
import { FeedbackSkeletonList } from '@/components/feedback/feedback-skeleton-list';
import { ExcelDownloadButton } from '@/components/feedback/excel-download-button';
import type { FeedbackCategory } from '@/lib/types/common';

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function FeedbacksPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = (params.category as FeedbackCategory) || 'llm';
  const search = params.search || '';

  // 현재 사용자 관리자 여부 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('auth_id', user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
  }

  // 실제 데이터 조회
  const feedbacks = await getFeedbacks(category, search || undefined);

  return (
    <PageContainer>
      <div className="flex h-full flex-col gap-4">
        {/* 고정 컨트롤 영역 */}
        <div className="shrink-0 space-y-4">
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

          <DeadlineCountdown />

          <Suspense>
            <FeedbackTabs />
          </Suspense>

          <SubmissionStatus category={category} />

          <FeedbackGuideBanner category={category} />

          <Suspense>
            <FeedbackSearchBar />
          </Suspense>
        </div>

        {/* 스크롤 가능한 카드 목록 */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Suspense fallback={<FeedbackSkeletonList />}>
            {feedbacks.length > 0 ? (
              <div className="space-y-3 pb-4">
                {feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            ) : (
              <FeedbackEmptyState />
            )}
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}

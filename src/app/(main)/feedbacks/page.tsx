import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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
import type {
  FeedbackListItem,
  AdminFeedbackListItem,
} from '@/lib/types/feedback';
import type { FeedbackCategory } from '@/lib/types/common';

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function FeedbacksPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = (params.category as FeedbackCategory) || 'llm';
  const search = params.search || '';

  // 1회의 getUser() + 병렬 DB 쿼리로 모든 데이터 조회
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();

  // 프로필, 피드백 목록, 통계를 병렬로 조회
  const [profileResult, feedbacksResult, allFeedbacksResult, usersCountResult] =
    await Promise.all([
      supabase
        .from('users')
        .select('id, name, is_admin')
        .eq('auth_id', user.id)
        .single(),
      (() => {
        let q = supabase
          .from('feedbacks')
          .select(
            'id, category, content, author_id, created_at, updated_at, users(name)',
          )
          .eq('category', category)
          .order('created_at', { ascending: false });
        if (search.trim()) q = q.ilike('content', `%${search.trim()}%`);
        return q;
      })(),
      admin.from('feedbacks').select('author_id, category'),
      admin.from('users').select('*', { count: 'exact', head: true }),
    ]);

  const profile = profileResult.data;
  const isAdmin = profile?.is_admin ?? false;
  const userId = profile?.id ?? null;

  // 피드백 목록 매핑
  const rawFeedbacks = feedbacksResult.data ?? [];
  const feedbacks: (FeedbackListItem | AdminFeedbackListItem)[] =
    rawFeedbacks.map((row) => {
      const base: FeedbackListItem = {
        id: row.id,
        category: row.category as FeedbackCategory,
        content: row.content,
        created_at: row.created_at,
        updated_at: row.updated_at,
        is_mine: row.author_id === userId,
      };
      if (isAdmin) {
        return {
          ...base,
          author_name: row.users?.name ?? '알 수 없음',
        } as AdminFeedbackListItem;
      }
      return base;
    });

  // 통계 계산
  const allFeedbacks = allFeedbacksResult.data ?? [];
  const totalUsers = usersCountResult.count ?? 22;
  const llmFeedbacks = allFeedbacks.filter((f) => f.category === 'llm');
  const erpFeedbacks = allFeedbacks.filter((f) => f.category === 'erp');
  const stats = {
    myStats: {
      llm: userId
        ? allFeedbacks.filter(
            (f) => f.author_id === userId && f.category === 'llm',
          ).length
        : 0,
      erp: userId
        ? allFeedbacks.filter(
            (f) => f.author_id === userId && f.category === 'erp',
          ).length
        : 0,
    },
    overallStats: {
      llm: new Set(llmFeedbacks.map((f) => f.author_id)).size,
      erp: new Set(erpFeedbacks.map((f) => f.author_id)).size,
    },
    feedbackCounts: {
      llm: llmFeedbacks.length,
      erp: erpFeedbacks.length,
      total: allFeedbacks.length,
    },
    totalUsers,
  };

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

          <SubmissionStatus category={category} stats={stats} />

          <FeedbackGuideBanner category={category} />

          <Suspense>
            <FeedbackSearchBar />
          </Suspense>
        </div>

        {/* 스크롤 가능한 카드 목록 */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Suspense fallback={<FeedbackSkeletonList />}>
            {feedbacks.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                {feedbacks.map((feedback, index) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    isAdmin={isAdmin}
                    index={index}
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

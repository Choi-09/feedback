import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { getUser, getProfile } from '@/lib/auth';
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
import { categorySchema } from '@/lib/schemas/feedback';
import type { FeedbackCategory } from '@/lib/types/common';

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function FeedbacksPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryResult = categorySchema.safeParse(params.category);
  const category: FeedbackCategory = categoryResult.success
    ? categoryResult.data
    : 'llm';
  const search = params.search || '';

  // React cache()로 중복 호출 방지 (AppHeader와 공유)
  const user = await getUser();
  if (!user) return null;

  const profile = await getProfile();
  const isAdmin = profile?.is_admin ?? false;
  const userId = profile?.id ?? null;

  const supabase = await createClient();
  const admin = createAdminClient();

  // 관리자/비관리자 분기: 비관리자는 users count만 조회
  const feedbacksQuery = (() => {
    let q = supabase
      .from('feedbacks')
      .select(
        'id, category, content, author_id, created_at, updated_at, keyword_emoji, keyword_label, users(name)',
      )
      .eq('category', category)
      .order('created_at', { ascending: false });
    if (search.trim()) q = q.ilike('content', `%${search.trim()}%`);
    return q;
  })();

  const allFeedbacksQuery = admin
    .from('feedbacks')
    .select('author_id, category');

  if (isAdmin) {
    // 관리자: 이름 목록 필요 (미제출자 표시)
    const [feedbacksResult, allFeedbacksResult, allUsersResult] =
      await Promise.all([
        feedbacksQuery,
        allFeedbacksQuery,
        admin.from('users').select('id, name'),
      ]);

    return renderPage({
      feedbacksData: feedbacksResult.data ?? [],
      allFeedbacks: allFeedbacksResult.data ?? [],
      allUsers: allUsersResult.data ?? [],
      totalUsers: (allUsersResult.data ?? []).length,
      isAdmin,
      userId,
      category,
    });
  }

  // 비관리자: count만 조회 (head: true)
  const [feedbacksResult, allFeedbacksResult, usersCountResult] =
    await Promise.all([
      feedbacksQuery,
      allFeedbacksQuery,
      admin.from('users').select('*', { count: 'exact', head: true }),
    ]);

  return renderPage({
    feedbacksData: feedbacksResult.data ?? [],
    allFeedbacks: allFeedbacksResult.data ?? [],
    allUsers: [],
    totalUsers: usersCountResult.count ?? 0,
    isAdmin,
    userId,
    category,
  });
}

// 페이지 렌더링 함수 (관리자/비관리자 공통)
function renderPage({
  feedbacksData,
  allFeedbacks,
  allUsers,
  totalUsers,
  isAdmin,
  userId,
  category,
}: {
  feedbacksData: Array<{
    id: string;
    category: string;
    content: string;
    author_id: string;
    created_at: string;
    updated_at: string;
    keyword_emoji: string | null;
    keyword_label: string | null;
    users: { name: string } | null;
  }>;
  allFeedbacks: Array<{ author_id: string; category: string }>;
  allUsers: Array<{ id: string; name: string }>;
  totalUsers: number;
  isAdmin: boolean;
  userId: string | null;
  category: FeedbackCategory;
}) {
  // 피드백 목록 매핑
  const feedbacks: (FeedbackListItem | AdminFeedbackListItem)[] =
    feedbacksData.map((row) => {
      const base: FeedbackListItem = {
        id: row.id,
        category: row.category as FeedbackCategory,
        content: row.content,
        created_at: row.created_at,
        updated_at: row.updated_at,
        is_mine: row.author_id === userId,
        keyword_emoji: row.keyword_emoji,
        keyword_label: row.keyword_label,
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
  const llmFeedbacks = allFeedbacks.filter((f) => f.category === 'llm');
  const erpFeedbacks = allFeedbacks.filter((f) => f.category === 'erp');

  // 카테고리별 미제출자 계산 (관리자용)
  const currentFeedbacks = category === 'llm' ? llmFeedbacks : erpFeedbacks;
  const submittedIds = new Set(currentFeedbacks.map((f) => f.author_id));
  const nonSubmitters = isAdmin
    ? allUsers.filter((u) => !submittedIds.has(u.id)).map((u) => u.name)
    : undefined;
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

          <SubmissionStatus
            category={category}
            stats={stats}
            nonSubmitters={nonSubmitters}
            isAdmin={isAdmin}
          />

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

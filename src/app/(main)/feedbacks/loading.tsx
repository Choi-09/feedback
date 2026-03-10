import { PageContainer } from '@/components/layout/page-container';
import { FeedbackSkeletonList } from '@/components/feedback/feedback-skeleton-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedbacksLoading() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-full" />
        <FeedbackSkeletonList />
      </div>
    </PageContainer>
  );
}

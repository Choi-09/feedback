import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { FeedbackForm } from '@/components/feedback/feedback-form';
import type { FeedbackCategory } from '@/lib/types/common';

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewFeedbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = (params.category as FeedbackCategory) || 'llm';

  return (
    <PageContainer>
      <div className="space-y-4">
        <PageHeader title="피드백 작성" />
        <FeedbackForm category={category} />
      </div>
    </PageContainer>
  );
}

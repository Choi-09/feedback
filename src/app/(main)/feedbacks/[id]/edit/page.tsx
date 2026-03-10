import { redirect } from 'next/navigation';

import { getFeedbackById } from '@/app/actions/feedback';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { FeedbackEditForm } from '@/components/feedback/feedback-edit-form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditFeedbackPage({ params }: Props) {
  const { id } = await params;

  const feedback = await getFeedbackById(id);

  // 본인 작성건이 아니거나 존재하지 않는 경우 목록으로 리다이렉트
  if (!feedback) {
    redirect('/feedbacks');
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <PageHeader title="피드백 수정" />
        <FeedbackEditForm feedback={feedback} />
      </div>
    </PageContainer>
  );
}

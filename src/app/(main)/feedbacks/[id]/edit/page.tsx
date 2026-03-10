import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { FeedbackEditForm } from '@/components/feedback/feedback-edit-form';
import { mockFeedbacks } from '@/lib/data/mock-feedbacks';
import type { FeedbackDetail } from '@/lib/types/feedback';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditFeedbackPage({ params }: Props) {
  const { id } = await params;

  // 더미 데이터에서 피드백 조회 (Task 013에서 실제 Server Action으로 교체 예정)
  const mock = mockFeedbacks.find((f) => f.id === id);
  const feedback: FeedbackDetail = mock
    ? {
        id: mock.id,
        category: mock.category,
        content: mock.content,
        created_at: mock.created_at,
        updated_at: mock.updated_at,
      }
    : {
        id,
        category: 'llm',
        content: '더미 피드백 내용입니다.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

  return (
    <PageContainer>
      <div className="space-y-4">
        <PageHeader title="피드백 수정" />
        <FeedbackEditForm feedback={feedback} />
      </div>
    </PageContainer>
  );
}

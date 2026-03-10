import { Info } from 'lucide-react';

import type { FeedbackCategory } from '@/lib/types/common';

const GUIDE_MESSAGES: Record<FeedbackCategory, string> = {
  llm: 'LLM 서비스 사용 중 필요한 기능, 불편한 점, 개선 아이디어를 자유롭게 작성해주세요',
  erp: 'ERP 시스템 사용 중 필요한 기능, 불편한 점, 개선 아이디어를 자유롭게 작성해주세요',
};

export function FeedbackGuideBanner({
  category,
}: {
  category: FeedbackCategory;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>{GUIDE_MESSAGES[category]}</p>
    </div>
  );
}

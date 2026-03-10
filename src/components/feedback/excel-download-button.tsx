'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { FeedbackCategory } from '@/lib/types/common';

export function ExcelDownloadButton({
  category,
}: {
  category: FeedbackCategory;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // 더미 핸들러 (Task 015에서 실제 다운로드로 교체 예정)
  const handleDownload = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    alert(`${category.toUpperCase()} 피드백 엑셀 다운로드 (준비 중)`);
    setIsLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      <span className="hidden sm:inline">엑셀</span>
    </Button>
  );
}

'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { FeedbackCategory } from '@/lib/types/common';

export function ExcelDownloadButton({
  category,
}: {
  category: FeedbackCategory;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/feedbacks/export?category=${category}`);

      if (!res.ok) {
        toast.error('엑셀 다운로드에 실패했습니다');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Content-Disposition에서 파일명 추출 또는 기본값 사용
      const disposition = res.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename\*=UTF-8''(.+)/);
      a.download = filenameMatch
        ? decodeURIComponent(filenameMatch[1])
        : `피드백_${category.toUpperCase()}.xlsx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('엑셀 파일이 다운로드되었습니다');
    } catch {
      toast.error('엑셀 다운로드 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
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

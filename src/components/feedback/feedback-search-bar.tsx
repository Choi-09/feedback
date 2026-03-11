'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export function FeedbackSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [value, setValue] = useState(initialSearch);
  const isFirstRender = useRef(true);

  // URL의 search 파라미터가 외부에서 변경되면 (탭 전환 등) value 동기화
  useEffect(() => {
    setValue(searchParams.get('search') || '');
  }, [searchParams]);

  // 300ms debounce로 자동 검색
  useEffect(() => {
    // 첫 렌더링 시에는 push 스킵
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`/feedbacks?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, searchParams, router]);

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="피드백 검색..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

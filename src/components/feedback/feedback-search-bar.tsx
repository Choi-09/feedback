'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export function FeedbackSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');

  const updateSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      router.push(`/feedbacks?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateSearch(value);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="피드백 검색..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-8"
      />
    </div>
  );
}

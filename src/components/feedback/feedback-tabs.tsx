'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FeedbackCategory } from '@/lib/types/common';

export function FeedbackTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') as FeedbackCategory) || 'llm';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', value);
    params.delete('search');
    router.push(`/feedbacks?${params.toString()}`);
  };

  return (
    <Tabs value={category} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="llm" className="cursor-pointer">
          LLM
        </TabsTrigger>
        <TabsTrigger value="erp" className="cursor-pointer">
          ERP
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export function FeedbackSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-4 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

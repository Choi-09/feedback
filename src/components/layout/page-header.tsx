import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <h1 className="text-xl font-semibold">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

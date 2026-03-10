export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-full max-w-2xl px-4 py-6 sm:px-6">{children}</div>
  );
}

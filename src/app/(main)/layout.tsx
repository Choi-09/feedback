import { AppHeader } from '@/components/layout/app-header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

// 인증 그룹 레이아웃 — 중앙 정렬, 헤더 없음
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}

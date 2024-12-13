export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-co flex min-h-screen items-center justify-center bg-muted bg-[url(/auth-bg.svg)] bg-cover bg-center dark:bg-background">
      {children}
    </div>
  );
}

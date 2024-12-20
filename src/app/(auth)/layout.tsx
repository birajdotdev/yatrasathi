import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-modern-gradient p-4">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}

import { redirect } from "next/navigation";

import BackButton from "@/components/auth/back-button";
import ThemeToggle from "@/components/nav/theme-toggle";
import { auth } from "@/server/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function BackgroundPatterns() {
  return (
    <>
      <div className="absolute inset-0 bg-repeat opacity-[0.7] dark:opacity-0 bg-light-pattern translate-y-[-2%]" />
      <div className="absolute inset-0 bg-repeat opacity-0 dark:opacity-[0.7] bg-dark-pattern translate-y-[-2%]" />
    </>
  );
}

function GlowEffects() {
  return (
    <>
      <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
      <div className="absolute -left-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-primary/[0.07] blur-[120px] dark:bg-primary/[0.03]" />
    </>
  );
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { userId } = await auth();
  if (userId) return redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted dark:bg-background">
      <div className="absolute inset-0">
        <BackgroundPatterns />
        <GlowEffects />
      </div>

      <BackButton />

      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle variant="ghost" />
      </div>

      <div className="relative z-10 m-4 w-full max-w-[420px]">{children}</div>
    </div>
  );
}

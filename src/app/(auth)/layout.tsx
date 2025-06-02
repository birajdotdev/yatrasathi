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
      <div className="bg-light-pattern absolute inset-0 translate-y-[-2%] bg-repeat opacity-[0.7] dark:opacity-0" />
      <div className="bg-dark-pattern absolute inset-0 translate-y-[-2%] bg-repeat opacity-0 dark:opacity-[0.7]" />
    </>
  );
}

function GlowEffects() {
  return (
    <>
      <div className="absolute top-0 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
      <div className="absolute bottom-0 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/[0.07] blur-[120px] dark:bg-primary/[0.03]" />
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

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle variant="ghost" />
      </div>

      <div className="relative z-10 m-4 w-full max-w-[420px]">{children}</div>
    </div>
  );
}

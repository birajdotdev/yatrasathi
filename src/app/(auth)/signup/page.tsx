import { Signup } from "@/components/auth";

export default function SignupPage() {
  return (
    <div className="bg-co flex min-h-screen items-center justify-center bg-muted bg-[url(/auth-bg.svg)] bg-cover bg-center dark:bg-background">
      <Signup />
    </div>
  );
}

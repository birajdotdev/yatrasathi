import { Login } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="bg-co flex min-h-screen items-center justify-center bg-muted bg-[url(/auth-bg.svg)] bg-cover bg-center dark:bg-background">
      <Login />
    </div>
  );
}

import Login from "@/components/auth/login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url(/bg-light.svg)] bg-center dark:bg-[url(/bg-dark.svg)]">
      <Login />
    </div>
  );
}

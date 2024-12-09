import { LoginForm } from "@/components/login-form";
import Logo from "@/components/nav/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url(/bg-light.svg)] bg-center dark:bg-[url(/bg-dark.svg)]">
      <Card className="relative w-full max-w-md space-y-8 rounded-xl p-8 shadow-lg">
        <CardHeader className="flex flex-col items-center !p-0">
          <Logo />
          <CardTitle className="!mt-6 text-3xl font-bold">
            Welcome to YatraSathi
          </CardTitle>
          <CardDescription className="!mt-2">
            Your personal travel planning companion
          </CardDescription>
        </CardHeader>
        <CardContent className="!p-0">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

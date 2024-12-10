import { LoginForm } from "@/components/auth/login/login-form";
import Logo from "@/components/nav/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Login() {
  return (
    <Card className="flex min-h-screen w-full flex-col justify-center overflow-hidden rounded-none md:min-h-fit md:max-w-md md:rounded-xl md:shadow-xl">
      <CardHeader className="flex flex-col items-center space-y-4 pt-6 text-center">
        <Logo />
        <div>
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            Welcome to YatraSathi
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            Your personal travel planning companion
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

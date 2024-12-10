import Logo from "@/components/nav/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function Signup() {
  return (
    <Card className="flex min-h-screen w-full flex-col justify-center overflow-hidden rounded-none md:min-h-fit md:max-w-md md:rounded-xl md:shadow-xl">
      <CardHeader className="flex flex-col items-center space-y-4 pt-6 text-center">
        <Logo />
        <div>
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            Welcome to YatraSathi
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            Create your account and start planning
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

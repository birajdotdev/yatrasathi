import Link from "next/link";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

export default function Signin() {
  return (
    <Card className="w-full max-w-[420px] backdrop-blur-md shadow-2xl relative z-10">
      <CardHeader className="space-y-6 pb-8 pt-6">
        <div className="flex justify-center">
          <Logo className="h-12 w-auto" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
          Welcome to YatraSathi
        </CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">
          Sign in to plan your next adventure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Suspense>{/* <SigninForm /> */}</Suspense>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Separator className="flex-1" />
          <span>OR</span>
          <Separator className="flex-1" />
        </div>
        {/* <SocialButtons /> */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="text-primary hover:underline underline-offset-2"
          >
            Terms of Service
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

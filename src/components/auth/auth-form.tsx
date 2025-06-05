"use client";

import Link from "next/link";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  Compass,
  Loader2,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface AuthFormProps extends React.ComponentProps<"div"> {
  type?: "sign-in" | "sign-up";
}

export function AuthForm({
  className,
  type = "sign-in",
  ...props
}: AuthFormProps) {
  const isSignUp = type === "sign-up";

  const [activeProvider, setActiveProvider] = useState<
    "google" | "facebook" | null
  >(null);

  const socialSignInMutation = useMutation({
    mutationFn: async (provider: "google" | "facebook") => {
      await authClient.signIn.social(
        {
          provider,
          callbackURL: "/dashboard",
        },
        {
          onError: (ctx) => {
            console.error("OAuth error:", ctx.error);
            toast.error(
              ctx.error.message ??
                `Failed to sign in with ${provider}. Please try again.`
            );
          },
        }
      );
    },
    onError: (error) => {
      // This will catch errors thrown outside the Better Auth onError
      console.error("Unexpected OAuth error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    },
    onSettled: () => {
      setActiveProvider(null);
    },
  });

  const handleOAuth = (provider: "google" | "facebook") => {
    setActiveProvider(provider);
    socialSignInMutation.mutate(provider);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <Compass className="size-8 text-primary" />
              </div>
              <span className="sr-only">YatraSathi</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to YatraSathi</h1>
            <div className="text-center text-sm">
              {isSignUp ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="hover:underline hover:underline-offset-4"
              >
                {isSignUp ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {isSignUp && (
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    className="peer ps-9"
                    placeholder="John Doe"
                    type="text"
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <UserIcon size={16} aria-hidden="true" />
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  className="peer ps-9"
                  placeholder="m@example.com"
                  type="email"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <MailIcon size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
            <Button type="submit" className="group w-full">
              {isSignUp ? "Sign up" : "Sign in"}
              <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or {isSignUp ? "sign up with" : "sign in with"}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleOAuth("facebook")}
              disabled={
                socialSignInMutation.isPending && activeProvider === "facebook"
              }
            >
              {socialSignInMutation.isPending &&
              activeProvider === "facebook" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FacebookIcon />
              )}
              Facebook
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleOAuth("google")}
              disabled={
                socialSignInMutation.isPending && activeProvider === "google"
              }
            >
              {socialSignInMutation.isPending && activeProvider === "google" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Google
            </Button>
          </div>
        </div>
      </form>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="terms-of-service">Terms of Service</Link> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
        fill="currentColor"
      />
    </svg>
  );
}

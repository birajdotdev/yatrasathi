"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;

    try {
      const result = await login(formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "You have successfully logged in.",
        });
        router.push("/home");
      } else {
        toast({
          title: "Error",
          description: result.error ?? "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.log((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
          >
            Remember me
          </Label>
        </div>
        <div className="text-sm">
          <Link
            href="#"
            className="hover:text-primary-dark font-medium text-primary"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signIn("github")}
          disabled={isLoading}
        >
          {/* <Github className="mr-2 h-4 w-4" /> */}
          Sign in with GitHub
        </Button>
      </div>
    </form>
  );
}

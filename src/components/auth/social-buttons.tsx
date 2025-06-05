"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { socialButtonElements } from "@/const/auth";
import { authClient } from "@/lib/auth-client";

export default function SocialButtons() {
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
    <div className="grid gap-4 sm:grid-cols-2">
      {socialButtonElements.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => handleOAuth(provider.name)}
          disabled={
            socialSignInMutation.isPending && activeProvider === provider.name
          }
        >
          {socialSignInMutation.isPending &&
          activeProvider === provider.name ? (
            <Loader2 className="mr-0.5 animate-spin" />
          ) : (
            <provider.icon className="mr-0.5" />
          )}
          {provider.label}
        </Button>
      ))}
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";

import GithubIcon from "../icons/github-icon";
import GoogleIcon from "../icons/google-icon";
import { Button } from "../ui/button";

export default function SocialButtons() {
  return (
    <div className="flex w-full items-center space-x-3">
      <Button
        variant="outline"
        className="w-full text-sm"
        onClick={() => signIn("google", { callbackUrl: "/home" })}
      >
        <GoogleIcon width={16} height={16} />
      </Button>
      <Button
        variant="outline"
        className="w-full text-sm"
        onClick={() => signIn("github", { callbackUrl: "/home" })}
      >
        <GithubIcon width={16} height={16} />
      </Button>
    </div>
  );
}

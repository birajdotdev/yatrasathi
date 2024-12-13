"use client";

import { Button } from "../ui/button";
import GoogleIcon from "../icons/google-icon";
import GithubIcon from "../icons/github-icon";

export default function SocialButtons() {
  return (
    <div className="flex w-full items-center space-x-3">
      <Button type="button" variant="outline" className="w-full text-sm">
        <GoogleIcon width={16} height={16} />
      </Button>
      <Button type="button" variant="outline" className="w-full text-sm">
        <GithubIcon width={16} height={16} />
      </Button>
    </div>
  );
}

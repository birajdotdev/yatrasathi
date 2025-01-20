import Form from "next/form";
import { type ComponentType } from "react";

import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "@/server/auth";

interface SocialButton {
  icon: ComponentType<{ className?: string }>;
  name: string;
  provider: "google" | "facebook";
}

const socialButtons: SocialButton[] = [
  {
    icon: GoogleIcon,
    name: "Google",
    provider: "google",
  },
  {
    icon: FacebookIcon,
    name: "Facebook",
    provider: "facebook",
  },
];

export default function SocialButtons() {
  return (
    <div className="space-y-3">
      {socialButtons.map((button) => (
        <Form
          key={button.provider}
          action={async () => {
            "use server";
            await signIn(button.provider, {
              redirectTo: "/dashboard",
            });
          }}
        >
          <Button
            variant="outline"
            className="w-full text-sm sm:text-base font-semibold"
            size="lg"
          >
            <button.icon className="mr-2 h-5 w-5" />
            Continue with {button.name}
          </Button>
        </Form>
      ))}
    </div>
  );
}

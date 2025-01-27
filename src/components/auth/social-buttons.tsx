import Form from "next/form";

import SubmitButton from "@/components/auth/social-button";
import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { signIn } from "@/server/auth";

const socialButtons = [
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
          <SubmitButton>
            <button.icon className="mr-2 h-5 w-5" />
            Continue with {button.name}
          </SubmitButton>
        </Form>
      ))}
    </div>
  );
}

import { MailIcon, UserIcon } from "lucide-react";

import { FacebookIcon, GoogleIcon } from "@/components/icons";

interface FormElement {
  name: "name" | "email";
  label: string;
  placeholder: string;
  type: string;
  icon: React.ElementType;
}

export const signUpFormElements = [
  {
    name: "name",
    label: "Name",
    placeholder: "John Doe",
    type: "text",
    icon: UserIcon,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "m@example.com",
    type: "email",
    icon: MailIcon,
  },
] as FormElement[];

export const signInFormElements = signUpFormElements.filter(
  (element) => element.name !== "name"
);

interface SocialButtonElement {
  label: string;
  name: "google" | "facebook";
  icon: React.ElementType;
}

export const socialButtonElements = [
  {
    label: "Facebook",
    name: "facebook",
    icon: FacebookIcon,
  },
  {
    label: "Google",
    name: "google",
    icon: GoogleIcon,
  },
] as SocialButtonElement[];

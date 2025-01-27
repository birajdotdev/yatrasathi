"use client";

import { type ComponentProps } from "react";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SocialButtonProps = ComponentProps<typeof Button>;

export default function SocialButton({
  children,
  ...props
}: SocialButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      className="w-full text-sm sm:text-base font-semibold"
      size="lg"
      {...props}
      disabled={pending || props.disabled}
    >
      {children}
    </Button>
  );
}

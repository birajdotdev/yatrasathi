"use client";

import { type ComponentProps } from "react";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = ComponentProps<typeof Button>;

export default function SubmitButton({
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full text-sm sm:text-base font-semibold"
      size="lg"
      {...props}
      disabled={pending || props.disabled}
    >
      {children}
    </Button>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, User, type LucideIcon } from "lucide-react";
import { signupSchema, type SignupFormValues } from "@/zod/auth-schema";
import AuthInput from "../auth-input";
import { type HTMLInputTypeAttribute } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormFieldConfig {
  name: "name" | "email" | "password";
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  icon: LucideIcon;
}

const formFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    placeholder: "Your Name",
    type: "text",
    icon: User,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    icon: Mail,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    type: "password",
    icon: Lock,
  },
];

export function SignupForm() {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signup = api.auth.signup.useMutation({
    onSuccess() {
      toast.success("Account created successfully", {
        richColors: true,
      });
      router.push("/login");
    },
    onError(error) {
      toast.error(error.message, {
        richColors: true,
      });
    },
  });

  async function onSubmit(values: SignupFormValues) {
    await signup.mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formFields.map((formField) => (
          <FormField
            key={formField.name}
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{formField.label}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AuthInput
                      placeholder={formField.placeholder}
                      {...field}
                      type={formField.type}
                      className="pl-10 text-sm"
                      icon={formField.icon}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        ))}
        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full text-sm"
            isLoading={signup.isPending}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}

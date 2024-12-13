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
  const isLoading = false;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    console.log("values:", values);
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
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}

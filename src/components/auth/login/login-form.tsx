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
import { Mail, Lock, type LucideIcon } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/zod/auth-schema";
import { type HTMLInputTypeAttribute } from "react";
import AuthInput from "../auth-input";

interface FormFieldConfig {
  name: "email" | "password";
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  icon: LucideIcon;
}

const formFields: FormFieldConfig[] = [
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

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    console.log(values);
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
          <Button type="submit" className="w-full text-sm">
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}

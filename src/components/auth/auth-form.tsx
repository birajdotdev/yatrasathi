"use client";

import Link from "next/link";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Compass } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInFormElements, signUpFormElements } from "@/const/auth";
import { cn } from "@/lib/utils";
import {
  type AuthFormSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/zod/auth";

import SocialButtons from "./social-buttons";

interface AuthFormProps extends React.ComponentProps<"div"> {
  type?: "sign-in" | "sign-up";
}

export function AuthForm({
  className,
  type = "sign-in",
  ...props
}: AuthFormProps) {
  const isSignUp = type === "sign-up";
  const formElements = isSignUp ? signUpFormElements : signInFormElements;

  const form = useForm<AuthFormSchema>({
    resolver: zodResolver(isSignUp ? signUpFormSchema : signInFormSchema),
    defaultValues: isSignUp ? { name: "", email: "" } : { email: "" },
  });

  const onSubmit = (data: AuthFormSchema) => {
    console.log(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <Compass className="size-8 text-primary" />
                </div>
                <span className="sr-only">YatraSathi</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to YatraSathi</h1>
              <div className="text-center text-sm">
                {isSignUp
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <Link
                  href={isSignUp ? "/sign-in" : "/sign-up"}
                  className="hover:underline hover:underline-offset-4"
                >
                  {isSignUp ? "Sign up" : "Sign in"}
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {formElements.map((element) => (
                <FormField
                  key={element.name}
                  control={form.control}
                  name={element.name}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel htmlFor={element.name}>
                        {element.label}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id={element.name}
                            className={cn(
                              "peer ps-9",
                              form.formState.errors[
                                element.name as keyof AuthFormSchema
                              ] &&
                                "border-destructive !bg-destructive/10 placeholder:text-destructive/80"
                            )}
                            placeholder={element.placeholder}
                            type={element.type}
                            {...field}
                          />
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <element.icon
                              size={16}
                              aria-hidden="true"
                              className={cn(
                                form.formState.errors[
                                  element.name as keyof AuthFormSchema
                                ] && "text-destructive/80"
                              )}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="group w-full">
                {isSignUp ? "Sign up" : "Sign in"}
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or {isSignUp ? "sign up with" : "sign in with"}
              </span>
            </div>
            <SocialButtons />
          </div>
        </form>
      </Form>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="terms-of-service">Terms of Service</Link> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

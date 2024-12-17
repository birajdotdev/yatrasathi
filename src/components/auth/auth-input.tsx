"use client";

import React, { useState } from "react";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.ComponentProps<typeof Input> {
  icon?: LucideIcon;
}

export default function AuthInput({
  className,
  type,
  icon: Icon,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        className={cn("pl-10 pr-10 text-sm", className)}
        {...props}
      />
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      )}
      {type === "password" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      )}
    </div>
  );
}

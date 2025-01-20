"use client";

import React from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeToggle({
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="size-9"
      {...props}
    >
      <Sun size={16} strokeWidth={2} className="dark:hidden" />
      <Moon size={16} strokeWidth={2} className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

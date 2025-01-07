"use client";

import React from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ ...props }: React.ComponentProps<typeof Button>) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 sm:h-10 sm:w-10"
      {...props}
    >
      <Sun className="h-4 w-4 sm:h-5 sm:w-5 dark:hidden" />
      <Moon className="hidden h-4 w-4 sm:h-5 sm:w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

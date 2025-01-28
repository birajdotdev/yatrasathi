"use client";

import { type ComponentProps } from "react";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  {
    name: "Light",
    icon: Sun,
    value: "light",
  },
  {
    name: "Dark",
    icon: Moon,
    value: "dark",
  },
  {
    name: "System",
    icon: Monitor,
    value: "system",
  },
];

export default function ThemeToggle({
  ...props
}: ComponentProps<typeof Button>) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="rounded-lg data-[state=open]:bg-muted transition-colors"
          variant="outline"
          aria-label="Select theme"
          {...props}
        >
          <Sun
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="dark:hidden"
          />
          <Moon
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="hidden dark:block"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-32 rounded-lg" align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className="rounded-md cursor-pointer"
          >
            <theme.icon
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>{theme.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

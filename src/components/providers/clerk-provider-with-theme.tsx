"use client";

import React from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { useTheme } from "next-themes";

export function ClerkProviderWithTheme({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof ClerkProvider>) {
  const { theme, systemTheme } = useTheme();

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
        layout: {
          logoImageUrl: isDark ? "/logo-dark.png" : "/logo.png",
          socialButtonsPlacement: "bottom",
          unsafe_disableDevelopmentModeWarnings: true,
        },
        elements: {
          formFieldRow__username: {
            display: "none",
          },
          drawerRoot: {
            zIndex: 10000,
          },
        },
      }}
      {...props}
    >
      {children}
    </ClerkProvider>
  );
}

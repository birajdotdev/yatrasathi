"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: "#e11d48",
          colorTextOnPrimaryBackground: "#fff",
        },
        layout: {
          logoImageUrl: isDark ? "/logo-dark.png" : "/logo.png",
          socialButtonsPlacement: "bottom",
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
      {...props}
    >
      {children}
    </ClerkProvider>
  );
}

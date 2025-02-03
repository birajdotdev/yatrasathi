import React from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          logoImageUrl: "/logo.svg",
          socialButtonsPlacement: "bottom",
          termsPageUrl: "/terms-of-service",
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: "hsl(346.8 77.2% 49.8%)",
          colorTextOnPrimaryBackground: "hsl(355.7 100% 97.3%)",
        },
      }}
    >
<TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </TRPCReactProvider>
      <SpeedInsights />
      <Analytics />
    </ClerkProvider>
  );
}

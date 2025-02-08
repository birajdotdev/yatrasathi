import React from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ClerkProviderWithTheme } from "@/components/providers/clerk-provider-with-theme";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProviderWithTheme>
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
        <SpeedInsights />
        <Analytics />
      </ClerkProviderWithTheme>
    </ThemeProvider>
  );
}

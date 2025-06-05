import React from "react";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
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
      <TRPCReactProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
        <Toaster richColors />
      </TRPCReactProvider>
      <SpeedInsights />
      <Analytics />
    </ThemeProvider>
  );
}

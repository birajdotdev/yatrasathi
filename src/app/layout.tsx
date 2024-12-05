import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "YatraSathi - Your Journey, Simplified",
    template: "%s | YatraSathi",
  },
  description:
    "Plan your perfect trip with AI-powered itineraries, personalized recommendations, and a vibrant travel community.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

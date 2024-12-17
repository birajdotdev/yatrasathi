import { type Metadata } from "next";

import { GeistSans } from "geist/font/sans";

import Providers from "@/components/providers/providers";
import "@/styles/globals.css";

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
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

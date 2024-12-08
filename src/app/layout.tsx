import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Providers from "@/components/providers/providers";
import NavBar from "@/components/nav/nav-bar";
import Footer from "@/components/footer";

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
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

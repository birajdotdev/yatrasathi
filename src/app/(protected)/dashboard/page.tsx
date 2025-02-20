import { type Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Home, Plus } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { BlogSection } from "@/components/pages/dashboard/blog-section";
import {
  ItinerariesClient,
  ItinerariesSkeleton,
} from "@/components/pages/itineraries";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { HydrateClient, api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View an overview of your travel plans and activities",
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return <RedirectToSignIn />;

  void api.itinerary.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="space-y-6 lg:space-y-8">
        <Banner
          badgeText="Dashboard Overview"
          title={`Welcome back, ${user.firstName}!`}
          description="Here's an overview of your travel plans and activities."
          icon={Home}
          quickStats
        />
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Your
              </span>{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Itineraries
              </span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
              asChild
            >
              <Link href="/itineraries/create">
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                  <span>Create New</span>
                </span>
              </Link>
            </Button>
          </div>
          <Suspense fallback={<ItinerariesSkeleton />}>
            <ErrorBoundary fallback={<div>Error loading itineraries</div>}>
              <ItinerariesClient />
            </ErrorBoundary>
          </Suspense>
        </section>
        <BlogSection />
      </main>
    </HydrateClient>
  );
}

import { type Metadata } from "next";
import { Suspense } from "react";

import { GlobeIcon } from "lucide-react";

import { BlogsSkeleton, ExploreClient } from "@/components/pages/blogs";
import { Banner } from "@/components/ui/banner";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrateClient, api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new places and plan your next adventure",
};

export default async function ExplorePage() {
  const categories = await api.blog.getCategories();
  await Promise.all(
    categories.map((category) =>
      api.blog.getPostsByCategory.prefetch({ category: category.value })
    )
  );

  return (
    <HydrateClient>
      <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
        <Banner
          title="Explore Destinations"
          description="Discover new places and plan your next adventure."
          badgeText="Discover More"
          icon={GlobeIcon}
        />

        <Tabs defaultValue="travel_tips">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.value}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Suspense fallback={<BlogsSkeleton />}>
                <ErrorBoundaryWrapper
                  fallbackMessage={`Error loading ${category.name} blogs`}
                >
                  <ExploreClient category={category.value} />
                </ErrorBoundaryWrapper>
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </HydrateClient>
  );
}

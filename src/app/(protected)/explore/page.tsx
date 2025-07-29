import { type Metadata } from "next";
import { Suspense } from "react";

import { GlobeIcon } from "lucide-react";

import { BlogsSkeleton, ExploreClient } from "@/components/pages/blogs";
import { Banner } from "@/components/ui/banner";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BLOG_CATEGORIES, type CategoryType } from "@/const/blog";
import { HydrateClient, api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new places and plan your next adventure",
};

export default function ExplorePage() {
  void api.blog.listPosts.prefetch({});

  const tabOptions = [
    { value: "all", label: "All" },
    ...BLOG_CATEGORIES.map((category) => ({
      value: category.value,
      label: category.name,
    })),
  ];

  return (
    <HydrateClient>
      <main className="container mx-auto space-y-6 p-6 lg:space-y-8 lg:p-8">
        <Banner
          title="Explore Destinations"
          description="Discover new places and plan your next adventure."
          badgeText="Discover More"
          icon={GlobeIcon}
        />

        <Tabs defaultValue="all">
          <TabsList>
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabOptions.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Suspense fallback={<BlogsSkeleton />}>
                <ErrorBoundaryWrapper
                  fallbackMessage={`Error loading ${tab.label} blogs`}
                >
                  <ExploreClient
                    category={
                      tab.value === "all"
                        ? undefined
                        : (tab.value as CategoryType)
                    }
                  />
                </ErrorBoundaryWrapper>
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </HydrateClient>
  );
}

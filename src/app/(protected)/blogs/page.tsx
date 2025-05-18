import { type Metadata } from "next";
import { Suspense } from "react";

import { PenTool } from "lucide-react";

import { BlogsClient, BlogsSkeleton } from "@/components/pages/blogs";
import { Banner } from "@/components/ui/banner";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrateClient, api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Blog",
  description: "Share your adventures and read about others' experiences",
};

export default async function BlogsPage() {
  await Promise.all([
    api.blog.getUserPosts.prefetch({ status: "published" }),
    api.blog.getUserPosts.prefetch({ status: "draft" }),
  ]);

  const tabOptions = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ] as const;

  return (
    <HydrateClient>
      <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
        <Banner
          badgeText="Travel Blogs"
          title="Your Blogs"
          description="Share your adventures and read about others' experiences"
          icon={PenTool}
        />

        <Tabs defaultValue="published">
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
                  <BlogsClient status={tab.value} />
                </ErrorBoundaryWrapper>
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </HydrateClient>
  );
}

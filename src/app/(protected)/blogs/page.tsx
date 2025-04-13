import { type Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PenTool, PlusCircle } from "lucide-react";

import BlogFeed from "@/components/pages/blogs/blog-feed";
import { BlogFeedSkeleton } from "@/components/pages/blogs/blog-feed-skeleton";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Blog",
  description: "Share your adventures and read about others' experiences",
};

export default function BlogPage() {
  return (
    <HydrateClient>
      <main className="space-y-6 lg:space-y-8">
        <Banner
          badgeText="Travel Blogs"
          title="Your Blogs"
          description="Share your adventures and read about others' experiences"
          icon={PenTool}
        />

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <Button className="flex items-center gap-2" asChild>
              <Link href="/blogs/create">
                <PlusCircle className="h-4 w-4" />
                <span>Create Blog</span>
              </Link>
            </Button>
          </div>

          <TabsContent value="all">
            <Suspense fallback={<BlogFeedSkeleton />}>
              <ErrorBoundaryWrapper fallbackMessage="Failed to load blogs. Please try again later.">
                <BlogFeed category="all" />
              </ErrorBoundaryWrapper>
            </Suspense>
          </TabsContent>

          <TabsContent value="recent">
            <Suspense fallback={<BlogFeedSkeleton />}>
              <ErrorBoundaryWrapper fallbackMessage="Failed to load blogs. Please try again later.">
                <BlogFeed category="recent" />
              </ErrorBoundaryWrapper>
            </Suspense>
          </TabsContent>

          <TabsContent value="popular">
            <Suspense fallback={<BlogFeedSkeleton />}>
              <ErrorBoundaryWrapper fallbackMessage="Failed to load blogs. Please try again later.">
                <BlogFeed category="popular" />
              </ErrorBoundaryWrapper>
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
}

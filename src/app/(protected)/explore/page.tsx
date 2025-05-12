import { type Metadata } from "next";

import { GlobeIcon } from "lucide-react";

import BlogCard from "@/components/pages/blogs/blog-card";
import { Banner } from "@/components/ui/banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new places and plan your next adventure",
};

export default function ExplorePage() {
  return (
    <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
      <Banner
        title="Explore Destinations"
        description="Discover new places and plan your next adventure."
        badgeText="Discover More"
        icon={GlobeIcon}
      />

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <BlogCard key={index} post={blog} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="popular">
          <p className="text-muted-foreground">
            Popular destinations content goes here.
          </p>
        </TabsContent>
        <TabsContent value="trending">
          <p className="text-muted-foreground">
            Trending destinations content goes here.
          </p>
        </TabsContent>
        <TabsContent value="recommended">
          <p className="text-muted-foreground">
            Recommended destinations content goes here.
          </p>
        </TabsContent>
      </Tabs>
    </main>
  );
}

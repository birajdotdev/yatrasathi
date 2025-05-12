import { type Metadata } from "next";

import { PenTool } from "lucide-react";

import BlogCard from "@/components/pages/blogs/blog-card";
import { Banner } from "@/components/ui/banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Share your adventures and read about others' experiences",
};

export default function BlogPage() {
  return (
    <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
      <Banner
        badgeText="Travel Blogs"
        title="Your Blogs"
        description="Share your adventures and read about others' experiences"
        icon={PenTool}
      />

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
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
        <TabsContent value="recent">
          <p className="text-muted-foreground">Recent blog posts go here...</p>
        </TabsContent>
        <TabsContent value="popular">
          <p className="text-muted-foreground">Popular blog posts go here...</p>
        </TabsContent>
        <TabsContent value="following">
          <p className="text-muted-foreground">
            Blog posts from authors you&apos;re following go here...
          </p>
        </TabsContent>
      </Tabs>
    </main>
  );
}

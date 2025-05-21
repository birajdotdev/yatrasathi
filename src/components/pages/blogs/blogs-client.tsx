"use client";

import { CirclePlus, OctagonXIcon } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/trpc/react";

import BlogCard from "./blog-card";

interface BlogsClientProps {
  status?: "published" | "draft";
  limit?: number;
}

export default function BlogsClient({ status, limit }: BlogsClientProps) {
  const [blogs] = api.blog.getUserPosts.useSuspenseQuery({
    status,
    limit,
  });

  // If no blogs are found, show an empty state
  if (blogs.posts.length === 0) {
    return (
      <EmptyState
        title="No blogs found"
        description="You haven't created any blogs yet."
        icon={OctagonXIcon}
        action={{
          icon: CirclePlus,
          label: "Write a blog post",
          href: "/blogs/create",
        }}
      />
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.posts.map((blog, index) => (
        <BlogCard key={index} blog={blog} />
      ))}
    </section>
  );
}

"use client";

import { CirclePlus, OctagonXIcon } from "lucide-react";

import { BlogCard } from "@/components/pages/blogs";
import { EmptyState } from "@/components/ui/empty-state";
import { type CategoryType } from "@/server/db/schema";
import { api } from "@/trpc/react";

interface ExploreClientProps {
  category: CategoryType;
}

export default function ExploreClient({ category }: ExploreClientProps) {
  const [blogs] = api.blog.getPostsByCategory.useSuspenseQuery({
    category,
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

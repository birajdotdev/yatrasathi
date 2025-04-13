"use client";

import * as React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

import { cn } from "@/lib/utils";
import BlogCard from "@/components/pages/blogs/blog-card";
import {
  useAllBlogs,
  useRecentBlogs,
  usePopularBlogs,
  useMyBlogs,
} from "@/lib/api/blog";

// Props for BlogFeed component
interface BlogFeedProps {
  category: "all" | "recent" | "popular" | "my-blogs";
  className?: string;
}

export default function BlogFeed({ category, className }: BlogFeedProps) {
  // Watch for intersection to load more
  const { ref, inView } = useInView();

  // Setup query hooks for different blog categories
  const recentBlogsQuery = useRecentBlogs();
  const allBlogsQuery = useAllBlogs();
  const popularBlogsQuery = usePopularBlogs();
  const myBlogsQuery = useMyBlogs();

  // Select the appropriate query results based on category
  const activeQuery = (() => {
    switch (category) {
      case "recent":
        return recentBlogsQuery;
      case "popular":
        return popularBlogsQuery;
      case "my-blogs":
        return myBlogsQuery;
      default:
        return allBlogsQuery;
    }
  })();

  // Destructure the active query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = activeQuery;

  // Use intersection observer to trigger loading more content
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle loading state
  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 animate-pulse"
          >
            <div className="h-40 bg-gray-200 rounded-md w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (status === "error") {
    // Safely handle error by checking its type first
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return (
      <div className="text-center py-10">
        <div className="flex justify-center items-center gap-2 text-red-500">
          <AlertCircle size={20} />
          <p>Failed to load blogs: {errorMessage}</p>
        </div>
      </div>
    );
  }

  // If we have data, display the blogs
  if (data?.pages && data.pages.length > 0) {
    // Flatten the pages array to get all blogs
    const blogs = data.pages.flatMap((page) => page.items);

    if (blogs.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {category === "my-blogs"
              ? "You haven't created any blogs yet"
              : "No blog posts found"}
          </p>
        </div>
      );
    }

    return (
      <div className={cn("space-y-6", className)}>
        {/* Display the blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            // Safe extraction of author data with type guards
            let authorName = "Anonymous";
            let authorImage = "/images/avatar-placeholder.jpg";

            // Check if authorId is an object and try to extract author information
            if (blog.authorId && typeof blog.authorId === "object") {
              // Handle the author object safely
              const authorObj = blog.authorId as { name?: string; image?: string };
              if (authorObj.name) {
                authorName = authorObj.name;
              }
              if (authorObj.image) {
                authorImage = authorObj.image;
              }
            }

            // Safe date formatting
            let publishedDate = "Unknown date";
            if (blog.createdAt) {
              if (typeof blog.createdAt === "string") {
                publishedDate = new Date(blog.createdAt).toLocaleDateString();
              } else if (blog.createdAt instanceof Date) {
                publishedDate = blog.createdAt.toLocaleDateString();
              }
            }

            // Create the blog card wrapped in a Link
            return (
              <Link href={`/blogs/${blog.slug}`} key={blog.id}>
                <BlogCard
                  post={{
                    title: blog.title,
                    excerpt: blog.excerpt ?? "",
                    image: blog.featuredImage ?? "/images/blog-placeholder.jpg",
                    readTime: `${Math.ceil((blog.content?.length ?? 0) / 1000)} min read`,
                    category: "Travel", // Default category
                    publishedAt: publishedDate,
                    likes: 0, // Default value as likes may not be available
                    author: {
                      name: authorName,
                      avatar: authorImage,
                    },
                    comments: 0, // Default value as comments may not be available
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Loading indicator for pagination */}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center pb-4">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading more...
                </span>
              </div>
            ) : (
              <div className="h-8" />
            )}
          </div>
        )}

        {/* No more posts indicator */}
        {!hasNextPage && blogs.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            No more posts to load
          </div>
        )}
      </div>
    );
  }

  // Display empty state if no blogs are found
  return (
    <div className="text-center py-10">
      <p className="text-muted-foreground">
        {category === "my-blogs"
          ? "You haven't created any blogs yet"
          : "No blog posts found"}
      </p>
    </div>
  );
}

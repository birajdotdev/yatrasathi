"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import BlogCard from "@/components/pages/blogs/blog-card";
import { Button } from "@/components/ui/button";

export function BlogSection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Popular
          </span>{" "}
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Blog Posts
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
          asChild
        >
          <Link href="/explore">
            <span className="relative z-10 flex items-center gap-2">
              <span>View More</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </section>
  );
}

export const destinations = [
  {
    title: "Ultimate Guide to Bali",
    excerpt:
      "Discover hidden gems and local secrets in this comprehensive guide to Bali's most enchanting locations...",
    image:
      "https://images.pexels.com/photos/2166608/pexels-photo-2166608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    readTime: "8 min read",
    category: "Travel Guide",
    publishedAt: "2 days ago",
    likes: 234,
    author: {
      name: "Julia Jablonska",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    comments: 28,
  },
  {
    title: "Santorini: A Photographer's Paradise",
    excerpt:
      "Learn the best spots and times to capture breathtaking photos in the iconic Greek islands...",
    image:
      "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    readTime: "6 min read",
    category: "Photography",
    publishedAt: "1 week ago",
    likes: 189,
    author: {
      name: "John Doe",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    comments: 42,
  },
  {
    title: "Traditional Gardens of Kyoto",
    excerpt:
      "Explore the serene beauty and hidden meanings behind Kyoto's most famous traditional gardens...",
    image:
      "https://images.pexels.com/photos/1822605/pexels-photo-1822605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    readTime: "5 min read",
    category: "Culture",
    publishedAt: "3 days ago",
    likes: 156,
    author: {
      name: "Jane Smith",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    comments: 35,
  },
];

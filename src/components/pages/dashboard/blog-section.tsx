"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { ChevronRight, Heart, MessageSquare } from "lucide-react";

import { type ItemVariants } from "@/components/pages/dashboard";
import { Button } from "@/components/ui/button";

interface BlogSectionProps {
  variants: ItemVariants;
}

export function BlogSection({ variants }: BlogSectionProps) {
  return (
    <motion.div variants={variants}>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Popular
          </span>{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Blog Posts
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>View More</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((post, index) => (
          <BlogCard key={index} post={post} variants={variants} />
        ))}
      </div>
    </motion.div>
  );
}

function BlogCard({
  post,
  variants,
}: {
  post: (typeof destinations)[0];
  variants: ItemVariants;
}) {
  return (
    <motion.div
      variants={variants}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/95 transition-all hover:border-primary/20 hover:shadow-[0_0_1rem_-0.25rem] hover:shadow-primary/20 dark:from-card/95 dark:to-card dark:hover:shadow-primary/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category badge */}
        <div className="absolute left-4 top-4">
          <div className="inline-flex rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm transition-colors">
            {post.category}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Title and excerpt */}
        <div className="mb-4 flex-1">
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Author and metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{post.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {post.publishedAt}
              </span>
            </div>
          </div>

          {/* Engagement stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {post.comments}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
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

"use client";

import Image from "next/image";

import { type User } from "@auth/core/types";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFirstName } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
};

const destinations = [
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

export default function UserDashboard({ user }: { user: User }) {
  return (
    <motion.div
      className="p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/90 dark:to-background"
      >
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm text-primary dark:bg-primary/20">
              Dashboard Overview
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {getFirstName(user.name!)}!
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Here&apos;s an overview of your travel plans and activities.
            </p>
          </div>

          {/* Decorative illustration */}
          <div className="hidden lg:block">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20" />
              <div className="absolute inset-2 rounded-full bg-primary/20 dark:bg-primary/30" />
              <div className="absolute inset-4 rounded-full bg-primary/30 dark:bg-primary/40" />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="relative border-t border-primary/10 dark:border-primary/20">
          <div className="grid grid-cols-1 divide-y divide-primary/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-primary/20">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-sm text-muted-foreground">
                Upcoming Trips
              </div>
              <div className="mt-1 text-2xl font-semibold">3</div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-sm text-muted-foreground">Blog Posts</div>
              <div className="mt-1 text-2xl font-semibold">7</div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-sm text-muted-foreground">Next Trip</div>
              <div className="mt-1 text-2xl font-semibold">15d</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Itineraries */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Itineraries
            </span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              <span>Create New</span>
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Nepal Adventure",
              remainingDays: 10,
              date: "June 15",
              image:
                "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
            {
              title: "Tokyo Exploration",
              remainingDays: 7,
              date: "August 3",
              image:
                "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
            {
              title: "European Tour",
              remainingDays: 14,
              date: "September 20",
              image:
                "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
          ].map((itinerary) => (
            <motion.div
              key={itinerary.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/95 transition-all hover:border-primary/20 hover:shadow-[0_0_1rem_-0.25rem] hover:shadow-primary/20 dark:from-card/95 dark:to-card dark:hover:shadow-primary/10"
            >
              <div className="relative">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={itinerary.image}
                    alt={itinerary.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75 dark:from-background dark:via-background/80" />

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                      {itinerary.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm transition-colors dark:bg-primary/20 dark:text-primary/90 group-hover:bg-primary/15 dark:group-hover:bg-primary/25">
                        {itinerary.remainingDays} days
                      </div>
                      <time
                        dateTime={itinerary.date.split("Starting ")[1]}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/90"
                      >
                        <div className="h-1 w-1 rounded-full bg-primary/40 dark:bg-primary/30"></div>
                        Starting {itinerary.date}
                      </time>
                    </div>
                  </div>

                  {/* Action button with improved visibility */}
                  <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background/90 dark:bg-background/40 dark:hover:bg-background/50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[160px] animate-in fade-in-0 zoom-in-95"
                      >
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Blog Recommendations */}
      <motion.div variants={itemVariants}>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Featured Blog Posts
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
            <motion.div
              key={index}
              variants={itemVariants}
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

                {/* Category badge - moved to overlay */}
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
                      <span className="text-sm font-medium">
                        {post.author.name}
                      </span>
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
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

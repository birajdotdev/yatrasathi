import Image from "next/image";
import Link from "next/link";

import { Heart, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDaysAgoString } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";

interface BlogCardProps {
  blog: RouterOutputs["blog"]["getUserPosts"]["posts"][number];
}

export default function BlogCard({
  blog: { author, commentsCount, post, likesCount },
}: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-linear-to-br from-card to-card/95 transition-all hover:border-primary/20 hover:shadow-[0_0_1rem_-0.25rem] hover:shadow-primary/20 dark:from-card/95 dark:to-card dark:hover:shadow-primary/10"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={post?.featuredImage ?? ""}
          alt={post.title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category badge */}
        <div className="absolute left-4 top-4">
          <div className="inline-flex rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-xs transition-colors capitalize">
            {post.category?.split("_").join(" ")}
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
            <Avatar>
              <AvatarImage src={author?.image ?? ""} alt={author?.name} />
              <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{author?.name}</span>
              <span className="text-xs text-muted-foreground">
                {getDaysAgoString(post.createdAt, post.updatedAt)}
              </span>
            </div>
          </div>

          {/* Engagement stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

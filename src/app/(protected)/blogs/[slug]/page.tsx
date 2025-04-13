"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CalendarIcon,
  Clock,
  Edit2,
  Heart,
  MessageSquare,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { BlogComments } from "@/components/pages/blogs/blog-comments";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBlogBySlug,
  useCheckLiked,
  useCountLikes,
  useDeleteBlog,
  useToggleLike,
} from "@/lib/api/blog";
import { cn } from "@/lib/utils";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data: blog, isLoading, error } = useBlogBySlug(slug);
  const { data: likeStatus } = useCheckLiked(blog?.id ?? 0);
  const { data: likesCount } = useCountLikes(blog?.id ?? 0);

  const toggleLike = useToggleLike();
  const deleteBlog = useDeleteBlog();

  // Handle loading state
  if (isLoading) {
    return <BlogDetailsSkeleton />;
  }

  // Handle error state
  if (error || !blog) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="mb-4 text-2xl font-bold">Blog Post Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The blog post you are looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/blogs">Back to Blogs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleLike = () => {
    toggleLike.mutate({ blogId: blog.id });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    deleteBlog.mutate(
      { id: blog.id },
      {
        onSuccess: () => {
          toast.success("Blog deleted", {
            description: "Your blog post has been deleted successfully",
          });
          router.push("/blogs");
        },
        onError: () => {
          toast.error("Failed to delete blog post");
          setIsDeleting(false);
        },
      }
    );
  };

  const isAuthor = true; // Replace with actual check once auth is integrated

  return (
    <div className="container mx-auto py-6 lg:py-10">
      {/* Blog Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link
                href="/blogs"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Blogs
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium">
                {"Travel"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {blog.title}
            </h1>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Blog actions</span>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/blogs/edit/${blog.id}`}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={blog.createdAt?.toString()}>
              {new Date(blog.createdAt ?? new Date()).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {Math.ceil((blog.content?.length || 0) / 1000)} min read
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{blog.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Author */}
      <div className="mb-8 flex items-center">
        <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={blog.author?.image ?? "/images/avatar-placeholder.jpg"}
            alt={blog.author?.name ?? "Author"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{blog.author?.name || "Anonymous"}</p>
          <p className="text-sm text-muted-foreground">Author</p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg dark:prose-invert mx-auto mb-10 max-w-3xl">
        {blog.content ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          <p className="italic text-muted-foreground">No content available.</p>
        )}
      </div>

      {/* Actions */}
      <Card className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                likeStatus?.liked && "text-rose-500"
              )}
              onClick={handleToggleLike}
              disabled={toggleLike.isPending}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  likeStatus?.liked && "fill-rose-500 text-rose-500"
                )}
              />
              <span>{likesCount?.count ?? 0} likes</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                // Scroll to comments
                document.getElementById("comments")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{blog.comments?.length || 0} comments</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Blog post link copied to clipboard");
              }}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <div id="comments" className="mx-auto max-w-3xl">
        <Separator className="mb-8" />
        <BlogComments 
          blogId={blog.id} 
          comments={(blog.comments ?? []).map(comment => ({
            ...comment,
            createdAt: comment.createdAt ?? new Date(), // Ensure createdAt is never null
            author: {
              ...comment.author,
              image: comment.author.image ?? undefined // Convert null to undefined for compatibility
            }
          }))} 
        />
      </div>
    </div>
  );
}

function BlogDetailsSkeleton() {
  return (
    <div className="container mx-auto py-6 lg:py-10">
      <div className="mb-8">
        <Skeleton className="mb-2 h-4 w-20" />
        <Skeleton className="mb-4 h-10 w-3/4" />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Skeleton className="mb-8 aspect-video w-full rounded-xl" />

      <div className="mb-8 flex items-center">
        <Skeleton className="mr-4 h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="mx-auto mb-10 max-w-3xl space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="mx-auto mb-10 max-w-3xl">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      <div className="mx-auto max-w-3xl">
        <Skeleton className="mb-8 h-px w-full" />
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

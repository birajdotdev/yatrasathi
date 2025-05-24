"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { Edit, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";

export default function ThreeDotsMenu() {
  const utils = api.useUtils();
  const params: { slug: string } = useParams();
  const { sessionClaims } = useAuth();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const [blogPost] = api.blog.getPostBySlug.useSuspenseQuery({
    slug: params.slug,
  });

  const { mutate: deletePost } = api.blog.deletePost.useMutation({
    onMutate: () => {
      toast.loading("Deleting post...");
    },
    onSuccess: async () => {
      await Promise.all([
        void utils.blog.getUserPosts.invalidate(),
        void utils.blog.getPostsByCategory.invalidate(),
      ]);
      router.push("/blogs");
      toast.dismiss();
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to delete post");
      console.error(error);
    },
  });

  const { mutate: publishPost } = api.blog.updatePost.useMutation({
    onMutate: () => {
      toast.loading("Publishing post...");
    },
    onSuccess: async () => {
      await Promise.all([
        void utils.blog.getPostBySlug.invalidate({ slug: params.slug }),
        void utils.blog.getUserPosts.invalidate(),
        void utils.blog.getPostsByCategory.invalidate(),
      ]);
      router.refresh();
      toast.dismiss();
      toast.success("Post published successfully");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to publish post");
      console.error(error);
    },
  });

  const isDraft = blogPost!.post.status === "draft";
  const isAuthor = blogPost!.post.authorId === sessionClaims?.dbId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isDraft && isAuthor && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  publishPost({
                    id: blogPost!.post.id,
                    status: "published",
                  })
                }
              >
                <Send />
                Publish Post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href={`/blogs/${params.slug}/edit`}>
              <Edit />
              Edit Post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="text-destructive" />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePost({ id: blogPost!.post.id })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

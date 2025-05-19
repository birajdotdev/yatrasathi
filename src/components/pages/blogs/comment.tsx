import { useAuth } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { Trash2 } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type RouterOutputs, api } from "@/trpc/react";

interface CommentProps {
  comment: RouterOutputs["blog"]["getPostComments"]["comments"][number];
  user: UserResource | null | undefined;
  postId: string;
}

export default function Comment({ comment, user, postId }: CommentProps) {
  const { sessionClaims } = useAuth();
  const utils = api.useUtils();
  const deleteCommentMutation = api.blog.deleteComment.useMutation({
    onSuccess: () => {
      void utils.blog.getPostComments.invalidate({ postId });
    },
    onError: (error) => {
      toast.error("Failed to delete comment");
      console.error(error.message);
    },
  });
  const isAuthor = user && comment.author?.id === sessionClaims?.dbId;
  return (
    <div className="group flex gap-4 p-4 rounded-lg bg-muted/50 relative">
      <Avatar>
        <AvatarImage
          src={comment.author?.image ?? ""}
          alt={comment.author?.name}
        />
        <AvatarFallback>{comment.author?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{comment.author?.name}</span>
          <span className="text-xs text-muted-foreground">
            {comment.comment.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm">{comment.comment.content}</p>
      </div>
      {isAuthor && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hidden group-hover:flex absolute top-2 right-2 h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-primary"
              aria-label="Delete comment"
              disabled={deleteCommentMutation.isPending}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() =>
                  deleteCommentMutation.mutate({ id: comment.comment.id })
                }
                disabled={deleteCommentMutation.isPending}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-muted/50 relative">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-full max-w-xs" />
      </div>
    </div>
  );
}

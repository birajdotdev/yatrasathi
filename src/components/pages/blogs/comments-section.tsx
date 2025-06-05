"use client";

import React, { Suspense } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { api } from "@/trpc/react";

import Comment, { CommentSkeleton } from "./comment";
import CommentForm from "./comment-form";

interface CommentsSectionProps {
  postId: string;
  commentInputRef?: React.Ref<HTMLTextAreaElement>;
}

export default function CommentsSection({
  postId,
  commentInputRef,
}: CommentsSectionProps) {
  const [{ comments }] = api.blog.getPostComments.useSuspenseQuery({
    postId,
  });
  const { data: session } = authClient.useSession();

  return (
    <div className="mt-10">
      <h3 className="mb-6 text-xl font-bold">Comments ({comments.length})</h3>

      <Suspense
        fallback={
          <div className="mb-8 space-y-4">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        }
      >
        <ErrorBoundaryWrapper fallbackMessage="Error loading comments">
          <div className="mb-8 space-y-4">
            {comments.length === 0 ? (
              <p className="py-5 text-center text-sm text-muted-foreground">
                No comments yet
              </p>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.comment.id}
                  comment={comment}
                  postId={postId}
                />
              ))
            )}
          </div>
        </ErrorBoundaryWrapper>
      </Suspense>

      <Separator className="my-6" />

      <div className="rounded-lg bg-muted/30 p-6" id="comments-section">
        <h4 className="mb-4 font-medium">Add a comment</h4>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={session?.user.image ?? ""}
              alt={session?.user.name ?? ""}
            />
            <AvatarFallback>
              {getInitials(session?.user.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <CommentForm ref={commentInputRef} postId={postId} />
        </div>
      </div>
    </div>
  );
}

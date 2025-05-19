"use client";

import React, { Suspense } from "react";

import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Separator } from "@/components/ui/separator";
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

  const { user } = useUser();

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>

      <Suspense
        fallback={
          <div className="space-y-4 mb-8">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        }
      >
        <ErrorBoundaryWrapper fallbackMessage="Error loading comments">
          <div className="space-y-4 mb-8">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-5">
                No comments yet
              </p>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.comment.id}
                  comment={comment}
                  user={user}
                  postId={postId}
                />
              ))
            )}
          </div>
        </ErrorBoundaryWrapper>
      </Suspense>

      <Separator className="my-6" />

      <div className="bg-muted/30 p-6 rounded-lg" id="comments-section">
        <h4 className="font-medium mb-4">Add a comment</h4>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={user?.imageUrl ?? ""}
              alt={user?.fullName ?? ""}
            />
            <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <CommentForm ref={commentInputRef} postId={postId} />
        </div>
      </div>
    </div>
  );
}

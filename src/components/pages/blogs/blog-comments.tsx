"use client";

import Image from "next/image";
import { useState } from "react";

import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment, useDeleteComment } from "@/lib/api/blog";
import { cn } from "@/lib/utils";

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    image?: string;
  };
  authorId: string;
}

interface BlogCommentsProps {
  blogId: number;
  comments: Comment[];
}

export function BlogComments({ blogId, comments }: BlogCommentsProps) {
  const [newComment, setNewComment] = useState("");

  const addComment = useAddComment();
  const deleteComment = useDeleteComment();

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment.mutate(
      {
        blogId,
        content: newComment,
      },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added", {
            description: "Your comment has been added successfully",
          });
        },
        onError: () => {
          toast.error("Failed to add comment");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment.mutate(
      { id: commentId },
      {
        onSuccess: () => {
          toast.success("Comment deleted", {
            description: "Comment has been deleted successfully",
          });
        },
        onError: () => {
          toast.error("Failed to delete comment");
        },
      }
    );
  };

  const currentUserId = ""; // Replace with actual user ID once auth is integrated

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h2>

      {/* Add Comment Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Add a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-32"
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || addComment.isPending}
            className="flex items-center gap-2"
          >
            {addComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Post Comment
          </Button>
        </CardFooter>
      </Card>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={
                          comment.author.image ??
                          "/images/avatar-placeholder.jpg"
                        }
                        alt={comment.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{comment.author.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {currentUserId === comment.authorId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deleteComment.isPending}
                      className={cn(
                        "text-muted-foreground hover:text-destructive",
                        deleteComment.isPending && "opacity-50"
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete comment</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border p-6 text-center">
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
}

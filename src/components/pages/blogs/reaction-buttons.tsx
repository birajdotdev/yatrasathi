"use client";

import { startTransition, useOptimistic } from "react";

import { Heart, MessageSquare, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

interface ReactionButtonsProps {
  postId: string;
  onCommentClick?: () => void;
}

type LikeStatus = { liked: boolean };

export default function ReactionButtons({
  postId,
  onCommentClick,
}: ReactionButtonsProps) {
  const utils = api.useUtils();
  const [{ liked }] = api.blog.checkLikeStatus.useSuspenseQuery({ postId });
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);

  const toggleLike = api.blog.toggleLike.useMutation({
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.blog.checkLikeStatus.cancel({ postId });

      // Snapshot the previous value
      const previous = utils.blog.checkLikeStatus.getData({ postId }) as
        | LikeStatus
        | undefined;

      // Optimistically update the cache
      utils.blog.checkLikeStatus.setData({ postId }, (old) => {
        if (!old) return { liked: !liked };
        return { ...old, liked: !old.liked };
      });

      // Return context for rollback
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        utils.blog.checkLikeStatus.setData({ postId }, context.previous);
      }
    },
    onSettled: () => {
      void utils.blog.checkLikeStatus.invalidate({ postId });
    },
  });

  const handleLike = () => {
    startTransition(() => {
      setOptimisticLiked((prev) => !prev);
    });
    toggleLike.mutate({ postId });
  };

  return (
    <div className="md:col-span-1 order-2 md:order-1 z-50">
      <div className="md:sticky md:top-24 flex md:flex-col gap-4 justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 border"
          onClick={handleLike}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${optimisticLiked ? "fill-red-500 text-red-500 scale-125" : "scale-100"}`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 border"
          onClick={onCommentClick}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 border"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

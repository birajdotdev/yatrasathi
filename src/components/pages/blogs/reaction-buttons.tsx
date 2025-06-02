"use client";

import { startTransition, useOptimistic, useState } from "react";

import { Heart, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

interface ReactionButtonsProps {
  postId: string;
  onCommentClick?: () => void;
  postUrl: string;
}

type LikeStatus = { liked: boolean };

export default function ReactionButtons({
  postId,
  onCommentClick,
  postUrl,
}: ReactionButtonsProps) {
  const utils = api.useUtils();
  const [{ liked }] = api.blog.checkLikeStatus.useSuspenseQuery({ postId });
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post!",
          url: postUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      setShareDialogOpen(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  // Social share URLs
  const encodedUrl = encodeURIComponent(postUrl);
  const twitterUrl = `https://x.com/intent/tweet?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodedUrl}`;

  return (
    <div className="z-50 order-2 md:order-1 md:col-span-1">
      <div className="flex justify-center gap-4 md:sticky md:top-24 md:flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full border"
          onClick={handleLike}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${optimisticLiked ? "scale-125 fill-red-500 text-red-500" : "scale-100"}`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full border"
          onClick={onCommentClick}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full border"
            onClick={handleShare}
            aria-label="Share post"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <DialogContent>
            <DialogTitle>Share this post</DialogTitle>
            <DialogDescription>
              Share this post with others using the options below.
            </DialogDescription>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={postUrl}
                  readOnly
                  onFocus={(e) => e.target.select()}
                  disabled
                />
                <Button size="sm" onClick={handleCopy}>
                  Copy
                </Button>
              </div>
              <div className="mt-2 flex justify-center gap-4">
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="rounded-full bg-black p-3 transition-colors hover:bg-gray-800 focus:outline focus:outline-offset-2 focus:outline-black"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="rounded-full bg-[#1877f2] p-3 transition-colors hover:bg-[#145db2] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1877f2]"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                  </svg>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="rounded-full bg-[#25d366] p-3 transition-colors hover:bg-[#1da851] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#25d366]"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.366.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.994c-.003 5.455-4.438 9.89-9.894 9.89m8.413-18.304A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.057 12.086c0 2.13.557 4.21 1.615 6.033L0 24l6.064-1.594a11.888 11.888 0 0 0 5.983 1.527h.005c6.554 0 11.89-5.435 11.893-12.086a11.82 11.82 0 0 0-3.48-8.651" />
                  </svg>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

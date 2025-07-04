"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { type PartialBlock } from "@blocknote/core";
import { ArrowLeft, Calendar } from "lucide-react";

import { Editor } from "@/components/editor";
import CommentsSection from "@/components/pages/blogs/comments-section";
import ReactionButtons from "@/components/pages/blogs/reaction-buttons";
import ThreeDotsMenu from "@/components/pages/blogs/three-dots-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";
import { getDaysAgoString, splitStringByWords } from "@/lib/utils";
import { type RouterOutputs, api } from "@/trpc/react";

interface PostClientProps {
  blog: RouterOutputs["blog"]["getPostBySlug"];
}

export default function PostClient({ blog }: PostClientProps) {
  const { post, author } = blog!;
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const handleCommentClick = () => {
    document
      .getElementById("comments-section")
      ?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 300);
  };

  const [title, subtitle] = splitStringByWords(post.title);
  const [user] = api.user.getCurrentUser.useSuspenseQuery();
  const isAuthor = author?.id === user?.id;
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group rounded-full"
          >
            <Link href="/blogs">
              <ArrowLeft className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to posts
            </Link>
          </Button>
        </div>

        <h1 className="mt-6 mb-6 text-4xl leading-tight font-bold">
          {title} <span className="text-primary">{subtitle}</span>
        </h1>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={author?.image ?? ""} alt={author?.name} />
              <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{author?.name}</div>
              <div className="text-sm text-muted-foreground">
                {getDaysAgoString(post.createdAt, post.updatedAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {post.updatedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {isAuthor && <ThreeDotsMenu />}
          </div>
        </div>

        <div className="mb-10 aspect-[2/1] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={post.featuredImage ?? ""}
            alt={post.title}
            className="h-full w-full object-cover"
            width={1000}
            height={1000}
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <ReactionButtons
          postId={post.id}
          onCommentClick={handleCommentClick}
          postUrl={`${env.NEXT_PUBLIC_BASE_URL}/blogs/${post.slug}`}
        />
        <div className="order-1 md:order-2 md:col-span-11">
          <Editor
            initialContent={post.content as PartialBlock[]}
            editable={false}
          />
          <Separator className="my-6" />
          <CommentsSection postId={post.id} commentInputRef={commentInputRef} />
        </div>
      </div>
    </main>
  );
}

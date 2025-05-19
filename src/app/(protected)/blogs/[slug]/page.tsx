import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { type PartialBlock } from "@blocknote/core";
import { ArrowLeft, Calendar, CalendarPlus } from "lucide-react";

import { Editor } from "@/components/editor";
import CommentsSection from "@/components/pages/blogs/comments-section";
import ReactionButtons from "@/components/pages/blogs/reaction-buttons";
import ThreeDotsMenu from "@/components/pages/blogs/three-dots-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDaysAgoString, splitStringByWords } from "@/lib/utils";
import { HydrateClient, api } from "@/trpc/server";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const blog = await api.blog.getPostBySlug({ slug });
  if (!blog) notFound();

  const { post, author } = blog;
  void api.blog.checkLikeStatus.prefetch({ postId: post.id });

  const [title, subtitle] = splitStringByWords(post.title);

  return (
    <HydrateClient>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-full"
            >
              <Link href="/posts">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Badge variant="outline" className="rounded-full">
              {post.category}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {title} <span className="text-primary">{subtitle}</span>
          </h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={author?.image ?? ""} alt={author?.name} />
                <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
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
                {post.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarPlus className="mr-1 h-4 w-4" />
                {post.updatedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <ThreeDotsMenu />
            </div>
          </div>

          <div className="aspect-[2/1] w-full bg-muted rounded-xl overflow-hidden mb-10">
            <Image
              src={post.featuredImage ?? ""}
              alt={post.title}
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <ReactionButtons postId={post.id} />

          <div className="md:col-span-11 order-1 md:order-2">
            {/* <article
            className="prose prose-lg max-w-none mb-10 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          /> */}
            <Editor
              initialContent={post.content as PartialBlock[]}
              editable={false}
            />
            <Separator className="my-6" />
            <CommentsSection />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

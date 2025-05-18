import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { type PartialBlock } from "@blocknote/core";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Share2,
  ThumbsUp,
} from "lucide-react";

import { Editor } from "@/components/editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const blogPost = await api.blog.getPostBySlug({ slug });
  if (!blogPost) notFound();

  const { post, likesCount, commentsCount } = blogPost;

  const author = await api.user.getUserById({ id: post.authorId });
  if (!author) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all posts
            </Link>
          </Button>

          <Badge className="mb-4">{post.category}</Badge>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src={author.image!} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{author.name}</div>
              <div className="text-sm text-muted-foreground">{author.role}</div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground ml-auto">
              <Calendar className="mr-1 h-4 w-4" />
              {post.createdAt.toLocaleDateString()}
            </div>
          </div>

          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-8">
            <Image
              src={post.featuredImage!}
              alt={post.title}
              className="w-full h-full object-cover"
              width={800}
              height={400}
            />
          </div>
        </div>

        {/* <BlockRender content={post.content as PartialBlock[]} /> */}
        <Editor
          initialContent={post.content as PartialBlock[]}
          editable={false}
        />

        <div className="border-t pt-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like ({likesCount})
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment ({commentsCount})
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

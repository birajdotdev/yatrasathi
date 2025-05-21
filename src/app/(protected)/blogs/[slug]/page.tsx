import { notFound } from "next/navigation";

import { HydrateClient, api } from "@/trpc/server";

import PostClient from "./post-client";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: PostPageProps) => {
  const { slug } = await params;
  const blog = await api.blog.getPostBySlug({ slug });
  if (!blog) notFound();
  return {
    title: blog.post.title,
    description: blog.post.excerpt,
    openGraph: {
      title: blog.post.title,
      description: blog.post.excerpt,
      images: blog.post.featuredImage,
    },
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const blog = await api.blog.getPostBySlug({ slug });
  if (!blog) notFound();

  const { post } = blog;
  await Promise.all([
    void api.blog.getPostBySlug.prefetch({ slug }),
    void api.blog.checkLikeStatus.prefetch({ postId: post.id }),
    void api.blog.getPostComments.prefetch({ postId: post.id }),
  ]);

  return (
    <HydrateClient>
      <PostClient blog={blog} />
    </HydrateClient>
  );
}

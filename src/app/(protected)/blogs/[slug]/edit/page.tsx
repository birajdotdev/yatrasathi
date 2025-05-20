import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { type PartialBlock } from "@blocknote/core";

import { BlogForm } from "@/components/pages/blogs";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description: "Edit your blog post to share with the community",
};

interface UpdateBlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function UpdateBlogPage({ params }: UpdateBlogPageProps) {
  const { slug } = await params;
  const [_, blogPost] = await Promise.all([
    api.blog.getCategories.prefetch(),
    api.blog.getPostBySlug({ slug }),
  ]);
  if (!blogPost) notFound();

  const { post } = blogPost;

  return (
    <section className="container mx-auto p-6 lg:p-8">
      <BlogForm
        initialValues={{
          id: post.id,
          title: post.title,
          content: post.content as PartialBlock[],
          category: post.category,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          status: post.status,
        }}
      />
    </section>
  );
}

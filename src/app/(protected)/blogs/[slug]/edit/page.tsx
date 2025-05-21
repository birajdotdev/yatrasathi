import { type Metadata } from "next";

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
  await Promise.all([
    void api.blog.getCategories.prefetch(),
    void api.blog.getPostBySlug.prefetch({ slug }),
  ]);

  return (
    <section className="container mx-auto p-6 lg:p-8">
      <BlogForm mode="edit" slug={slug} />
    </section>
  );
}

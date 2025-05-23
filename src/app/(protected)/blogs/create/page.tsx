import { type Metadata } from "next";

import { BlogForm } from "@/components/pages/blogs";
import { HydrateClient, api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create New Blog",
  description: "Create a new blog post to share with the community",
};

export default async function CreateBlogPage() {
  void api.blog.getCategories.prefetch();
  return (
    <HydrateClient>
      <section className="container mx-auto p-6 lg:p-8">
        <BlogForm />
      </section>
    </HydrateClient>
  );
}

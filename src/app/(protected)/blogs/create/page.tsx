import { type Metadata } from "next";

import { BlogForm } from "@/components/pages/blogs";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Create New Blog",
  description: "Create a new blog post to share with the community",
};

export default function CreateBlogPage() {
  void api.blog.getCategories.prefetch();
  return (
    <section className="container mx-auto p-6 lg:p-8">
      <BlogForm />
    </section>
  );
}

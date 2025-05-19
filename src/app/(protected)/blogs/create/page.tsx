import { BlogForm } from "@/components/pages/blogs";
import { api } from "@/trpc/server";

export default function CreateBlogPage() {
  void api.blog.getCategories.prefetch();
  return (
    <section className="container mx-auto p-6 lg:p-8">
      <BlogForm />
    </section>
  );
}

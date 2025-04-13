"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import RichTextEditor from "@/components/pages/blogs/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBlog } from "@/lib/api/blog";

const blogFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  excerpt: z
    .string()
    .min(10, {
      message: "Excerpt must be at least 10 characters long",
    })
    .max(200, {
      message: "Excerpt must not exceed 200 characters",
    }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters long",
  }),
  featuredImage: z
    .string()
    .url({
      message: "Featured image must be a valid URL",
    })
    .optional(),
  category: z.string().optional(),
  isPublished: z.boolean().default(true),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function CreateBlogPage() {
  const router = useRouter();

  const createBlog = useCreateBlog();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "",
      isPublished: true,
    },
  });

  const onSubmit = (data: BlogFormValues) => {
    createBlog.mutate(
      {
        ...data,
        // Generate a slug from the title if not provided
        slug: data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      },
      {
        onSuccess: (blog) => {
          toast.success("Blog created", {
            description: "Your blog post has been created successfully",
          });
          if (blog?.slug) {
            router.push(`/blogs/${blog.slug}`);
          } else {
            router.push("/blogs");
          }
        },
        onError: () => {
          toast.error("Error", {
            description: "Failed to create blog post. Please try again.",
          });
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-6 lg:py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        </div>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={createBlog.isPending}
          className="flex items-center gap-2"
        >
          {createBlog.isPending ? (
            <>Publishing...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Publish
            </>
          )}
        </Button>
      </div>

      <Separator className="mb-8" />

      <div className="mx-auto max-w-3xl">
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a captivating title for your blog post"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The title will be displayed at the top of your blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a short summary of your blog post"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed in blog listings and social shares
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main image displayed at the top of your blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. Travel, Adventure, Culture"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Helps readers discover your content by topic
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

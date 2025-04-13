"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronLeft, Loader2, Save } from "lucide-react";
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
import { useUpdateBlog } from "@/lib/api/blog";
import { api } from "@/trpc/react";

// Match the schema defined in server/db/schema/blog.ts
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
    })
    .nullable(),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters long",
  }),
  featuredImage: z
    .string()
    .url({
      message: "Featured image must be a valid URL",
    })
    .optional()
    .nullable(),
  isPublished: z.boolean().default(true).nullable(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const router = useRouter();

  const updateBlog = useUpdateBlog();
  const {
    data: blog,
    isLoading,
    error,
  } = api.blog.getById.useQuery(
    { id },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Handle query error
  useEffect(() => {
    if (error && error instanceof Error) {
      toast.error("Error", {
        description: error.message,
      });
    }
  }, [error]);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      isPublished: true,
    },
  });

  // Populate form with blog data when loaded
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        excerpt: blog.excerpt ?? "",
        content: blog.content,
        featuredImage: blog.featuredImage,
        isPublished: blog.isPublished ?? true,
      });
    }
  }, [blog, form]);

  const onSubmit = (data: BlogFormValues) => {
    if (!blog) return;

    updateBlog.mutate(
      {
        id,
        data,
      },
      {
        onSuccess: (updatedBlog) => {
          toast.success("Blog updated", {
            description: "Your blog post has been updated successfully",
          });
          if (updatedBlog?.slug) {
            router.push(`/blogs/${updatedBlog.slug}`);
          } else {
            router.push("/blogs");
          }
        },
        onError: (submitError) => {
          const errorMessage =
            submitError instanceof Error
              ? submitError.message
              : "Failed to update blog post. Please try again.";

          toast.error("Error", {
            description: errorMessage,
          });
        },
      }
    );
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <h2 className="mt-4 text-xl font-bold">Error loading blog</h2>
        <p className="text-muted-foreground">{errorMessage}</p>
        <Button
          variant="link"
          onClick={() => router.push("/blogs")}
          className="mt-4"
        >
          Return to blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 lg:py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={updateBlog.isPending}
          className="ml-auto"
          type="submit"
        >
          {updateBlog.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
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
                      value={field.value ?? ""}
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
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    The main image displayed at the top of your blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category field removed as it's not in the backend schema */}

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

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      When checked, your blog will be visible to other users
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";

import { type PartialBlock } from "@blocknote/core";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ImageIcon,
  PlusCircleIcon,
  Save,
  Send,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { type z } from "zod";

import { Editor } from "@/components/editor";
import CoverImageDialog from "@/components/pages/itineraries/cover-image-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { postInsertSchema } from "@/lib/schemas/post";
import { api } from "@/trpc/react";

const blogFormSchema = postInsertSchema.pick({
  id: true,
  title: true,
  content: true,
  featuredImage: true,
  category: true,
  excerpt: true,
  status: true,
});

type BlogFormSchema = z.infer<typeof blogFormSchema>;

type BlogFormProps =
  | {
      mode?: "create";
      slug?: string;
    }
  | {
      mode: "edit";
      slug: string;
    };

// Helper to show toast messages for blog post actions
function showBlogToast({
  action,
  status,
}: {
  action: "create" | "edit";
  status: "published" | "draft";
}) {
  if (action === "create") {
    toast.success(
      status === "published"
        ? "Blog post published successfully"
        : "Blog post saved as draft"
    );
  } else {
    toast.success(
      status === "published"
        ? "Blog post updated successfully"
        : "Draft updated successfully"
    );
  }
}

export default function BlogForm({ slug, mode = "create" }: BlogFormProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const isEdit = mode === "edit"; // Check if editing an existing post

  // Fetch categories
  const [categories] = api.blog.getCategories.useSuspenseQuery();

  // Create post mutation
  const createPost = api.blog.createPost.useMutation({
    onMutate: () => {
      toast.loading("Creating blog post..."); // Show loading toast
    },
    onSuccess: async (data) => {
      toast.dismiss(); // Dismiss loading toast
      showBlogToast({ action: "create", status: data.status });
      await Promise.all([
        void utils.blog.getUserPosts.invalidate(),
        void utils.blog.getPostsByCategory.invalidate(),
      ]);
      router.push(`/blogs/${data.slug}`); // Redirect to the new post
    },
    onError: (error) => {
      toast.dismiss(); // Dismiss loading toast
      toast.error(error.message); // Show error toast
    },
  });

  // Update post mutation
  const updatePost = api.blog.updatePost.useMutation({
    onMutate: () => {
      toast.loading("Updating blog post..."); // Show loading toast
    },
    onSuccess: async (data) => {
      toast.dismiss(); // Dismiss loading toast
      showBlogToast({ action: "edit", status: data.status });
      await Promise.all([
        void utils.blog.getUserPosts.invalidate(),
        void utils.blog.getPostBySlug.invalidate({ slug: data.slug }),
        void utils.blog.getPostsByCategory.invalidate(),
      ]);
      router.push(`/blogs/${data.slug}`); // Redirect to the updated post
    },
    onError: (error) => {
      toast.dismiss(); // Dismiss loading toast
      toast.error(error.message); // Show error toast
    },
  });

  const { data: blogPost } = api.blog.getPostBySlug.useQuery(
    { slug: slug! },
    { enabled: isEdit }
  );

  if (isEdit && !blogPost) notFound();

  const initialValues = blogPost?.post;

  const form = useForm<BlogFormSchema>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      id: initialValues?.id ?? undefined,
      featuredImage: initialValues?.featuredImage ?? "",
      title: initialValues?.title ?? "",
      content: Array.isArray(initialValues?.content)
        ? initialValues.content
        : ([] as PartialBlock[]),
      category: initialValues?.category ?? undefined,
      excerpt: initialValues?.excerpt ?? "",
      status: initialValues?.status ?? "draft",
    },
    mode: "onChange",
  });

  const handleSubmit = async (status: "draft" | "published") => {
    const valid = await form.trigger();
    if (!valid) return;
    const values = form.getValues();
    const data = {
      id: values.id,
      title: values.title,
      content: values.content,
      category: values.category ?? "other",
      status,
      featuredImage: values.featuredImage ?? undefined,
      excerpt: values.excerpt ?? "",
    };
    if (isEdit) {
      await updatePost.mutateAsync({ ...data, id: values.id! });
    } else {
      await createPost.mutateAsync(data as typeof postInsertSchema._type);
    }
  };

  // Handle form submission
  const onSubmit = form.handleSubmit(() => handleSubmit("published"));

  const isPublished = initialValues?.status === "published";
  const isButtonDisabled =
    !form.formState.isValid ||
    form.formState.isSubmitting ||
    (isEdit && !form.formState.isDirty);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <input type="hidden" {...form.register("status")} />
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              type="button"
              className="group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isEdit ? (
                <>
                  Edit <span className="text-primary">Blog</span>
                </>
              ) : (
                <>
                  Create <span className="text-primary">New Blog</span>
                </>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isPublished && (
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isButtonDisabled}
              >
                <Save />
                {isEdit ? "Update Draft" : "Save Draft"}
              </Button>
            )}
            <Button type="submit" disabled={isButtonDisabled}>
              <Send />
              {isEdit ? (isPublished ? "Update" : "Publish") : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Section */}
          <Card className="lg:col-span-2 min-h-[calc(100vh-10rem)]">
            <CardContent>
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextareaAutosize
                        placeholder="Untitled"
                        className="text-5xl font-bold resize-none appearance-none overflow-hidden bg-transparent border-none focus:outline-none focus:ring-0 w-full leading-tight"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        initialContent={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Post Settings Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Post <span className="text-primary">Settings</span>
                </CardTitle>
                <CardDescription>Configure your post settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="category">Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="excerpt">Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter post excerpt"
                          className="resize-none"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in post previews
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Cover Image Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Cover <span className="text-primary">Image</span>
                </CardTitle>
                <CardDescription>
                  Upload a cover image for your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col items-center justify-center gap-4">
                        {field.value ? (
                          <figure className="relative aspect-video w-full bg-muted rounded-md overflow-hidden">
                            <Image
                              src={field.value}
                              alt="Cover"
                              fill
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="absolute top-2 right-2 z-10 rounded-full size-6"
                              onClick={() => form.setValue("featuredImage", "")}
                              aria-label="Remove cover image"
                            >
                              <X />
                            </Button>
                          </figure>
                        ) : (
                          <EmptyState
                            icon={ImageIcon}
                            title="No cover image"
                            description="Upload a cover image for your post"
                            className="w-full aspect-video min-h-0 p-0"
                            iconClassName="size-9 p-2"
                            titleClassName="text-sm mt-2"
                            descriptionClassName="text-xs mb-3 mt-1"
                            render={
                              <CoverImageDialog
                                dialogTitle="Choose a Cover Image"
                                onImageSelected={async (imageUrl) => {
                                  form.setValue("featuredImage", imageUrl);
                                  await Promise.resolve();
                                }}
                              >
                                <Button size="sm">
                                  <PlusCircleIcon />
                                  Add Cover Image
                                </Button>
                              </CoverImageDialog>
                            }
                          />
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}

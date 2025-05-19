"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
import { toast } from "sonner";
import { z } from "zod";

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

const blogFormSchema = postInsertSchema
  .pick({
    title: true,
    content: true,
    featuredImage: true,
    category: true,
    excerpt: true,
    status: true,
  })
  .extend({
    id: z.string().optional(),
  });

type BlogFormSchema = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialValues?: Partial<BlogFormSchema>;
}

export default function BlogForm({ initialValues }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialValues?.id);

  const [categories] = api.blog.getCategories.useSuspenseQuery();
  const createPost = api.blog.createPost.useMutation({
    onMutate: () => {
      toast.loading("Creating blog post...");
    },
    onSuccess(data) {
      toast.dismiss();
      toast.success("Blog post created successfully");
      router.push(`/blogs/${data.slug}`);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
  });
  const updatePost = api.blog.updatePost.useMutation({
    onSuccess: (data) => {
      toast.success("Blog post updated successfully");
      router.push(`/blogs/${data.slug}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<BlogFormSchema>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      featuredImage: initialValues?.featuredImage ?? "",
      title: initialValues?.title ?? "",
      content: Array.isArray(initialValues?.content)
        ? initialValues.content
        : ([] as PartialBlock[]),
      category: initialValues?.category ?? undefined,
      excerpt: initialValues?.excerpt ?? undefined,
      status: initialValues?.status ?? "draft",
    },
    mode: "onChange",
  });

  const handleSubmit = async (status: "draft" | "published") => {
    const valid = await form.trigger();
    if (!valid) return;
    const values = form.getValues();
    const data = {
      title: values.title,
      content: values.content,
      category: values.category ?? "other",
      status,
      featuredImage: values.featuredImage ?? undefined,
      excerpt: values.excerpt ?? undefined,
    };
    console.log(data);
    if (isEdit) {
      await updatePost.mutateAsync({ ...data, id: values.id! });
      toast.success("Blog post updated successfully");
    } else {
      await createPost.mutateAsync(data as typeof postInsertSchema._type);
      toast.success(
        status === "draft" ? "Draft saved!" : "Blog post published!"
      );
    }
  };

  const onSubmit = form.handleSubmit(() => handleSubmit("published"));

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
            {initialValues?.status !== "published" && (
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                <Save />
                Save Draft
              </Button>
            )}
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              <Send />
              {isEdit ? "Update" : "Publish"}
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
                      <input
                        placeholder="Untitled"
                        className="text-5xl font-bold resize-none appearance-none overflow-hidden bg-transparent border-none focus:outline-none focus:ring-0"
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

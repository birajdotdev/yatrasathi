"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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

const blogFormSchema = z.object({
  coverImage: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
});

type BlogFormSchema = z.infer<typeof blogFormSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const form = useForm<BlogFormSchema>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      coverImage: "",
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <section className="container mx-auto p-6 lg:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">
                Create <span className="text-primary">New Post</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Save />
                Save Draft
              </Button>
              <Button>
                <Send />
                Publish
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
                        <Editor {...field} />
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
                  <CardDescription>
                    Configure your post settings
                  </CardDescription>
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
                            value={field.value}
                          >
                            <SelectTrigger id="category" className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">
                                Development
                              </SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="content">Content</SelectItem>
                              <SelectItem value="trends">Trends</SelectItem>
                              <SelectItem value="performance">
                                Performance
                              </SelectItem>
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
                    name="coverImage"
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
                                onClick={() => form.setValue("coverImage", "")}
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
                                    form.setValue("coverImage", imageUrl);
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
    </section>
  );
}

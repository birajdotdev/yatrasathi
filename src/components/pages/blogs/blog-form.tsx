"use client";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Editor } from "@/components/editor";
import CoverImageDialog from "@/components/pages/itineraries/cover-image-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Form, FormField } from "@/components/ui/form";

const blogFormSchema = z.object({
  coverImage: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
});

type BlogFormSchema = z.infer<typeof blogFormSchema>;

export default function BlogForm() {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col min-h-[calc(100vh-7rem)]"
      >
        {/* Cover Image Field */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <figure className="w-full min-h-72 mb-8 relative group">
              {field.value ? (
                <div className="bg-muted">
                  <Image
                    src={field.value}
                    alt="Cover Image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <CoverImageDialog
                      onImageSelected={async (imageUrl) => {
                        form.setValue("coverImage", imageUrl);
                        await Promise.resolve();
                      }}
                    >
                      <Button size="sm" variant="secondary">
                        <ImageIcon />
                        Change Cover
                      </Button>
                    </CoverImageDialog>
                    <Button
                      size="sm"
                      onClick={() => form.setValue("coverImage", "")}
                      type="button"
                    >
                      <TrashIcon />
                      Remove Cover
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No Cover Image"
                  description="Add a beautiful cover image to make your blog stand out."
                  icon={ImageIcon}
                  className="border-none rounded-none bg-muted dark:bg-card/50"
                  render={
                    <CoverImageDialog
                      onImageSelected={async (imageUrl) => {
                        form.setValue("coverImage", imageUrl);
                        await Promise.resolve();
                      }}
                    >
                      <Button>
                        <ImageIcon />
                        Add Cover Image
                      </Button>
                    </CoverImageDialog>
                  }
                />
              )}
            </figure>
          )}
        />

        <main className="container mx-auto max-w-4xl w-full flex-1">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <input
                placeholder="Untitled"
                className="text-5xl font-bold resize-none appearance-none overflow-hidden bg-transparent border-none focus:outline-none focus:ring-0"
                {...field}
              />
            )}
          />

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => <Editor {...field} />}
          />
        </main>

        <section>
          <Button type="submit">Publish</Button>
        </section>
      </form>
    </Form>
  );
}

"use client";

import { forwardRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { comments } from "@/server/db/schema";
import { api } from "@/trpc/react";

const commentSchema = createInsertSchema(comments, {
  content: (schema) => schema.min(1),
}).pick({
  content: true,
});
type CommentSchema = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
}

const CommentForm = forwardRef<HTMLTextAreaElement, CommentFormProps>(
  ({ postId }, ref) => {
    const utils = api.useUtils();
    const form = useForm<CommentSchema>({
      resolver: zodResolver(commentSchema),
      defaultValues: {
        content: "",
      },
    });

    const { mutate: createComment, isPending } =
      api.blog.createComment.useMutation({
        onSuccess: () => {
          form.reset();
          void utils.blog.getPostComments.invalidate({ postId });
        },
        onError: (error) => {
          toast.error("Failed to post comment");
          console.error(error.message);
        },
      });

    const onSubmit = (data: CommentSchema) => {
      createComment({
        postId,
        content: data.content,
      });
    };

    return (
      <Form {...form}>
        <form
          className="flex-1 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormControl>
                <Textarea
                  placeholder="Write your comment..."
                  className="min-h-[100px] bg-background"
                  {...field}
                  ref={ref}
                />
              </FormControl>
            )}
          />
          <Button size="sm" disabled={!form.formState.isValid || isPending}>
            {!isPending ? <Send /> : <Loader2 className="animate-spin" />}
            Post Comment
          </Button>
        </form>
      </Form>
    );
  }
);

CommentForm.displayName = "CommentForm";

export default CommentForm;

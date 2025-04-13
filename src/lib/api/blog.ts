import { api } from "@/trpc/react";

export function useAllBlogs(limit = 10) {
  return api.blog.getAll.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}

export function useRecentBlogs(limit = 10) {
  return api.blog.getRecent.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}

export function usePopularBlogs(limit = 10) {
  return api.blog.getPopular.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}

export function useMyBlogs(limit = 10) {
  return api.blog.getMyBlogs.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}

export function useBlogBySlug(slug: string) {
  return api.blog.getBySlug.useQuery({ slug });
}

export function useCreateBlog() {
  const utils = api.useUtils();

  return api.blog.create.useMutation({
    onSuccess: () => {
      void utils.blog.getAll.invalidate();
    },
  });
}

export function useUpdateBlog() {
  const utils = api.useUtils();

  return api.blog.update.useMutation({
    onSuccess: () => {
      void utils.blog.getAll.invalidate();
    },
  });
}

export function useDeleteBlog() {
  const utils = api.useUtils();

  return api.blog.delete.useMutation({
    onSuccess: () => {
      void utils.blog.getAll.invalidate();
    },
  });
}

export function useAddComment() {
  const utils = api.useUtils();

  return api.blog.addComment.useMutation({
    onSuccess: () => {
      // Invalidate the specific blog that was commented on
      void utils.blog.getBySlug.invalidate();
    },
  });
}

export function useDeleteComment() {
  const utils = api.useUtils();

  return api.blog.deleteComment.useMutation({
    onSuccess: () => {
      void utils.blog.getBySlug.invalidate();
    },
  });
}

export function useToggleLike() {
  const utils = api.useUtils();

  return api.blog.toggleLike.useMutation({
    onSuccess: (_data, variables) => {
      void utils.blog.checkLiked.invalidate({ blogId: variables.blogId });
      void utils.blog.countLikes.invalidate({ blogId: variables.blogId });
    },
  });
}

export function useCheckLiked(blogId: number) {
  return api.blog.checkLiked.useQuery({ blogId });
}

export function useCountLikes(blogId: number) {
  return api.blog.countLikes.useQuery({ blogId });
}

import { and, desc, eq, lt, inArray } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { blogs, comments, insertBlogSchema, insertCommentSchema, likes } from "@/server/db/schema/blog";
import { TRPCError } from "@trpc/server";

export const blogRouter = createTRPCRouter({
  // Get all published blogs with pagination
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      try {
        const items = await ctx.db.query.blogs.findMany({
          where: cursor 
            ? and(eq(blogs.isPublished, true), lt(blogs.id, cursor))
            : eq(blogs.isPublished, true),
          orderBy: [desc(blogs.createdAt)],
          limit: limit + 1,
          with: {
            author: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch blogs: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Get recent blogs with pagination
  getRecent: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      try {
        const items = await ctx.db.query.blogs.findMany({
          where: cursor 
            ? and(eq(blogs.isPublished, true), lt(blogs.id, cursor))
            : eq(blogs.isPublished, true),
          orderBy: [desc(blogs.createdAt)],
          limit: limit + 1,
          with: {
            author: true,
            comments: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch recent blogs: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Get popular blogs with pagination (sorted by like count)
  getPopular: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      try {
        // First get all blog IDs with their like counts
        const blogLikes = await ctx.db.query.blogs.findMany({
          where: eq(blogs.isPublished, true),
          with: {
            likes: true,
          },
        });
        
        // Sort blogs by like count
        const sortedBlogs = blogLikes
          .map(blog => ({ 
            id: blog.id, 
            likeCount: blog.likes?.length || 0 
          }))
          .sort((a, b) => b.likeCount - a.likeCount);
        
        // Get cursor index if cursor is specified
        const cursorIndex = cursor 
          ? sortedBlogs.findIndex(b => b.id === cursor)
          : -1;
          
        // Handle pagination based on cursor
        const paginatedBlogIds = sortedBlogs
          .slice(
            cursorIndex > -1 ? cursorIndex + 1 : 0,
            cursorIndex > -1 ? cursorIndex + 1 + limit : limit + 1
          )
          .map(b => b.id);
          
        if (paginatedBlogIds.length === 0) {
          return { items: [], nextCursor: undefined };
        }
        
        // Now fetch the full blog data for these IDs
        const items = await ctx.db.query.blogs.findMany({
          where: inArray(blogs.id, paginatedBlogIds),
          with: {
            author: true,
            comments: true,
            likes: true,
          },
        });
        
        // Sort fetched blogs to match the order of paginatedBlogIds
        const sortedItems = paginatedBlogIds
          .map(id => items.find(item => item.id === id))
          .filter(Boolean) as typeof items;

        let nextCursor: typeof cursor | undefined = undefined;
        if (sortedItems.length > limit) {
          const nextItem = sortedItems.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: sortedItems,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch popular blogs: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Get blogs by current logged-in user
  getMyBlogs: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }
      
      try {
        const items = await ctx.db.query.blogs.findMany({
          where: cursor 
            ? and(eq(blogs.authorId, ctx.session.user.dbId), lt(blogs.id, cursor))
            : eq(blogs.authorId, ctx.session.user.dbId),
          orderBy: [desc(blogs.createdAt)],
          limit: limit + 1,
          with: {
            author: true,
            comments: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch your blogs: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Get a single blog by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const blog = await ctx.db.query.blogs.findFirst({
          where: eq(blogs.id, input.id),
          with: {
            author: true,
            comments: {
              with: {
                author: true,
              },
              orderBy: [desc(comments.createdAt)],
            },
          },
        });
        
        if (!blog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }
        
        return blog;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch blog: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Get a single blog by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const blog = await ctx.db.query.blogs.findFirst({
          where: eq(blogs.slug, input.slug),
          with: {
            author: true,
            comments: {
              with: {
                author: true,
              },
              orderBy: [desc(comments.createdAt)],
            },
          },
        });
        
        if (!blog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }
        
        return blog;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch blog: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Get blogs by author
  getByAuthor: publicProcedure
    .input(z.object({ 
      authorId: z.string(),
      limit: z.number().min(1).max(50).default(10),
      cursor: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { authorId, limit, cursor } = input;
      
      try {
        const items = await ctx.db.query.blogs.findMany({
          where: cursor 
            ? and(eq(blogs.authorId, authorId), lt(blogs.id, cursor))
            : eq(blogs.authorId, authorId),
          orderBy: [desc(blogs.createdAt)],
          limit: limit + 1,
          with: {
            author: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        throw new Error(
          `Failed to fetch author blogs: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  // Create a new blog post
  create: protectedProcedure
    .input(insertBlogSchema.omit({ 
      id: true, 
      authorId: true, 
      createdAt: true, 
      updatedAt: true, 
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      try {
        const slug = input.slug || slugify(input.title);
        
        const [blog] = await ctx.db.insert(blogs)
          .values({
            ...input,
            slug,
            authorId: ctx.session.user.dbId,
          })
          .returning();
        
        return blog;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create blog: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Update a blog post
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: insertBlogSchema.partial().omit({ 
        id: true, 
        authorId: true, 
        createdAt: true, 
        updatedAt: true, 
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      try {
        const blog = await ctx.db.query.blogs.findFirst({
          where: eq(blogs.id, input.id),
        });
        
        if (!blog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog not found",
          });
        }
        
        if (blog.authorId !== ctx.session.user.dbId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized: You can only edit your own blogs",
          });
        }
        
        // Update slug if title changes
        const slugUpdated = input.data.title
          ? { slug: slugify(input.data.title) } 
          : {};
        
        // Update the blog with the provided data
        const [updatedBlog] = await ctx.db
          .update(blogs)
          .set({
            ...input.data,
            ...slugUpdated,
            updatedAt: new Date()
          })
          .where(eq(blogs.id, input.id))
          .returning();
        
        if (!updatedBlog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog not found or update failed",
          });
        }
        
        return updatedBlog;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update blog: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Delete a blog post
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      try {
        const blog = await ctx.db.query.blogs.findFirst({
          where: eq(blogs.id, input.id),
        });
        
        if (!blog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog not found",
          });
        }
        
        if (blog.authorId !== ctx.session.user.dbId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized: You can only delete your own blogs",
          });
        }
        
        await ctx.db.delete(blogs).where(eq(blogs.id, input.id));
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete blog: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Add comment to blog
  addComment: protectedProcedure
    .input(insertCommentSchema.omit({ 
      id: true, 
      authorId: true, 
      createdAt: true 
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      try {
        const [comment] = await ctx.db.insert(comments)
          .values({
            ...input,
            authorId: ctx.session.user.dbId,
          })
          .returning();
        
        return comment;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add comment: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Delete comment
  deleteComment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      try {
        const comment = await ctx.db.query.comments.findFirst({
          where: eq(comments.id, input.id),
        });
        
        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }
        
        if (comment.authorId !== ctx.session.user.dbId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized: You can only delete your own comments",
          });
        }
        
        await ctx.db.delete(comments).where(eq(comments.id, input.id));
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete comment: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Like/unlike a blog
  toggleLike: protectedProcedure
    .input(z.object({ blogId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      try {
        const existingLike = await ctx.db.query.likes.findFirst({
          where: and(
            eq(likes.blogId, input.blogId),
            eq(likes.userId, ctx.session.user.dbId)
          ),
        });
        
        if (existingLike) {
          // Unlike
          await ctx.db.delete(likes).where(eq(likes.id, existingLike.id));
          return { liked: false };
        } else {
          // Like
          await ctx.db.insert(likes).values({
            blogId: input.blogId,
            userId: ctx.session.user.dbId,
          });
          return { liked: true };
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to toggle like: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Check if user has liked a blog
  checkLiked: protectedProcedure
    .input(z.object({ blogId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.dbId) {
        return { liked: false };
      }

      try {
        const existingLike = await ctx.db.query.likes.findFirst({
          where: and(
            eq(likes.blogId, input.blogId),
            eq(likes.userId, ctx.session.user.dbId)
          ),
        });
        
        return { liked: !!existingLike };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to check like status: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),

  // Count likes for a blog
  countLikes: publicProcedure
    .input(z.object({ blogId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const likesCount = await ctx.db.query.likes.findMany({
          where: eq(likes.blogId, input.blogId),
        });
        
        return { count: likesCount.length };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to count likes: ${error instanceof Error ? error.message : "Unknown error"}`,
          cause: error,
        });
      }
    }),
});

// Helper function to create slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // Replace spaces with -
    .replace(/&/g, "-and-")   // Replace & with "and"
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-")     // Replace multiple - with single -
    .replace(/^-+/, "")       // Trim - from start of text
    .replace(/-+$/, "");      // Trim - from end of text
}

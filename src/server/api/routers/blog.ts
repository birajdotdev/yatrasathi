import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { generateExcerpt } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  categoryValues,
  comments,
  likes,
  notifications,
  posts,
  users,
} from "@/server/db/schema";
import { postInsertSchema, postUpdateSchema } from "@/zod/post";

// Helper function to generate a slug from a title
const generateSlug = (title: string) => {
  return `${title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")}-${nanoid(5)}`;
};

export const blogRouter = createTRPCRouter({
  // Category Routes
  getCategories: publicProcedure.query(() => {
    // Return all the predefined categories with readable names
    const categoryMap: Record<string, string> = {
      travel_tips: "Travel Tips",
      adventure: "Adventure",
      food: "Food & Cuisine",
      culture: "Culture & History",
      nature: "Nature & Outdoors",
      city_guide: "City Guide",
      budget_travel: "Budget Travel",
      photography: "Photography",
      other: "Other",
    };

    return categoryValues.map((category) => ({
      id: category,
      name: categoryMap[category] ?? category,
      value: category,
    }));
  }),

  // Post Routes
  createPost: protectedProcedure
    .input(
      postInsertSchema.pick({
        title: true,
        content: true,
        excerpt: true,
        category: true,
        status: true,
        featuredImage: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const slug = generateSlug(input.title);

        // Auto-generate excerpt if not provided
        const excerpt =
          typeof input.excerpt === "string" && input.excerpt.trim() !== ""
            ? input.excerpt
            : generateExcerpt(input.content);

        // Only set featuredImage if provided, otherwise let DB default apply
        const values: typeof posts.$inferInsert = {
          title: input.title,
          slug,
          content: input.content,
          excerpt,
          category: input.category,
          status: input.status,
          authorId: userId,
          featuredImage:
            typeof input.featuredImage === "string" &&
            input.featuredImage.trim() !== ""
              ? input.featuredImage
              : undefined,
        };

        // Insert post
        const [newPost] = await ctx.db.insert(posts).values(values).returning();

        if (!newPost) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create post",
          });
        }

        return newPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
          cause: error,
        });
      }
    }),

  updatePost: protectedProcedure
    .input(
      postUpdateSchema.extend({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        // Get the post to check if the user is the author
        const post = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id))
          .limit(1);

        if (!post.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        // Check if the user is the author
        if (post[0]?.authorId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only edit your own posts",
          });
        }

        // Update values
        const updateValues: Record<string, unknown> = {};
        if (input.title) {
          updateValues.title = input.title;
          // Only update slug if title changes
          updateValues.slug = generateSlug(input.title);
        }
        if (input.content !== undefined) updateValues.content = input.content;
        if (typeof input.excerpt === "string" && input.excerpt.trim() !== "") {
          updateValues.excerpt = input.excerpt;
        } else if (input.content !== undefined) {
          // If excerpt is empty and content is provided, auto-generate
          updateValues.excerpt = generateExcerpt(input.content);
        }
        if (
          typeof input.featuredImage === "string" &&
          input.featuredImage.trim() !== ""
        ) {
          updateValues.featuredImage = input.featuredImage;
        }
        if (input.category !== undefined)
          updateValues.category = input.category;
        if (input.status !== undefined) updateValues.status = input.status;

        // Update post
        const [updatedPost] = await ctx.db
          .update(posts)
          .set(updateValues)
          .where(eq(posts.id, input.id))
          .returning();

        if (!updatedPost) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update post",
          });
        }

        return updatedPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post",
          cause: error,
        });
      }
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        // Get the post to check if the user is the author
        const post = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id))
          .limit(1);

        if (!post.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        // Check if the user is the author
        if (post[0]?.authorId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own posts",
          });
        }

        // Delete post
        await ctx.db.delete(posts).where(eq(posts.id, input.id));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
          cause: error,
        });
      }
    }),

  listPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        category: z.enum(categoryValues).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { limit, cursor, category } = input;

        // Create where conditions
        const whereConditions = [];
        whereConditions.push(eq(posts.status, "published"));

        if (category) {
          whereConditions.push(eq(posts.category, category));
        }

        // Add cursor condition if provided
        if (cursor) {
          whereConditions.push(sql`${posts.createdAt} < ${cursor}`);
        }

        // Execute query with conditions, limit and order
        const result = await ctx.db
          .select({
            post: posts,
            likesCount: count(likes.id).as("likes_count"),
            commentsCount: count(comments.id).as("comments_count"),
            author: {
              id: users.id,
              name: users.name,
              image: users.image,
            },
          })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .leftJoin(comments, eq(posts.id, comments.postId))
          .leftJoin(users, eq(posts.authorId, users.id))
          .where(and(...whereConditions))
          .groupBy(posts.id, users.id)
          .orderBy(desc(posts.createdAt))
          .limit(limit + 1);

        // Check if there's a next page
        const hasNextPage = result.length > limit;
        const postList = hasNextPage ? result.slice(0, -1) : result;

        // Get the next cursor
        const nextCursor =
          hasNextPage && postList.length > 0
            ? (postList[postList.length - 1]?.post?.createdAt?.toISOString() ??
              null)
            : null;

        return {
          posts: postList,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list posts",
          cause: error,
        });
      }
    }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.db
          .select({
            post: posts,
            likesCount: count(likes.id).as("likes_count"),
            commentsCount: count(comments.id).as("comments_count"),
            author: {
              id: users.id,
              name: users.name,
              image: users.image,
              email: users.email,
            },
          })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .leftJoin(comments, eq(posts.id, comments.postId))
          .leftJoin(users, eq(posts.authorId, users.id))
          .where(eq(posts.slug, input.slug))
          .groupBy(posts.id, users.id)
          .limit(1);

        if (!post.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        return post[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get post",
          cause: error,
        });
      }
    }),

  getPostsByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum(categoryValues),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { category, limit, cursor } = input;

        // Create where conditions
        const whereConditions = [
          eq(posts.status, "published"),
          eq(posts.category, category),
        ];

        // Add cursor condition if provided
        if (cursor) {
          whereConditions.push(sql`${posts.createdAt} < ${cursor}`);
        }

        // Execute query with conditions, limit and order
        const result = await ctx.db
          .select({
            post: posts,
            likesCount: count(likes.id).as("likes_count"),
            commentsCount: count(comments.id).as("comments_count"),
            author: {
              id: users.id,
              name: users.name,
              image: users.image,
            },
          })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .leftJoin(comments, eq(posts.id, comments.postId))
          .leftJoin(users, eq(posts.authorId, users.id))
          .where(and(...whereConditions))
          .groupBy(posts.id, users.id)
          .orderBy(desc(posts.createdAt))
          .limit(limit + 1);

        // Check if there's a next page
        const hasNextPage = result.length > limit;
        const postList = hasNextPage ? result.slice(0, -1) : result;

        // Get the next cursor
        const nextCursor =
          hasNextPage && postList.length > 0
            ? (postList[postList.length - 1]?.post?.createdAt?.toISOString() ??
              null)
            : null;

        return {
          posts: postList,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get posts by category",
          cause: error,
        });
      }
    }),

  getUserPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        status: z.enum(["draft", "published"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        const { limit, cursor, status } = input;

        // Create where conditions
        const whereConditions = [eq(posts.authorId, userId)];

        // Add status filter if provided
        if (status) {
          whereConditions.push(eq(posts.status, status));
        }

        // Add cursor condition if provided
        if (cursor) {
          whereConditions.push(sql`${posts.createdAt} < ${cursor}`);
        }

        // Execute query with conditions, limit and order
        const result = await ctx.db
          .select({
            post: posts,
            likesCount: count(likes.id).as("likes_count"),
            commentsCount: count(comments.id).as("comments_count"),
            author: {
              id: users.id,
              name: users.name,
              image: users.image,
            },
          })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .leftJoin(comments, eq(posts.id, comments.postId))
          .leftJoin(users, eq(posts.authorId, users.id))
          .where(and(...whereConditions))
          .groupBy(posts.id, users.id)
          .orderBy(desc(posts.createdAt))
          .limit(limit + 1);

        // Check if there's a next page
        const hasNextPage = result.length > limit;
        const postList = hasNextPage ? result.slice(0, -1) : result;

        // Get the next cursor
        const nextCursor =
          hasNextPage && postList.length > 0
            ? (postList[postList.length - 1]?.post?.createdAt?.toISOString() ??
              null)
            : null;

        return {
          posts: postList,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get user posts",
          cause: error,
        });
      }
    }),

  // Comment Routes
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        // Check if post exists
        const post = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.postId))
          .limit(1);

        if (!post.length || !post[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        // Insert comment
        const [newComment] = await ctx.db
          .insert(comments)
          .values({
            content: input.content,
            postId: input.postId,
            authorId: userId,
          })
          .returning();

        if (!newComment) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create comment",
          });
        }

        // Create notification for the post author (if not self)
        const postAuthorId = post[0].authorId;
        if (postAuthorId !== userId) {
          await ctx.db.insert(notifications).values({
            userId: postAuthorId,
            type: "comment",
            postId: input.postId,
            commentId: newComment.id,
            fromUserId: userId,
          });
        }

        return newComment;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create comment",
          cause: error,
        });
      }
    }),

  getPostComments: publicProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { postId, limit, cursor } = input;

        // Create where conditions
        const whereConditions = [eq(comments.postId, postId)];

        // Add cursor condition if provided
        if (cursor) {
          whereConditions.push(sql`${comments.createdAt} < ${cursor}`);
        }

        // Execute query with limit and order, joining users for author info
        const result = await ctx.db
          .select({
            comment: comments,
            author: {
              id: users.id,
              name: users.name,
              image: users.image,
            },
          })
          .from(comments)
          .leftJoin(users, eq(comments.authorId, users.id))
          .where(and(...whereConditions))
          .orderBy(desc(comments.createdAt))
          .limit(limit + 1);

        // Check if there's a next page
        const hasNextPage = result.length > limit;
        const commentList = hasNextPage ? result.slice(0, -1) : result;

        // Get the next cursor
        const nextCursor =
          hasNextPage && commentList.length > 0
            ? (commentList[
                commentList.length - 1
              ]?.comment?.createdAt?.toISOString() ?? null)
            : null;

        return {
          comments: commentList,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get post comments",
          cause: error,
        });
      }
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        // Get the comment to check if the user is the author
        const comment = await ctx.db
          .select()
          .from(comments)
          .where(eq(comments.id, input.id))
          .limit(1);

        if (!comment.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        // Check if the user is the author
        if (comment[0]?.authorId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own comments",
          });
        }

        // Delete comment
        await ctx.db.delete(comments).where(eq(comments.id, input.id));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete comment",
          cause: error,
        });
      }
    }),

  // Like Routes
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        // Check if post exists
        const post = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.postId))
          .limit(1);

        if (!post.length || !post[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        const postAuthorId = post[0].authorId;

        // Check if user already liked the post
        const existingLike = await ctx.db
          .select()
          .from(likes)
          .where(and(eq(likes.postId, input.postId), eq(likes.userId, userId)))
          .limit(1);

        // If like exists, delete it (unlike)
        if (existingLike.length) {
          await ctx.db
            .delete(likes)
            .where(
              and(eq(likes.postId, input.postId), eq(likes.userId, userId))
            );

          return { liked: false };
        }

        // Otherwise, create a new like
        await ctx.db.insert(likes).values({
          postId: input.postId,
          userId: userId,
        });

        // Create notification for the post author (if not self)
        if (postAuthorId !== userId) {
          await ctx.db.insert(notifications).values({
            userId: postAuthorId,
            type: "like",
            postId: input.postId,
            fromUserId: userId,
          });
        }

        return { liked: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to toggle like status",
          cause: error,
        });
      }
    }),

  checkLikeStatus: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        // Check if like exists
        const existingLike = await ctx.db
          .select()
          .from(likes)
          .where(and(eq(likes.postId, input.postId), eq(likes.userId, userId)))
          .limit(1);

        return { liked: existingLike.length > 0 };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check like status",
          cause: error,
        });
      }
    }),

  getLikesByUser: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;

        const { limit, cursor } = input;

        // Create where conditions
        const whereConditions = [eq(likes.userId, userId)];

        // Add cursor condition if provided
        if (cursor) {
          whereConditions.push(sql`${likes.createdAt} < ${cursor}`);
        }

        // Execute query with limit and order
        const result = await ctx.db
          .select()
          .from(likes)
          .where(and(...whereConditions))
          .orderBy(desc(likes.createdAt))
          .limit(limit + 1);

        // Check if there's a next page
        const hasNextPage = result.length > limit;
        const likeList = hasNextPage ? result.slice(0, -1) : result;

        // Get the post IDs
        const postIds = likeList.map((like) => like.postId);

        // If there are no liked posts, return empty result
        if (postIds.length === 0) {
          return {
            posts: [],
            nextCursor: null,
          };
        }

        // Get the posts
        const postsWithCounts = await ctx.db
          .select({
            post: posts,
            likesCount: count(likes.id).as("likes_count"),
            commentsCount: count(comments.id).as("comments_count"),
          })
          .from(posts)
          .leftJoin(likes, eq(posts.id, likes.postId))
          .leftJoin(comments, eq(posts.id, comments.postId))
          .where(inArray(posts.id, postIds))
          .groupBy(posts.id);

        // Get the next cursor
        const nextCursor =
          hasNextPage && likeList.length > 0
            ? (likeList[likeList.length - 1]?.createdAt?.toISOString() ?? null)
            : null;

        return {
          posts: postsWithCounts,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get liked posts",
          cause: error,
        });
      }
    }),

  searchBlogs: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().int().positive().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const query = input.query.trim();
      if (!query) return [];
      const whereConditions = [
        eq(posts.status, "published"),
        sql`${posts.title} ILIKE ${`%${query}%`}`,
      ];
      const results = await ctx.db
        .select({
          post: posts,
          likesCount: count(likes.id).as("likes_count"),
          commentsCount: count(comments.id).as("comments_count"),
          author: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(posts)
        .leftJoin(likes, eq(posts.id, likes.postId))
        .leftJoin(comments, eq(posts.id, comments.postId))
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(and(...whereConditions))
        .groupBy(posts.id, users.id)
        .orderBy(desc(posts.createdAt))
        .limit(limit);
      return results;
    }),
});

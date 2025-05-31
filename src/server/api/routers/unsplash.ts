import { TRPCError } from "@trpc/server";
import type { Basic as UnsplashImage } from "unsplash-js/dist/methods/photos/types";
import { z } from "zod";

import { unsplash } from "@/lib/unsplash";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1605640797058-58b7040a0e61?q=80&w=1633&auto=format&fit=crop";

const optionsSchema = z.object({
  query: z.string(),
  count: z.number().optional().default(20),
  orientation: z
    .enum(["landscape", "portrait", "squarish"])
    .optional()
    .default("landscape"),
  fallbackUrl: z.string().optional().default(DEFAULT_IMAGE),
  cursor: z.number().optional().default(1),
});

export type ImageResult = {
  url: string;
  smallUrl?: string;
  thumbnailUrl?: string;
  altDescription?: string;
  credit?: {
    name: string;
    username: string;
    profileUrl: string;
    attribution: string;
  };
};

export type ImagesResponse = {
  images: ImageResult[];
  nextCursor: number | null;
};

export const unsplashRouter = createTRPCRouter({
  getImage: protectedProcedure.input(optionsSchema).query(async ({ input }) => {
    const { query, count = 1, orientation, fallbackUrl } = input;

    // Default result with fallback image
    const defaultResult: ImageResult = {
      url: fallbackUrl,
    };

    // Skip API call if query is too short
    if (!query || query.trim().length < 2) {
      return defaultResult;
    }

    try {
      // Search for an image with the provided query
      const result = await unsplash.search.getPhotos({
        query,
        perPage: count,
        orientation,
      });

      // If we have results, use the first image
      const firstResult = result.response?.results?.[0];
      if (firstResult?.urls?.regular) {
        return {
          url: firstResult.urls.regular,
          smallUrl: firstResult.urls.small,
          thumbnailUrl: firstResult.urls.thumb,
          altDescription: firstResult.alt_description ?? `Image of ${query}`,
          credit: {
            name: firstResult.user.name,
            username: firstResult.user.username,
            profileUrl: firstResult.user.links.html,
            attribution: `Photo by ${firstResult.user.name} on Unsplash`,
          },
        };
      }

      return defaultResult;
    } catch (error) {
      console.error("Failed to fetch image from Unsplash:", error);
      throw new TRPCError({
        message: "Failed to fetch image from Unsplash",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getImages: protectedProcedure
    .input(optionsSchema)
    .query(async ({ input }) => {
      const { query, count, orientation, cursor } = input;

      // Skip API call if query is too short
      if (!query || query.trim().length < 2) {
        return {
          images: [],
          nextCursor: null,
        };
      }

      try {
        // Search for images with the provided query
        const result = await unsplash.search.getPhotos({
          query,
          perPage: count,
          orientation,
          page: cursor,
        });

        // Map the response to our ImageResult type
        if (result.response?.results && result.response.results.length > 0) {
          const images = result.response.results.map(
            (image: UnsplashImage) => ({
              url: image.urls.regular,
              smallUrl: image.urls.small,
              thumbnailUrl: image.urls.thumb,
              altDescription: image.alt_description ?? `Image of ${query}`,
              credit: {
                name: image.user.name,
                username: image.user.username,
                profileUrl: image.user.links.html,
                attribution: `Photo by ${image.user.name} on Unsplash`,
              },
            })
          );

          const totalPages = result.response.total_pages ?? 0;
          const nextCursor = cursor < totalPages ? cursor + 1 : null;

          return {
            images,
            nextCursor,
          };
        }

        return {
          images: [],
          nextCursor: null,
        };
      } catch (error) {
        console.error("Failed to fetch images from Unsplash:", error);
        throw new TRPCError({
          message: "Failed to fetch images from Unsplash",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

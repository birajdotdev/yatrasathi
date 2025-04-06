import { createApi } from "unsplash-js";
import type { Basic as UnsplashImage } from "unsplash-js/dist/methods/photos/types";

import { env } from "@/env";

// Default fallback image if Unsplash API fails
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1605640797058-58b7040a0e61?q=80&w=1633&auto=format&fit=crop";

export type FetchImageOptions = {
  query: string;
  count?: number;
  orientation?: "landscape" | "portrait" | "squarish";
  fallbackUrl?: string;
};

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

/**
 * Fetches an image from Unsplash based on the search query
 *
 * @param options Search options and configuration
 * @returns The image URL and metadata, or fallback URL if API fails
 */
export async function fetchImageFromUnsplash(
  options: FetchImageOptions
): Promise<ImageResult> {
  const {
    query,
    count = 1,
    orientation = "landscape",
    fallbackUrl = DEFAULT_IMAGE,
  } = options;

  // Default result with fallback image
  const defaultResult: ImageResult = {
    url: fallbackUrl,
  };

  // Skip API call if query is too short
  if (!query || query.trim().length < 2) {
    return defaultResult;
  }

  try {
    // Initialize the Unsplash API client
    const unsplash = createApi({
      accessKey: env.UNSPLASH_ACCESS_KEY,
    });

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
    // If there's an error, log it and return the fallback image
    console.error("Failed to fetch image from Unsplash:", error);
    return defaultResult;
  }
}

/**
 * Fetches multiple images from Unsplash based on the search query
 *
 * @param options Search options and configuration
 * @returns Array of image URLs and metadata, or empty array if API fails
 */
export async function fetchImagesFromUnsplash(
  options: FetchImageOptions
): Promise<ImageResult[]> {
  const { query, count = 5, orientation = "landscape" } = options;

  // Skip API call if query is too short
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // Initialize the Unsplash API client
    const unsplash = createApi({
      accessKey: env.UNSPLASH_ACCESS_KEY,
    });

    // Search for images with the provided query
    const result = await unsplash.search.getPhotos({
      query,
      perPage: count,
      orientation,
    });

    // Map the response to our ImageResult type
    if (result.response?.results && result.response.results.length > 0) {
      return result.response.results.map((image: UnsplashImage) => ({
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
      }));
    }

    return [];
  } catch (error) {
    // If there's an error, log it and return an empty array
    console.error("Failed to fetch images from Unsplash:", error);
    return [];
  }
}

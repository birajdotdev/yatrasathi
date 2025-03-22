import { TRPCError } from "@trpc/server";
import { createApi } from "unsplash-js";
import type { Basic as UnsplashImage } from "unsplash-js/dist/methods/photos/types";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// LocationIQ API types
export interface LocationIQAddress {
  name?: string;
  house_number?: string;
  road?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface LocationIQPlace {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place?: string;
  display_address?: string;
  address: LocationIQAddress;
}

// Define the Place type for the application
export type Place = {
  id: string;
  name: string;
  address: string;
  subcategory: string;
  latitude: number;
  longitude: number;
  stateName?: string;
  countryName?: string;
};

// Type for our standardized place image data
export type PlaceImage = {
  id: string;
  url: string;
  smallUrl: string;
  altDescription: string;
  photographerName: string;
  photographerUsername: string;
  photographerUrl: string;
  attribution: string;
};

export const placesRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        // Skip API call if query is too short
        if (input.query.trim().length < 2) {
          return [];
        }

        const url = "https://api.locationiq.com/v1/autocomplete";

        // Build the query parameters
        const queryParams = new URLSearchParams({
          key: env.LOCATIONIQ_API_KEY,
          q: input.query,
          limit: "10",
          dedupe: "1",
          "accept-language": "en", // Request results in English
        });

        const response = await fetch(`${url}?${queryParams.toString()}`);

        if (!response.ok) {
          throw new TRPCError({
            message: response.statusText,
            code: "BAD_REQUEST",
          });
        }

        const data = (await response.json()) as LocationIQPlace[];

        const places = data.map((place) => ({
          id: place.place_id,
          name: place.display_place ?? "",
          address: place.display_address ?? "",
          subcategory: place.type,
          latitude: Number(place.lat),
          longitude: Number(place.lon),
          stateName: place.address.state ?? "",
          countryName: place.address.country ?? "",
        }));

        return places;
      } catch (error) {
        console.error("Error fetching places:", error);
        throw new TRPCError({
          message: "Failed to fetch places",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getPlaceImage: publicProcedure
    .input(
      z.object({
        placeName: z.string(),
        count: z.number().min(1).max(10).default(1),
      })
    )
    .query(async ({ input }) => {
      try {
        // Skip API call if query is too short
        if (input.placeName.trim().length < 2) {
          throw new TRPCError({
            message: "Place name is too short",
            code: "BAD_REQUEST",
          });
        }

        // Initialize the Unsplash API client
        const unsplash = createApi({
          accessKey: env.UNSPLASH_ACCESS_KEY,
          // Next.js provides fetch in both client and server environments
        });

        // Call the Unsplash API using the official client
        const result = await unsplash.search.getPhotos({
          query: `${input.placeName}`,
          perPage: input.count,
          orientation: "landscape",
        });

        // Handle API errors
        if (result.errors) {
          console.error("Unsplash API error:", result.errors);
          throw new TRPCError({
            message: result.errors[0] || "Failed to fetch place images",
            code: "BAD_REQUEST",
          });
        }

        // Return empty array if no results
        if (!result.response || result.response.results.length === 0) {
          return [];
        }

        // Map the response to our PlaceImage type
        const placeImages: PlaceImage[] = result.response.results.map(
          (image: UnsplashImage) => ({
            id: image.id,
            url: image.urls.regular,
            smallUrl: image.urls.small,
            altDescription:
              image.alt_description ?? `Image of ${input.placeName}`,
            photographerName: image.user.name,
            photographerUsername: image.user.username,
            photographerUrl: image.user.links.html,
            attribution: `Photo by ${image.user.name} on Unsplash`,
          })
        );

        return placeImages;
      } catch (error) {
        console.error("Error fetching place images:", error);
        throw new TRPCError({
          message: "Failed to fetch place images",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

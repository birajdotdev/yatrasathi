import { TRPCError } from "@trpc/server";
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
          state: place.address.state ?? "",
          country: place.address.country ?? "",
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
});

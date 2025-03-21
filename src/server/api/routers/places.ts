import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Foursquare API types
interface FoursquareCategory {
  id: number;
  name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
}

interface FoursquareLocation {
  address: string;
  locality: string;
  region: string;
  country: string;
  formatted_address: string;
}

interface FoursquareGeocodes {
  main: {
    latitude: number;
    longitude: number;
  };
}

interface FoursquarePlace {
  fsq_id: string;
  name: string;
  location: FoursquareLocation;
  categories: FoursquareCategory[];
  distance: number;
  geocodes: FoursquareGeocodes;
}

interface FoursquareResponse {
  results: FoursquarePlace[];
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}

// Geographical location categories from Foursquare
// These category IDs represent geographical entities like cities, states, regions, etc.
const GEO_LOCATION_CATEGORIES = [
  "16003", // City
  "16004", // State / Province
  "16005", // Country
  "16006", // County
  "16007", // Town
  "16008", // Village
  "16009", // Region
  "16010", // Neighborhood
  "16011", // Borough
  "16012", // Island
  "16013", // District
  "16014", // Territory
  "16015", // Suburb
  "16016", // Municipality
  "10000", // Arts & Entertainment (includes National Parks)
  "16000", // Outdoors & Recreation (includes Natural Features)
  "16018", // National Park
  "16019", // Mountain
  "16020", // Lake
  "16021", // River
  "16022", // Beach
  "16023", // Forest
  "16024", // Desert
];

export const placesRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        const url = "https://api.foursquare.com/v3/places/search";
        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: env.FOURSQUARE_API_KEY,
          },
        };

        // Build the query URL with categories parameter to filter for geographical locations
        const queryParams = new URLSearchParams({
          query: input.query,
          limit: "10",
          categories: GEO_LOCATION_CATEGORIES.join(","),
        });

        const response = await fetch(
          `${url}?${queryParams.toString()}`,
          options
        );

        if (!response.ok) {
          throw new Error(`Foursquare API error: ${response.statusText}`);
        }

        const data = (await response.json()) as FoursquareResponse;

        // Transform the Foursquare response to match our expected format
        const places = data.results.map((place) => ({
          id: place.fsq_id,
          name: place.name,
          stateName: place.location.region,
          countryName: place.location.country,
          latitude: place.geocodes.main.latitude,
          longitude: place.geocodes.main.longitude,
          subcategory: place.categories[0]?.name ?? "place",
          depth: 5,
          parentId: 0,
          popularity: 100,
          bounds: [],
          score: 100,
          address: place.location.formatted_address,
          distance: place.distance,
        }));

        // Further filter results to prioritize geographical locations
        const filteredPlaces = places.filter((place) => {
          // Keep places that have region or country information
          if (place.stateName || place.countryName) {
            return true;
          }

          // Keep places with geographical subcategories
          const geoSubcategories = [
            "City",
            "State",
            "Province",
            "Country",
            "Region",
            "National Park",
            "Mountain",
            "Lake",
            "River",
            "Beach",
            "Island",
            "District",
            "Territory",
            "Town",
            "Village",
          ];

          return geoSubcategories.some((category) =>
            place.subcategory.toLowerCase().includes(category.toLowerCase())
          );
        });

        return filteredPlaces.length > 0 ? filteredPlaces : places;
      } catch (error) {
        console.error("Error fetching places:", error);
        throw new Error("Failed to fetch places");
      }
    }),
});

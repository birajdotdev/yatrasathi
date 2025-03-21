"use client";

import { useState } from "react";

import { MapPin } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

export default function DestinationAutocomplete() {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, error } = api.places.search.useQuery(
    { query: debouncedSearch },
    {
      enabled: !!debouncedSearch,
      staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10, // How long to keep in cache
    }
  );

  const places = data ?? [];

  const handleFocus = () => {
    if (search) setShowResults(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          id="destination"
          placeholder="e.g. Paris, Hawaii, Japan"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value) setShowResults(true);
            else setShowResults(false);
          }}
          onFocus={handleFocus}
          className="pl-10 h-12 rounded-xl bg-background"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-background rounded-xl border border-input shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive">
              {error.message}
            </div>
          ) : places.length > 0 ? (
            places.map((place) => (
              <div
                key={place.id}
                className="flex justify-between items-center p-3 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => {
                  setSearch(place.name);
                  setShowResults(false);
                }}
              >
                <div className="flex items-center">
                  <div className="bg-accent p-2 rounded-lg mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{place.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {place.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-accent text-xs">
                    {place.subcategory}
                  </Badge>
                </div>
              </div>
            ))
          ) : search ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No places found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

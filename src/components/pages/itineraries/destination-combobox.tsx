"use client";

import { useCallback, useMemo, useState } from "react";

import { ChevronsUpDown, MapPin } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Place } from "@/server/api/routers/places";
import { api } from "@/trpc/react";

type DestinationComboboxProps = {
  value: {
    name: string;
    address: string;
  };
  onChange: (value: Place) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
};

// Pre-create loading skeleton array to avoid recreating it on each render
const LOADING_SKELETONS = Array.from({ length: 3 }).map((_, index) => (
  <div
    key={`skeleton-${index}`}
    className="flex items-center justify-between w-full p-1"
  >
    <div className="flex items-center">
      <Skeleton className="h-8 w-8 rounded-lg mr-3" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-5 w-16 rounded-full" />
  </div>
));

const DEFAULT_ERROR_MESSAGE = "Failed to load destinations. Please try again.";

export function DestinationCombobox({
  value,
  onChange,
  placeholder = "Select your destination",
  className,
  error = false,
  disabled = false,
}: DestinationComboboxProps) {
  const [search, setSearch] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  // Only query when we have a search string
  const shouldFetch = debouncedSearch.trim().length > 0;

  const { data, isLoading, isError } = api.places.search.useQuery(
    { query: debouncedSearch },
    {
      enabled: shouldFetch,
      staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10, // How long to keep in cache
    }
  );

  // Memoize places to prevent unnecessary re-renders
  const places = useMemo(() => data ?? [], [data]);

  // Memoize the handleSelect callback
  const handleSelect = useCallback(
    (selectedName: string) => {
      // Find the place object that matches the selected name
      const selectedPlace = places.find((place) => place.name === selectedName);

      if (selectedPlace) {
        onChange(selectedPlace);
        setSearch(selectedPlace.name);
        setOpen(false);
      }
    },
    [onChange, places]
  );

  // Memoize the error message
  const errorMessage = useMemo(() => {
    if (!isError) return null;
    return DEFAULT_ERROR_MESSAGE;
  }, [isError]);

  // Handle open state changes
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      // Reset search to current value when closing
      if (!isOpen) {
        setSearch(value?.name ?? "");
      }
    },
    [value]
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select destination"
          className={cn(
            "w-full space-x-1 h-12 rounded-xl !bg-background hover:!bg-muted text-left font-normal",
            className,
            error &&
              "!border-destructive !text-destructive !bg-destructive/20 hover:!bg-destructive/30 transition-colors"
          )}
          disabled={disabled}
        >
          <MapPin
            className={cn(
              "!size-5 text-muted-foreground pointer-events-none",
              error && "!text-destructive"
            )}
          />
          <div className="flex items-center justify-between w-full">
            <span
              className={cn(
                !value && "text-muted-foreground",
                error && "!text-destructive"
              )}
            >
              {value?.name ?? placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] rounded-xl overflow-clip p-0">
        <Command className="bg-background">
          <CommandInput
            placeholder="e.g. Paris, Hawaii, Japan"
            value={search}
            onValueChange={setSearch}
            className="h-12"
            aria-label="Search destinations"
          />
          <CommandList>
            <CommandEmpty
              className={cn("py-6 text-center text-sm", isLoading && "py-0")}
            >
              {isLoading ? (
                <div
                  className="p-2 space-y-2"
                  aria-busy="true"
                  aria-live="polite"
                >
                  {LOADING_SKELETONS}
                </div>
              ) : isError ? (
                <span className="text-destructive" role="alert">
                  {errorMessage}
                </span>
              ) : (
                "No destination found"
              )}
            </CommandEmpty>
            <CommandGroup>
              {places.map((place) => (
                <CommandItem
                  key={place.id}
                  value={place.name}
                  onSelect={handleSelect}
                  className="rounded-lg group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-lg mr-3 group-data-[selected=true]:bg-primary transition-colors">
                        <MapPin className="h-4 w-4 text-primary group-data-[selected=true]:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="font-medium capitalize">
                          {place.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {place.address}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 border-none text-primary rounded-full text-xs capitalize"
                    >
                      {place.subcategory}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

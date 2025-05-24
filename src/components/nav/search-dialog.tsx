"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useClerk } from "@clerk/nextjs";
import {
  CalendarDays,
  CreditCard,
  Globe,
  Home,
  PenTool,
  Search,
  User,
} from "lucide-react";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

const staticRoutes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    type: "route",
    icon: Home,
  },
  { label: "Explore", href: "/explore", type: "route", icon: Globe },
  {
    label: "Itineraries",
    href: "/itineraries",
    type: "route",
    icon: CalendarDays,
  },
  { label: "Blogs", href: "/blogs", type: "route", icon: PenTool },
];

const quickActions = [
  {
    label: "Create Itinerary",
    href: "/itineraries/create",
    icon: CalendarDays,
  },
  {
    label: "Write Blog Post",
    href: "/blogs/create",
    icon: PenTool,
  },
];

const settingsActions = [
  {
    label: "Account",
    href: "/account",
    icon: User,
  },
  {
    label: "Subscription",
    href: "/api/portal",
    icon: CreditCard,
  },
];

export default function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const router = useRouter();
  const { openUserProfile } = useClerk();

  // Search itineraries only when dialog is open and search is not empty
  const {
    data: itineraries,
    isLoading: itinerariesLoading,
    isError: itinerariesError,
  } = api.itinerary.searchItineraries.useQuery(
    { query: debouncedSearch, limit: 10 },
    { enabled: open && !!debouncedSearch }
  );

  // Search blogs only when dialog is open and search is not empty
  const {
    data: blogs,
    isLoading: blogsLoading,
    isError: blogsError,
  } = api.blog.searchBlogs.useQuery(
    { query: debouncedSearch, limit: 10 },
    { enabled: open && !!debouncedSearch }
  );

  const blogPosts = blogs ?? [];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isLoading = itinerariesLoading || blogsLoading;
  const isError = itinerariesError || blogsError;

  return (
    <div>
      <button
        className="hidden sm:inline-flex h-9 w-56 rounded-lg border border-input bg-background hover:bg-muted transition-colors px-3 py-2 text-sm text-foreground shadow-xs shadow-black/5 placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/20"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <Search
            className="-ms-1 me-3 text-muted-foreground/80"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="font-normal text-muted-foreground/70">
            Search...
          </span>
        </span>
        <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
          ⌘K
        </kbd>
      </button>
      <Button
        variant="outline"
        size="icon"
        className="sm:hidden rounded-lg"
        onClick={() => setOpen(true)}
        aria-label="Notifications"
      >
        <Search size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="bg-background">
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <ScrollArea className="max-h-[300px]">
            <CommandList className="max-h-none overflow-visible">
              {/* Unified CommandEmpty for Itineraries and Blogs */}
              <CommandEmpty
                className={cn("py-6 text-center text-sm", isLoading && "py-0")}
              >
                {isLoading ? (
                  <div className="p-2" aria-busy="true" aria-live="polite">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center rounded-lg p-2 group gap-2"
                      >
                        <Skeleton className="size-8 rounded-lg" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  <span className="text-destructive" role="alert">
                    Failed to load results. Please try again.
                  </span>
                ) : (
                  "No results found"
                )}
              </CommandEmpty>
              {/* Quick Actions group */}
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => (
                  <CommandItem
                    key={action.href}
                    value={action.label}
                    className="rounded-lg group !p-2"
                    onSelect={() => {
                      setOpen(false);
                      router.push(action.href);
                    }}
                  >
                    <div className="bg-primary/10 p-2 rounded-lg group-data-[selected=true]:bg-primary transition-colors">
                      <action.icon className="h-4 w-4 text-primary group-data-[selected=true]:text-white transition-colors" />
                    </div>
                    <span>{action.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* Navigation group */}
              <CommandGroup heading="Navigation">
                {staticRoutes.map((route) => (
                  <CommandItem
                    key={route.href}
                    value={route.label}
                    className="rounded-lg group !p-2"
                    onSelect={() => {
                      setOpen(false);
                      router.push(route.href);
                    }}
                  >
                    <div className="bg-primary/10 p-2 rounded-lg group-data-[selected=true]:bg-primary transition-colors">
                      <route.icon className="h-4 w-4 text-primary group-data-[selected=true]:text-white transition-colors" />
                    </div>
                    <span>{route.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* Itineraries group (only show if results and not loading/error) */}
              {open &&
                debouncedSearch &&
                !itinerariesLoading &&
                !itinerariesError &&
                itineraries &&
                itineraries.length > 0 && (
                  <CommandGroup heading="Itineraries">
                    {itineraries.map((itinerary) => (
                      <CommandItem
                        key={itinerary.id}
                        value={itinerary.title}
                        className="rounded-lg group !p-2"
                        onSelect={() => {
                          setOpen(false);
                          router.push(`/itineraries/${itinerary.id}`);
                        }}
                      >
                        <div className="bg-primary/10 p-2 rounded-lg group-data-[selected=true]:bg-primary transition-colors">
                          <CalendarDays className="h-4 w-4 text-primary group-data-[selected=true]:text-white transition-colors" />
                        </div>
                        <span>{itinerary.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              {/* Blogs group (only show if results and not loading/error) */}
              {open &&
                debouncedSearch &&
                !blogsLoading &&
                !blogsError &&
                blogPosts.length > 0 && (
                  <CommandGroup heading="Blogs">
                    {blogPosts.map((blog) => (
                      <CommandItem
                        key={blog.post.slug}
                        value={blog.post.title}
                        className="rounded-lg group !p-2"
                        onSelect={() => {
                          setOpen(false);
                          router.push(`/blogs/${blog.post.slug}`);
                        }}
                      >
                        <div className="bg-primary/10 p-2 rounded-lg group-data-[selected=true]:bg-primary transition-colors">
                          <PenTool className="h-4 w-4 text-primary group-data-[selected=true]:text-white transition-colors" />
                        </div>
                        <span>{blog.post.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              {/* Settings group */}
              <CommandGroup heading="Settings">
                {settingsActions.map((action) => (
                  <CommandItem
                    key={action.href}
                    value={action.label}
                    className="rounded-lg group !p-2"
                    onSelect={() => {
                      setOpen(false);
                      if (action.label === "Account") {
                        openUserProfile();
                      } else {
                        router.push(action.href);
                      }
                    }}
                  >
                    <div className="bg-primary/10 p-2 rounded-lg group-data-[selected=true]:bg-primary transition-colors">
                      <action.icon className="h-4 w-4 text-primary group-data-[selected=true]:text-white transition-colors" />
                    </div>
                    <span>{action.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </CommandDialog>
    </div>
  );
}

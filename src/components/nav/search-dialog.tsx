"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

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
    href: "/subscription",
    icon: CreditCard,
  },
];

// Extracted reusable CommandActionItem component
function CommandActionItem({
  icon: Icon,
  label,
  onSelect,
}: {
  icon: React.ElementType;
  label: string;
  onSelect: () => void;
}) {
  return (
    <CommandItem
      value={label}
      className="group rounded-lg !p-2"
      onSelect={onSelect}
    >
      <div className="rounded-lg bg-primary/10 p-2 transition-colors group-data-[selected=true]:bg-primary">
        <Icon className="h-4 w-4 text-primary transition-colors group-data-[selected=true]:text-white" />
      </div>
      <span>{label}</span>
    </CommandItem>
  );
}

// Helper to render a group
function renderGroup({
  heading,
  items,
}: {
  heading: string;
  items: React.ReactNode[];
}) {
  if (!items.length) return null;
  return <CommandGroup heading={heading}>{items}</CommandGroup>;
}

export default function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const router = useRouter();

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
        className="hidden h-9 w-56 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs shadow-black/5 transition-colors placeholder:text-muted-foreground/70 hover:bg-muted focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-hidden sm:inline-flex"
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
        <kbd className="ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
          ⌘K
        </kbd>
      </button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-lg sm:hidden"
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
                        className="group flex items-center gap-2 rounded-lg p-2"
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
              {renderGroup({
                heading: "Quick Actions",
                items: quickActions.map((action) => (
                  <CommandActionItem
                    key={action.href}
                    icon={action.icon}
                    label={action.label}
                    onSelect={() => {
                      setOpen(false);
                      router.push(action.href);
                    }}
                  />
                )),
              })}
              {/* Navigation group */}
              {renderGroup({
                heading: "Navigation",
                items: staticRoutes.map((route) => (
                  <CommandActionItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    onSelect={() => {
                      setOpen(false);
                      router.push(route.href);
                    }}
                  />
                )),
              })}
              {/* Itineraries group (only show if results and not loading/error) */}
              {open &&
                debouncedSearch &&
                !itinerariesLoading &&
                !itinerariesError &&
                itineraries &&
                itineraries.length > 0 &&
                renderGroup({
                  heading: "Itineraries",
                  items: itineraries.map((itinerary) => (
                    <CommandActionItem
                      key={itinerary.id}
                      icon={CalendarDays}
                      label={itinerary.title}
                      onSelect={() => {
                        setOpen(false);
                        router.push(`/itineraries/${itinerary.id}`);
                      }}
                    />
                  )),
                })}
              {/* Blogs group (only show if results and not loading/error) */}
              {open &&
                debouncedSearch &&
                !blogsLoading &&
                !blogsError &&
                blogPosts.length > 0 &&
                renderGroup({
                  heading: "Blogs",
                  items: blogPosts.map((blog) => (
                    <CommandActionItem
                      key={blog.post.slug}
                      icon={PenTool}
                      label={blog.post.title}
                      onSelect={() => {
                        setOpen(false);
                        router.push(`/blogs/${blog.post.slug}`);
                      }}
                    />
                  )),
                })}
              {/* Settings group */}
              {renderGroup({
                heading: "Settings",
                items: settingsActions.map((action) => (
                  <CommandActionItem
                    key={action.href}
                    icon={action.icon}
                    label={action.label}
                    onSelect={() => {
                      setOpen(false);
                      router.push(action.href);
                    }}
                  />
                )),
              })}
            </CommandList>
          </ScrollArea>
        </Command>
      </CommandDialog>
    </div>
  );
}

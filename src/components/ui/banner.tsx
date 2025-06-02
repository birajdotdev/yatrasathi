import { type LucideIcon } from "lucide-react";

import { splitTitle } from "@/lib/utils";

interface BannerProps {
  badgeText: string;
  title: string;
  description: string;
  icon: LucideIcon;
  quickStats?: {
    upcomingTrips: number;
    blogPosts: number;
    nextTripDays: string;
  };
}

export function Banner({
  badgeText,
  title,
  description,
  quickStats,
  icon: Icon,
}: BannerProps) {
  const [text, highlight] = splitTitle(title);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-background dark:from-primary/10 dark:via-background/90 dark:to-background">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/15 px-4 py-1 text-sm text-primary dark:bg-primary/20">
            {badgeText}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {text}{" "}
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        {/* Decorative illustration */}
        <div className="hidden lg:block">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-primary/15 dark:bg-primary/20" />
            <div className="absolute inset-2 rounded-full bg-primary/25 dark:bg-primary/30" />
            <div className="absolute inset-4 rounded-full bg-primary/35 dark:bg-primary/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      {quickStats && (
        <div className="relative border-t border-primary/10 dark:border-primary/20">
          <div className="grid grid-cols-1 divide-y divide-primary/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-primary/20">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-sm text-muted-foreground">
                Upcoming Trips
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {quickStats.upcomingTrips}
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-sm text-muted-foreground">Blog Posts</div>
              <div className="mt-1 text-2xl font-semibold">
                {quickStats.blogPosts}
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-sm text-muted-foreground">Next Trip</div>
              <div className="mt-1 text-2xl font-semibold">
                {quickStats.nextTripDays}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

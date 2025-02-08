"use client";

import { motion } from "framer-motion";

import { type ItemVariants } from "@/components/pages/dashboard";
import { useClerk } from "@clerk/nextjs";

interface WelcomeBannerProps {
  variants: ItemVariants;
}

export function WelcomeBanner({ variants }: WelcomeBannerProps) {
  const { user } = useClerk();
  return (
    <motion.div
      variants={variants}
      className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/90 dark:to-background"
    >
      {/* Decorative Elements */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm text-primary dark:bg-primary/20">
            Dashboard Overview
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {user?.firstName}!
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here&apos;s an overview of your travel plans and activities.
          </p>
        </div>

        {/* Decorative illustration */}
        <div className="hidden lg:block">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20" />
            <div className="absolute inset-2 rounded-full bg-primary/20 dark:bg-primary/30" />
            <div className="absolute inset-4 rounded-full bg-primary/30 dark:bg-primary/40" />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="relative border-t border-primary/10 dark:border-primary/20">
        <div className="grid grid-cols-1 divide-y divide-primary/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-primary/20">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-sm text-muted-foreground">Upcoming Trips</div>
            <div className="mt-1 text-2xl font-semibold">3</div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-sm text-muted-foreground">Blog Posts</div>
            <div className="mt-1 text-2xl font-semibold">7</div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-sm text-muted-foreground">Next Trip</div>
            <div className="mt-1 text-2xl font-semibold">15d</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

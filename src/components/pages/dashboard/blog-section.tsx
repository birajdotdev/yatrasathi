"use client";

import Link from "next/link";
import { Suspense } from "react";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";

import { BlogsClient, BlogsSkeleton } from "../blogs";

export function BlogSection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Recent
          </span>{" "}
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Blog Posts
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
          asChild
        >
          <Link href="/blogs">
            <span className="relative z-10 flex items-center gap-2">
              <span>View More</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Button>
      </div>
      <Suspense fallback={<BlogsSkeleton />}>
        <ErrorBoundaryWrapper fallbackMessage="Failed to load blogs. Please try again later.">
          <BlogsClient status="published" />
        </ErrorBoundaryWrapper>
      </Suspense>
    </section>
  );
}

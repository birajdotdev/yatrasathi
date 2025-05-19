"use client";

import { useParams, usePathname } from "next/navigation";
import React from "react";

import NotificationButton from "@/components/nav/notification-button";
import SearchDialog from "@/components/nav/search-dialog";
import ThemeToggle from "@/components/nav/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/trpc/react";

import QuickActionButton from "./quick-action-button";

export default function DashboardNav() {
  const pathname = usePathname();
  const params = useParams();

  const { id } = params as { id: string };

  // Move the query to the component level
  const { data: itinerary } = api.itinerary.getById.useQuery(id, {
    enabled: !!id && pathname.includes("itineraries"),
    // Disable query if there's no ID or we're not in itineraries path
  });

  const getLabel = (segment: string) => {
    // Check if this segment is the ID parameter
    if (segment === id) {
      // Use a more precise path detection with pathname.split("/")
      const pathParts = pathname.split("/");
      const contentType = pathParts[1]; // The content type is usually the first segment

      // Handle different content types with a switch for better readability and extensibility
      switch (contentType) {
        case "itineraries":
          // Return the actual title if the itinerary data is available
          return itinerary?.title ?? "Itinerary";
        default:
          return "Item";
      }
    } else if (pathname.includes("blogs")) {
      return segment
        .replace(/-/g, " ")
        .split(" ")
        .slice(0, -1) // Remove the last word
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      // Transform kebab-case to Title Case for regular segments
      return segment
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  };

  // Create breadcrumb items from the full path
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      href: `/${segment}`,
      label: getLabel(segment),
    }));

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-6 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-3">
        <SearchDialog />
        <QuickActionButton />
        <NotificationButton />
        <ThemeToggle />
      </div>
    </header>
  );
}

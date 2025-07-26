"use client";

import { useParams, usePathname } from "next/navigation";
import React from "react";

import { skipToken } from "@tanstack/react-query";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/react";

export default function NavBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();

  const id = params.id as string | undefined;

  // Move the query to the component level
  const { data: itinerary } = api.itinerary.getById.useQuery(id ?? skipToken, {
    enabled: !!id && pathname.includes("itineraries"), // Disable query if there's no ID or we're not in itineraries path
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
      if (segment === "blogs") {
        return "Blogs";
      }
      if (segment === "create") {
        return "Create";
      }
      if (segment === "edit") {
        return "Edit";
      }
      const words = segment.replace(/-/g, " ").split(" ");
      // Only remove the last word if it's a numeric ID (consists only of digits)
      const lastWord = words[words.length - 1];
      const wordsToUse =
        lastWord && /^\d+$/.test(lastWord) ? words.slice(0, -1) : words;

      return wordsToUse
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

  // Create breadcrumb items from the full path with cumulative hrefs
  const pathSegments = pathname.split("/").filter(Boolean);
  let accumulatedPath = "";
  const breadcrumbs = pathSegments.map((segment) => {
    accumulatedPath += `/${segment}`;
    return {
      href: accumulatedPath,
      label: getLabel(segment),
    };
  });
  return (
    <Breadcrumb className="hidden md:block">
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
  );
}

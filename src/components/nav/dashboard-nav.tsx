"use client";

import { usePathname } from "next/navigation";
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

import QuickActionButton from "./quick-action-button";

export default function DashboardNav() {
  const pathname = usePathname();

  // Create breadcrumb items from the full path
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      href: `/${segment}`,
      label: segment
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
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

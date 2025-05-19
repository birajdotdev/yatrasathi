"use client";

import Link from "next/link";
import React from "react";

import { type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  render?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  render,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-card/50 px-6 py-8 text-center",
        className
      )}
    >
      <Icon
        className={cn(
          "size-12 bg-primary/10 rounded-full p-3 overflow-visible text-primary",
          iconClassName
        )}
      />
      {title && (
        <h3 className={cn("mt-4 text-lg font-semibold", titleClassName)}>
          {title}
        </h3>
      )}
      {description && (
        <p
          className={cn(
            "mt-2 text-sm text-muted-foreground mb-6",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <Link href={action.href}>
          <Button size="sm" className="gap-2">
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </Button>
        </Link>
      )}
      {render}
    </div>
  );
}

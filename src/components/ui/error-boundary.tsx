"use client";

import { type ReactNode } from "react";

import { AlertTriangle } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import { ErrorState } from "@/components/ui/error-state";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export function ErrorBoundaryWrapper({
  children,
  fallbackMessage,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        const errorMessage =
          fallbackMessage ??
          (error instanceof Error
            ? error.message
            : "An unexpected error occurred");

        return (
          <ErrorState
            icon={AlertTriangle}
            title="Something went wrong"
            description={errorMessage}
            action={{
              label: "Try again",
              onClick: resetErrorBoundary,
            }}
          />
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

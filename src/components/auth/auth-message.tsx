import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface AuthMessageProps {
  success: boolean;
  message: string;
}

export default function AuthMessage({ success, message }: AuthMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm px-3 h-10 py-2 rounded-md border",
        success
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
          : "bg-destructive/10 border-destructive/30 text-destructive dark:bg-destructive/20 dark:border-destructive/30 dark:text-red-500"
      )}
    >
      {success ? (
        <CheckCircle2
          className={cn(
            "h-4 w-4 shrink-0",
            success ? "text-emerald-600 dark:text-emerald-400" : ""
          )}
        />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

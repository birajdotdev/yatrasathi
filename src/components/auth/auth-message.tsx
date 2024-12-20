import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface AuthMessageProps {
  success: boolean;
  message: string;
}

export default function AuthMessage({ success, message }: AuthMessageProps) {
  return (
    <Alert
      variant={success ? "default" : "destructive"}
      className={cn(
        "border",
        success
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-destructive/10 border-destructive/50 text-destructive"
      )}
    >
      <AlertDescription className="flex items-center gap-2">
        {success ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        {message}
      </AlertDescription>
    </Alert>
  );
}

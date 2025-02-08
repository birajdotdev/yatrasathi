import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <LoaderCircle className="size-8 animate-spin text-primary" />
    </div>
  );
}

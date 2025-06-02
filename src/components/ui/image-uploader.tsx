"use client";

import Image from "next/image";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteFiles } from "@/actions/uploadthing";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  className,
}: ImageUploaderProps) {
  const handleDelete = async () => {
    if (!value) return;

    try {
      // Extract fileKey from the URL
      const fileKey = value.split("/").pop();
      if (!fileKey) return;

      await deleteFiles([fileKey]);
      onChange(null);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Error deleting image:", error);
    }
  };
  return (
    <div className={cn("w-full", className)}>
      {!value ? (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              onChange(res[0].ufsUrl);
            }
            toast.success("Image uploaded successfully");
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload failed: ${error.message}`);
          }}
          appearance={{
            button:
              "bg-primary text-white dark:bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/80",
            container:
              "bg-background border-dashed border-2 border-muted-foreground/20 rounded-lg",
            label: "text-muted-foreground hover:text-primary/90",
            allowedContent: "text-muted-foreground text-sm",
          }}
        />
      ) : (
        <div className="group relative h-72 w-full overflow-hidden rounded-lg">
          <Image src={value} alt="Cover image" fill className="object-cover" />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-black/50 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

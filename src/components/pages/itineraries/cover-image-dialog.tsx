"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";

import { Check, Loader2, Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type ImageResult } from "@/server/api/routers/unsplash";
import { api } from "@/trpc/react";
import { UploadDropzone } from "@/utils/uploadthing";

interface ChangeCoverImageDialogProps {
  children: ReactNode;
  onImageSelected: (imageUrl: string) => Promise<void>;
  defaultSearchQuery?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  asChild?: boolean;
  isSubmitting?: boolean;
}

export default function CoverImageDialog({
  children,
  onImageSelected,
  defaultSearchQuery = "travel",
  dialogTitle = "Change Cover Image",
  dialogDescription = "Choose a new cover image from Unsplash or upload your own.",
  asChild = true,
  isSubmitting = false,
}: ChangeCoverImageDialogProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("unsplash");
  const [open, setOpen] = useState(false);

  // Use the Unsplash API through tRPC
  const { data: images = [], isLoading } = api.unsplash.getImages.useQuery({
    query:
      debouncedSearchQuery.trim() === ""
        ? defaultSearchQuery
        : debouncedSearchQuery,
    count: 20,
    orientation: "landscape",
  });

  const handleSave = async () => {
    try {
      // Use either the Unsplash image or uploaded image depending on active tab
      if (activeTab === "unsplash" && selectedImage) {
        await onImageSelected(selectedImage.url);
      } else if (activeTab === "upload" && uploadedImageUrl) {
        await onImageSelected(uploadedImageUrl);
      }

      // Close dialog on success - parent component handles toast notification
      setOpen(false);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Error in cover image dialog:", error);
    }
  };

  const handleImageClick = (image: ImageResult) => {
    // If the image is already selected, deselect it
    if (selectedImage?.url === image.url) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        // Reset states when the dialog is closed
        if (!newOpen) {
          setSelectedImage(null);
          setUploadedImageUrl(null);
          setSearchQuery("");
          setActiveTab("unsplash");
        }
      }}
    >
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="unsplash" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="unsplash" className="space-y-4 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for an image..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9"
              />
            </div>

            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-48">
                <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative cursor-pointer rounded-md overflow-hidden aspect-video transition-all border-2",
                          selectedImage?.url === image.url
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        )}
                        onClick={() => handleImageClick(image)}
                      >
                        <Image
                          src={image.smallUrl ?? image.url}
                          alt={image.altDescription ?? "Unsplash image"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {selectedImage?.url === image.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="size-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-48 col-span-full text-center text-muted-foreground">
                      No images found. Try a different search term.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          <TabsContent value="upload" className="mt-2">
            {uploadedImageUrl ? (
              <div>
                <div className="relative w-full bg-muted h-60 rounded-md overflow-hidden">
                  <Image
                    src={uploadedImageUrl}
                    alt="Uploaded image"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setUploadedImageUrl(null)}
                    className="absolute top-2 right-2 rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-background/90 shadow-sm"
                    aria-label="Remove uploaded image"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res[0]?.ufsUrl) {
                    setUploadedImageUrl(res[0].ufsUrl);
                  }
                }}
                appearance={{
                  button: "!bg-primary",
                  label: "hover:text-primary",
                  container: "border dark:border-muted !m-0",
                }}
              />
            )}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={
              (activeTab === "unsplash" && !selectedImage) ||
              (activeTab === "upload" && !uploadedImageUrl) ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

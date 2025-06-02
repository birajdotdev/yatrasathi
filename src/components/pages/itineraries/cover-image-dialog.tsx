"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";

import { Check, Search, X } from "lucide-react";
import { useInView } from "react-intersection-observer";
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
import { UploadDropzone } from "@/lib/uploadthing";
import { cn, splitTitle } from "@/lib/utils";
import { type ImageResult } from "@/server/api/routers/unsplash";
import { api } from "@/trpc/react";

import { ImageGridSkeleton } from "./image-grid-skeleton";

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

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.unsplash.getImages.useInfiniteQuery(
      {
        query:
          debouncedSearchQuery.trim() === ""
            ? defaultSearchQuery
            : debouncedSearchQuery,
        count: 20,
        orientation: "landscape",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const [ref] = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
  });

  const title = splitTitle(dialogTitle, {
    lastWordCount: 2,
  });

  const allImages = data?.pages.flatMap((page) => page.images) ?? [];

  const handleSave = async () => {
    try {
      if (activeTab === "unsplash" && selectedImage) {
        await onImageSelected(selectedImage.url);
      } else if (activeTab === "upload" && uploadedImageUrl) {
        await onImageSelected(uploadedImageUrl);
      }
      setOpen(false);
    } catch (error) {
      console.error("Error in cover image dialog:", error);
    }
  };

  const handleImageClick = (image: ImageResult) => {
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
          <DialogTitle>
            {title[0]} <span className="text-primary">{title[1]}</span>
          </DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="unsplash" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="unsplash" className="mt-2 space-y-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for an image..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9"
              />
            </div>

            <ScrollArea className="h-48">
              <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {isLoading ? (
                  <ImageGridSkeleton count={12} className="col-span-full" />
                ) : (
                  <>
                    {allImages.length > 0 ? (
                      <>
                        {allImages.map((image: ImageResult, index: number) => (
                          <div
                            key={index}
                            className={cn(
                              "relative aspect-video cursor-pointer overflow-hidden rounded-md border-2 transition-all",
                              selectedImage?.url === image.url
                                ? "border-primary"
                                : "border-transparent hover:border-primary/80"
                            )}
                            onClick={() => handleImageClick(image)}
                          >
                            <Image
                              src={image.smallUrl ?? image.url}
                              alt={image.altDescription ?? "Unsplash image"}
                              fill
                              className="bg-primary/10 object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              fetchPriority="high"
                            />
                            {selectedImage?.url === image.url && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                <div className="rounded-full bg-primary p-1 text-primary-foreground">
                                  <Check className="size-4" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {(hasNextPage || isFetchingNextPage) && (
                          <>
                            {isFetchingNextPage ? (
                              <ImageGridSkeleton
                                count={4}
                                className="col-span-full"
                              />
                            ) : (
                              <div ref={ref} className="h-8" />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="col-span-full flex h-48 items-center justify-center text-center text-muted-foreground">
                        No images found. Try a different search term.
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="upload" className="mt-2">
            {uploadedImageUrl ? (
              <div>
                <div className="relative h-60 w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={uploadedImageUrl}
                    alt="Uploaded image"
                    fill
                    className="object-cover"
                    fetchPriority="high"
                  />
                  <button
                    onClick={() => setUploadedImageUrl(null)}
                    className="absolute top-2 right-2 rounded-full bg-background/80 p-1 shadow-sm backdrop-blur-sm transition-colors hover:bg-background/90"
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

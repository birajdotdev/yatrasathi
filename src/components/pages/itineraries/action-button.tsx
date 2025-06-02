"use client";

import { Trash } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

interface DeleteButtonProps {
  itineraryId: string;
}

export default function DeleteItineraryButton({
  itineraryId,
}: DeleteButtonProps) {
  const utils = api.useUtils();

  const { mutateAsync: deleteItinerary, isPending } =
    api.itinerary.delete.useMutation({
      onSuccess: () => {
        void utils.itinerary.getAll.invalidate();
      },
    });

  const handleDelete = async () => {
    // Show loading toast and store its ID
    const loadingToastId = toast.loading("Deleting itinerary...");

    try {
      await deleteItinerary({ id: itineraryId });
      toast.dismiss(loadingToastId);
      toast.success("Itinerary deleted successfully");
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete itinerary"
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          aria-label="Delete itinerary"
          className="size-8 cursor-pointer rounded-full"
          variant="destructive"
          disabled={isPending}
        >
          <Trash className="size-4" />
          <span className="sr-only">Delete itinerary</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this itinerary?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            itinerary.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

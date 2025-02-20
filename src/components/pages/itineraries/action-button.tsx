"use client";

import { useRouter } from "next/navigation";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";

interface ActionButtonProps {
  itineraryId: string;
}

export default function ActionButton({ itineraryId }: ActionButtonProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const deleteMutation = api.itinerary.delete.useMutation({
    onSuccess: () => {
      toast.success("Itinerary deleted successfully");
      void utils.itinerary.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete itinerary");
    },
  });

  const handleDelete = (id: string) => {
    void deleteMutation.mutateAsync({ id });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background/90 dark:bg-background/40 dark:hover:bg-background/50"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px] animate-in fade-in-0 zoom-in-95"
      >
        <DropdownMenuItem
          className="gap-2"
          onClick={() => router.push(`/itineraries/${itineraryId}/edit`)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => handleDelete(itineraryId)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

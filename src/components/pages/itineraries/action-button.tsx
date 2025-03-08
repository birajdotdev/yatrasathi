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
          className="h-8 w-8 rounded-full bg-background/90 shadow-xs backdrop-blur-lg transition-all hover:bg-background/95 hover:shadow-md dark:bg-background/50 dark:hover:bg-background/60"
        >
          <MoreHorizontal className="h-4 w-4 text-foreground/80" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px] animate-in fade-in-0 zoom-in-95 rounded-lg border-border/50 bg-background/95 p-1 shadow-xl backdrop-blur-lg dark:bg-background/90"
      >
        <DropdownMenuItem
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
          onClick={() => router.push(`/itineraries/${itineraryId}/edit`)}
        >
          <Pencil className="h-4 w-4 text-foreground/70" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-destructive/90 transition-colors hover:bg-destructive/10 hover:text-destructive dark:text-destructive/80 dark:hover:bg-destructive/20 dark:hover:text-destructive"
          onClick={() => handleDelete(itineraryId)}
        >
          <Trash className="h-4 w-4 text-destructive/70" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

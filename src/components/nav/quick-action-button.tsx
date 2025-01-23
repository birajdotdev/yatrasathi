import { Calendar, PenTool, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function QuickActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Quick actions"
          className="rounded-lg data-[state=open]:bg-muted hover:bg-muted/50 transition-colors"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] rounded-lg min-w-56"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-sm font-semibold">
          Quick actions
        </DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
          <Calendar size={18} className="text-muted-foreground" />
          <span>Plan new trip</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
          <PenTool size={18} className="text-muted-foreground" />
          <span>Write blog post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

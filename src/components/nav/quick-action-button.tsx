import { Calendar, PenTool, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function QuickActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Add new item"
          className="rounded-lg data-[state=open]:bg-muted"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] rounded-lg min-w-48"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem>
          <Calendar />
          Plan new trip
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PenTool />
          Write blog post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

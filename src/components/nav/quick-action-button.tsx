import Link from "next/link";

import { CalendarDays, PenTool, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const quickActions = [
  {
    icon: CalendarDays,
    title: "Itinerary",
    description: "Plan new trip",
    href: "/itineraries/create",
  },
  {
    icon: PenTool,
    title: "Blog",
    description: "Write blog post",
    href: "/blogs/create",
  },
];

export default function QuickActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Quick actions"
          className="rounded-lg transition-colors data-[state=open]:bg-muted"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" align="end">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Quick Actions
        </DropdownMenuLabel>
        {quickActions.map((action) => (
          <DropdownMenuItem
            className="group cursor-pointer rounded-md"
            key={action.title}
            asChild
          >
            <Link href={action.href}>
              <div
                className="flex size-8 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary"
                aria-hidden="true"
              >
                <action.icon
                  size={16}
                  strokeWidth={2}
                  className="text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                />
              </div>
              <div>
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

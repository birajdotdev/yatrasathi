"use client";

import Link from "next/link";

import { Bell, ChevronsUpDown, CreditCard, Sparkles, User } from "lucide-react";

import ReminderPreferencesDialog from "@/components/notifications/reminder-preferences-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";

import LogoutButton from "./logout-button";

interface SidebarUserProps {
  name: string;
  imageUrl: string;
  isProUser: boolean;
}

export function SidebarUser({ name, imageUrl, isProUser }: SidebarUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs capitalize">
                  {isProUser ? "Pro" : "Free"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={imageUrl} alt={name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs capitalize">
                    {isProUser ? "Pro" : "Free"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isProUser && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/subscription">
                      <Sparkles />
                      Upgrade to Pro
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <User />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription">
                  <CreditCard />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <ReminderPreferencesDialog>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Bell />
                  Reminders
                </DropdownMenuItem>
              </ReminderPreferencesDialog>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

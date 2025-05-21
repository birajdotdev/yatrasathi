"use client";

import Link from "next/link";
import { useState } from "react";

import { Bell, ChevronsUpDown, CreditCard, Sparkles } from "lucide-react";

import ReminderPreferencesDialog from "@/components/notifications/reminder-preferences-dialog";
import AccountButton from "@/components/sidebar/account-button";
import LogoutButton from "@/components/sidebar/logout-button";
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
import { env } from "@/env";
import { getInitials } from "@/lib/utils";
import { api } from "@/trpc/react";

export function SidebarUser() {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user] = api.user.getCurrentUser.useSuspenseQuery();

  const CHECKOUT_URL = `/api/checkout?products=${env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID}&customerId=${user?.polarCustomerId}`;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs capitalize">
                  {user?.plan}
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
                  <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs capitalize">
                    {user?.plan}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.plan === "free" && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={CHECKOUT_URL}>
                      <Sparkles />
                      Upgrade to Pro
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <AccountButton />
              <DropdownMenuItem asChild>
                <Link href="/api/portal">
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
            <LogoutButton setIsOpen={setIsOpen} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

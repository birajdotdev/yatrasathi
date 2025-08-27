"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Bell, ChevronsUpDown, LogOut, Settings, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

import ReminderPreferencesDialog from "../notifications/reminder-preferences-dialog";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dialog, DialogTrigger } from "../ui/dialog";
import LogoutAlertDialog from "./logout-alert-dialog";

interface UserInfoProps {
  user: {
    imageUrl: string;
    fullName: string | null;
    username: string | null;
    emailAddresses: { emailAddress: string }[];
  };
  isProUser: boolean;
}

function UserInfo({ user, isProUser }: UserInfoProps) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.imageUrl} alt={user.fullName ?? "User avatar"} />
        <AvatarFallback className="rounded-lg">
          {getInitials(user.fullName ?? "")}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <p className="space-x-2 truncate font-semibold">
          <span>{user.fullName}</span>
          <Badge
            className="h-4 rounded-full px-1.5 py-0 text-[10px] leading-none"
            variant={isProUser ? "default" : "secondary"}
          >
            {isProUser ? "Pro" : "Free"}
          </Badge>
        </p>
        <span className="truncate text-xs">
          {user.username
            ? `@${user.username}`
            : (user.emailAddresses[0]?.emailAddress ?? null)}
        </span>
      </div>
    </>
  );
}

export function SidebarUser() {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { has } = useAuth();
  const isProUser = has?.({ plan: "pro" }) ?? false;

  const { openUserProfile, user } = useClerk();

  if (!user) {
    return <SidebarUserSkeleton />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <AlertDialog>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserInfo user={user} isProUser={isProUser} />
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
                    <UserInfo user={user} isProUser={isProUser} />
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
                  <DropdownMenuItem
                    onClick={() =>
                      openUserProfile({
                        appearance: {
                          elements: {
                            formFieldRow__username: {
                              display: "block",
                            },
                          },
                        },
                      })
                    }
                  >
                    <Settings />
                    Account
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <Bell />
                      Reminders
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <ReminderPreferencesDialog />
            <LogoutAlertDialog />
          </AlertDialog>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center space-x-2 truncate font-semibold">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
            <Skeleton className="mt-1 h-3 w-16" />
          </div>
          <Skeleton className="ml-auto h-6 w-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

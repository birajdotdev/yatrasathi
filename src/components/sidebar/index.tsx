import Link from "next/link";
import React from "react";

import SidebarMain from "@/components/sidebar/sidebar-main";
import { SidebarUser } from "@/components/sidebar/sidebar-user";
import Logo from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { currentUser } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  if (!user) return null;

  void api.user.getReminderPreferences.prefetch();

  return (
    <HydrateClient>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard">
                <SidebarMenuButton size="lg" asChild>
                  <Logo className="h-12 w-auto" />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMain />
          {/* <SidebarSecondary className="mt-auto" /> */}
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser
            name={user.fullName ?? ""}
            username={user?.username ?? ""}
            imageUrl={user.imageUrl}
          />
        </SidebarFooter>
      </Sidebar>
    </HydrateClient>
  );
}

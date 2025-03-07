import Link from "next/link";
import React from "react";

import { currentUser } from "@clerk/nextjs/server";

import SidebarMain from "@/components/sidebar/sidebar-main";
import SidebarSecondary from "@/components/sidebar/sidebar-secondary";
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

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const userData = await currentUser();
  const user = {
    name: userData?.fullName ?? "",
    email: userData?.emailAddresses[0]?.emailAddress ?? "",
    avatar: userData?.imageUrl ?? "",
  };

  return (
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
        <SidebarSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

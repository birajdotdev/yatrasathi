import Link from "next/link";
import React from "react";

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
import sidebarData from "@/data/sidebar-data";
import { auth } from "@/server/auth";

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  const user = {
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
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
        <SidebarMain items={sidebarData.sidebarMain} />
        <SidebarSecondary
          items={sidebarData.sidebarSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

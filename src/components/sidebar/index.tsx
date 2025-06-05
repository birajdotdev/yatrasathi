import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
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
import { auth } from "@/server/auth";

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

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
        {/* <SidebarSecondary className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser
          name={session.user.name}
          imageUrl={session.user.image ?? ""}
          isProUser={false}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

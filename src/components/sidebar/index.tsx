import Link from "next/link";
import React from "react";

import { RedirectToSignIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

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

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  const { has } = await auth();
  const isProUser = has({ plan: "pro" });

  if (user === null) return <RedirectToSignIn />;

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
          name={user.fullName ?? ""}
          imageUrl={user.imageUrl}
          isProUser={isProUser}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

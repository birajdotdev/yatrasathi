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
import { auth, currentUser } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  const { userId, has, redirectToSignIn } = await auth();
  if (user === null || userId === null) return redirectToSignIn();
  const isProUser = has({ plan: "pro" });

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
            imageUrl={user.imageUrl}
            isProUser={isProUser}
          />
        </SidebarFooter>
      </Sidebar>
    </HydrateClient>
  );
}

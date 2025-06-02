import React from "react";

import DashboardNav from "@/components/nav/dashboard-nav";
import AppSidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await Promise.all([
    void api.user.getReminderPreferences.prefetch(),
    void api.notification.getNotifications.prefetch(),
  ]);
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardNav />
          <main className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-5rem)]">{children}</ScrollArea>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}

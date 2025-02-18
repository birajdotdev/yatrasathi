import React from "react";

import DashboardNav from "@/components/nav/dashboard-nav";
import AppSidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNav />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <section className="p-6 lg:p-8">{children}</section>
          </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

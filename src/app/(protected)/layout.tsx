import React from "react";

import DashboardNav from "@/components/nav/dashboard-nav";
import AppSidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNav />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-5rem)]">{children}</ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

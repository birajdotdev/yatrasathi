import React from "react";

import AppSidebar from "@/components/sidebar";
import SidebarHeader from "@/components/sidebar/sidebar-header";
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
        <SidebarHeader />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-4rem)]">{children}</ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import React from "react";

import AppHeader from "@/components/sidebar/app-header";
import AppSidebar from "@/components/sidebar/app-sidebar";
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
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-4rem)]">{children}</ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

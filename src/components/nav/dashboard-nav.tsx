import NotificationButton from "@/components/nav/notification-button";
import SearchDialog from "@/components/nav/search-dialog";
import ThemeToggle from "@/components/nav/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HydrateClient, api } from "@/trpc/server";

import NavBreadcrumbs from "./nav-breadcrumbs";
import QuickActionButton from "./quick-action-button";

export default function DashboardNav() {
  void api.notification.getNotifications.prefetch();
  return (
    <HydrateClient>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <NavBreadcrumbs />
        </div>
        <div className="flex items-center gap-3">
          <SearchDialog />
          <QuickActionButton />
          <NotificationButton />
          <ThemeToggle />
        </div>
      </header>
    </HydrateClient>
  );
}

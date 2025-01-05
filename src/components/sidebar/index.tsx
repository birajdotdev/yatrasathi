import {
  Calendar,
  CreditCard,
  Globe,
  Home,
  PenTool,
  Settings,
} from "lucide-react";

import {
  type SidebarItem,
  SidebarItems,
} from "@/components/sidebar/sidebar-items";
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

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", url: "/dashboard", icon: Home },
  { name: "Explore", url: "/explore", icon: Globe },
  { name: "Itineraries", url: "/itineraries", icon: Calendar },
  { name: "Blog", url: "/blog", icon: PenTool },
  { name: "Credits", url: "/credits", icon: CreditCard },
  { name: "Settings", url: "/settings", icon: Settings },
];

export default async function AppSidebar() {
  const session = await auth();
  const user = {
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Logo className="h-auto w-full" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarItems items={sidebarItems} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

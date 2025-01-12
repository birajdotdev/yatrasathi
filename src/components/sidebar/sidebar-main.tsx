"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import sidebarData from "@/data/sidebar-data";

type SidebarMainProps = React.ComponentPropsWithoutRef<typeof SidebarGroup>;

export default function SidebarMain({ ...props }: SidebarMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarData.sidebarMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={pathname === item.url || pathname.startsWith(item.url)}
              asChild
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

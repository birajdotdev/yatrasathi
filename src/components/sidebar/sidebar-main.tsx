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
import { sidebarData } from "@/data/sidebar-data";

type SidebarMainProps = React.ComponentPropsWithoutRef<typeof SidebarGroup>;

export default function SidebarMain({ ...props }: SidebarMainProps) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url);
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarData.sidebarMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={isActive(item.url)}
              data-active={isActive(item.url)}
              className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium transition-all duration-300"
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

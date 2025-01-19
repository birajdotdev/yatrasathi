"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import sidebarData from "@/data/sidebar-data";

type SidebarSecondaryProps = React.ComponentPropsWithoutRef<
  typeof SidebarGroup
>;

export default function SidebarSecondary({ ...props }: SidebarSecondaryProps) {
  const pathname = usePathname();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarData.sidebarSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={
                  pathname === item.url || pathname.startsWith(item.url)
                }
                asChild
                size="sm"
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

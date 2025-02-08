"use client";

import { useClerk } from "@clerk/nextjs";
import { BadgeCheck } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function AccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <DropdownMenuItem onClick={() => openUserProfile()}>
      <BadgeCheck />
      Account
    </DropdownMenuItem>
  );
}

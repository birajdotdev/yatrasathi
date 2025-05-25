"use client";

import { useClerk } from "@clerk/nextjs";
import { User } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function AccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <DropdownMenuItem onClick={() => openUserProfile()}>
      <User />
      Account
    </DropdownMenuItem>
  );
}

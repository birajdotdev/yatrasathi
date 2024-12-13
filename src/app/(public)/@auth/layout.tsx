"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function AuthModalLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        router.back();
      }}
    >
      <DialogContent className="gap-0 border-none bg-transparent p-0 sm:max-w-sm">
        <DialogHeader hidden>
          <DialogTitle />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";

import { DialogDescription } from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AuthModalLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  const onDismiss = () => {
    router.push("/");
  };

  return (
    <Dialog open={isAuthRoute} onOpenChange={() => onDismiss()}>
      <DialogContent className="gap-0 border-none bg-transparent p-0 w-fit z-50">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

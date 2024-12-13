"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

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
      <DialogContent className="gap-0 border-none bg-transparent p-0 sm:max-w-sm">
        <DialogHeader hidden>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

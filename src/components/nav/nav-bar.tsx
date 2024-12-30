import Link from "next/link";

import { Menu } from "lucide-react";

import ModeToggle from "@/components/nav/mode-toggle";
import NavItems from "@/components/nav/nav-items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getNavItems } from "@/lib/nav-items";
import { getInitials } from "@/lib/utils";
import { auth } from "@/server/auth";

export default async function NavBar() {
  const session = await auth();
  const navItems = await getNavItems();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <div className="hidden items-center space-x-8 md:flex">
          <div className="flex items-center space-x-6">
            <NavItems items={navItems} />
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {!session?.user ? (
              <Button
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                asChild
              >
                <Link href="/signin">Sign in</Link>
              </Button>
            ) : (
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>
                  {getInitials(session.user.name ?? "")}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open menu"
                asChild
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left text-lg font-bold">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col space-y-4">
                <NavItems items={navItems} mobile />
              </nav>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium text-muted-foreground">
                  Toggle Mode
                </span>
                <ModeToggle />
              </div>
              <SheetFooter className="mt-8 flex-col items-stretch space-y-4 sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0">
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto" asChild>
                    <Link href="/signin">Sign in</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import NavItems from "@/components/nav/nav-items";
import ThemeToggle from "@/components/nav/theme-toggle";
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
import { navItems } from "@/data/nav-items";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <div className="hidden items-center space-x-8 md:flex">
          <div className="flex items-center space-x-6">
            <NavItems items={navItems} />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle variant="ghost" />
            <Button variant="ghost" asChild>
              <SignInButton mode="modal">Sign in</SignInButton>
            </Button>
            <Button asChild>
              <SignUpButton mode="modal">Sign up</SignUpButton>
            </Button>
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
                <ThemeToggle />
              </div>
              <SheetFooter className="mt-8 flex-col items-stretch space-y-4 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <SignInButton mode="modal">Sign in</SignInButton>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">
                    <SignUpButton mode="modal">Sign up</SignUpButton>
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

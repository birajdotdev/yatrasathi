import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "./logo";
import MenuItems, { type MenuItem } from "./menu-items";

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
];

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <div className="hidden items-center space-x-8 md:flex">
          <div className="flex items-center space-x-6">
            <MenuItems items={menuItems} />
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Log in
            </Button>
            <Button className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Sign up
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
                <MenuItems items={menuItems} mobile />
              </nav>
              <SheetFooter className="mt-8 flex-col items-stretch space-y-4 sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Log in
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">Sign up</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

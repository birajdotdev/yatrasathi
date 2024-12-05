import { Compass } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          <Compass className="size-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            Yatra<span className="text-primary">Sathi</span>
          </h1>
        </div>
        <div className="hidden items-center space-x-4 md:flex">
          <nav className="items-center space-x-6 md:flex">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium underline-offset-4 hover:text-primary hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-x-4">
          <Button
            variant="ghost"
            className="rounded-full border-primary text-primary hover:text-primary md:inline-flex"
          >
            Log in
          </Button>
          <Button className="rounded-full md:inline-flex">Sign up</Button>
        </div>
      </div>
    </nav>
  );
}

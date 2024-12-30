import { type NavItem } from "@/components/nav/nav-items";

export const navItemsPublic: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Benefits", href: "#benefits" },
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
];

export const navItemsProtected: NavItem[] = [
  { label: "Home", href: "/home" },
  { label: "Itineraries", href: "/itineraries" },
  { label: "Blogs", href: "/blogs" },
];

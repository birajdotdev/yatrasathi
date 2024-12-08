import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./nav/logo";

export default function Footer() {
  return (
    <footer className="bg-secondary text-foreground">
      <div className="container mx-auto px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground">Your Journey, Simplified</p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {["About Us", "Features", "Pricing", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  info@yatrasathi.com
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+977 1234567890</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Newsletter</h4>
            <p className="mb-4 text-muted-foreground">
              Stay updated with our latest offers and travel tips.
            </p>
            <form className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="w-fit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center dark:border-secondary-foreground">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} YatraSathi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
  return (
    <footer className="bg-sky-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-emerald-400">
              YatraSathi
            </h3>
            <p className="text-sm text-sky-300">Your Journey, Simplified</p>
          </div>
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-emerald-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["About Us", "Privacy Policy", "Terms of Service"].map(
                (link, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-sm text-sky-300 hover:text-white"
                    >
                      {link}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-emerald-400">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                  name: "Facebook",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                  name: "Instagram",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ),
                  name: "Twitter",
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-sky-300 hover:text-white"
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-emerald-400">
              Newsletter
            </h3>
            <form className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-l-md border-sky-700 bg-sky-800 text-white placeholder-sky-400"
              />
              <Button
                type="submit"
                className="rounded-l-none bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-sky-800 pt-8 text-center text-sm text-sky-400">
          © {new Date().getFullYear()} YatraSathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import { Compass } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-1 transition-colors hover:text-primary"
      aria-label="YatraSathi Home"
    >
      <Compass className="size-7 text-primary" aria-hidden="true" />
      <h1 className="text-xl font-bold">
        Yatra<span className="text-primary">Sathi</span>
      </h1>
    </Link>
  );
}

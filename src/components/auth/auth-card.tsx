import Logo from "@/components/nav/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialButtons from "./social-buttons";
import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  social?: boolean;
  bottomLinkLabel: string;
  bottomLinkHref: string;
  bottomLink: string;
}

export default function AuthCard({
  children,
  title,
  description,
  social = false,
  bottomLinkLabel,
  bottomLinkHref,
  bottomLink,
}: AuthCardProps) {
  return (
    <Card className="flex min-h-screen w-full flex-col justify-center overflow-hidden rounded-none md:min-h-fit md:max-w-sm md:rounded-xl md:shadow-xl">
      <CardHeader className="flex flex-col items-center space-y-4 pt-6 text-center">
        <Logo />
        <div>
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col items-center gap-5">
        {social && <SocialButtons />}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {bottomLinkLabel}{" "}
          <Link
            href={bottomLinkHref}
            className="font-medium text-primary hover:underline"
          >
            {bottomLink}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

import { redirect } from "next/navigation";

import {
  Benefits,
  Features,
  Hero,
  Testimonials,
} from "@/components/landing-page";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { auth } from "@/server/auth";

export default async function LandingPage() {
  const session = await auth();

  if (session) return redirect(DEFAULT_LOGIN_REDIRECT);

  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
    </>
  );
}

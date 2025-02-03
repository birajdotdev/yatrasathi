import {
  Benefits,
  Features,
  Hero,
  Testimonials,
} from "@/components/landing-page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
    </>
  );
}

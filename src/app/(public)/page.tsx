import {
  Benefits,
  Features,
  Hero,
  Testimonials,
} from "@/components/landing-page";

export default async function LandingPage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
    </>
  );
}

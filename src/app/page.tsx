import NavBar from "@/components/nav/nav-bar";
import {
  Hero,
  Benefits,
  Testimonials,
  Features,
} from "@/components/landing-page";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
    </>
  );
}

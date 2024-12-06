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
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

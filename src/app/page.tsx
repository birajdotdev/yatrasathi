import NavBar from "@/components/nav/nav-bar";
import { Hero, Features, Testimonials } from "@/components/landing-page";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

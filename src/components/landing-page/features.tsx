import { MapPin, Calendar, Users, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function Features() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-sky-800">
          Our Features
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              title: "AI-Powered Itinerary Generation",
              description: "Create personalized travel plans in minutes",
            },
            {
              icon: Calendar,
              title: "Personalized Travel Recommendations",
              description: "Discover hidden gems tailored to your preferences",
            },
            {
              icon: Users,
              title: "Community Blog and Tips",
              description: "Share and learn from fellow travelers",
            },
            {
              icon: Shield,
              title: "Secure Subscription and Payments",
              description: "Travel worry-free with our secure platform",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="border-sky-200 bg-sky-50 transition-all hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <feature.icon className="mb-4 h-12 w-12 text-emerald-600" />
                <h3 className="mb-2 text-lg font-semibold text-sky-700">
                  {feature.title}
                </h3>
                <p className="text-sm text-sky-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

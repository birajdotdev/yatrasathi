import { type Metadata } from "next";

import CreateItineraryForm from "@/components/pages/itineraries/create-itinerary-form";

export const metadata: Metadata = {
  title: "Create Itinerary",
  description: "Create a new itinerary to plan your perfect trip.",
};

export default function CreateItineraryPage() {
  return (
    <section className="container mx-auto p-6 lg:p-8">
      <main className="flex flex-col justify-center items-center min-h-[calc(100vh-9rem)]">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            Create New <span className="text-primary">Itinerary</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Plan your perfect trip step by step.
          </p>
        </div>
        <CreateItineraryForm />
      </main>
    </section>
  );
}

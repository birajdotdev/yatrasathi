import { type Metadata } from "next";

import CreateItineraryForm from "@/components/pages/itineraries/create-itinerary-form";

export const metadata: Metadata = {
  title: "Create Itinerary",
  description: "Create a new itinerary to plan your perfect trip.",
};

export default function CreateItineraryPage() {
  return (
    <section className="container mx-auto p-6 lg:p-8">
      <main className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Create New <span className="text-primary">Itinerary</span>
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Plan your perfect trip step by step.
          </p>
        </div>
        <CreateItineraryForm />
      </main>
    </section>
  );
}

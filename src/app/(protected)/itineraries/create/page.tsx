import CreateItineraryForm from "@/components/pages/itineraries/itinerary-form";
import { Banner } from "@/components/ui/banner";

export default function CreateItinerary() {
  return (
    <main className="p-6 lg:p-8">
      <Banner
        badgeText="Plan your trip"
        title={{ text: "Create New", highlight: "Itinerary" }}
        description="Plan your perfect trip step by step."
      />
      <CreateItineraryForm />
    </main>
  );
}

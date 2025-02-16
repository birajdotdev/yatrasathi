import { CalendarPlus } from "lucide-react";

import { ItineraryForm } from "@/components/pages/itineraries/itinerary-form";
import { Banner } from "@/components/ui/banner";

export default function CreateItineraryPage() {
  return (
    <main className="space-y-6 lg:space-y-8">
      <Banner
        badgeText="Plan your trip"
        title="Create New Itinerary"
        description="Plan your perfect trip step by step."
        icon={CalendarPlus}
      />
      <ItineraryForm mode="create" />
    </main>
  );
}

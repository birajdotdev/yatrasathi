import { notFound } from "next/navigation";

import { PencilLine } from "lucide-react";

import { ItineraryForm } from "@/components/pages/itineraries";
import { Banner } from "@/components/ui/banner";
import { api } from "@/trpc/server";

interface EditItineraryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItineraryPage({
  params,
}: EditItineraryPageProps) {
  // Pre-fetch the itinerary data
  const { id } = await params;
  const itinerary = await api.itinerary.getById({ id }).catch(() => null);

  if (!itinerary) {
    notFound();
  }

  return (
    <main className="space-y-6 lg:space-y-8">
      <Banner
        badgeText="Edit trip"
        title="Edit Itinerary"
        description="Update your trip details and plans."
        icon={PencilLine}
      />
      <ItineraryForm mode="update" itineraryId={id} />
    </main>
  );
}

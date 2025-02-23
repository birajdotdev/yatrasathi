import { notFound } from "next/navigation";

import { PencilLine } from "lucide-react";

import { ItineraryForm } from "@/components/pages/itineraries";
import { Banner } from "@/components/ui/banner";
import type { ItineraryFormValues } from "@/lib/schemas/itinerary";
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

  // Transform itinerary data to match form schema
  const defaultValues: ItineraryFormValues = {
    tripTitle: itinerary.tripTitle,
    tripType: itinerary.tripType,
    coverImage: itinerary.coverImage ?? undefined,
    startDate: itinerary.startDate,
    endDate: itinerary.endDate,
    timeZone: itinerary.timeZone,
    destinations: itinerary.destinations.map((dest) => ({
      location: dest.location,
      arrivalDateTime: dest.arrivalDateTime,
      departureDateTime: dest.departureDateTime,
      notes: dest.notes ?? undefined,
    })),
    transportation: itinerary.transportation.map((trans) => ({
      mode: trans.mode,
      departureDateTime: trans.departureDateTime,
      arrivalDateTime: trans.arrivalDateTime,
      bookingReference: trans.bookingReference ?? undefined,
      attachments: trans.attachments ?? undefined,
    })),
    accommodations: itinerary.accommodations.map((acc) => ({
      name: acc.name,
      checkInDateTime: acc.checkInDateTime,
      checkOutDateTime: acc.checkOutDateTime,
      address: acc.address,
      confirmationNumber: acc.confirmationNumber ?? undefined,
    })),
    activities: itinerary.activities.map((act) => ({
      name: act.name,
      dateTime: act.dateTime,
      location: act.location,
      notes: act.notes ?? undefined,
      attachments: act.attachments ?? undefined,
    })),
    generalNotes: itinerary.generalNotes ?? undefined,
    attachments: itinerary.attachments ?? undefined,
  };

  return (
    <main className="space-y-6 lg:space-y-8">
      <Banner
        badgeText="Edit trip"
        title="Edit Itinerary"
        description="Update your trip details and plans."
        icon={PencilLine}
      />
      <ItineraryForm
        mode="update"
        itineraryId={id}
        defaultValues={defaultValues}
      />
    </main>
  );
}

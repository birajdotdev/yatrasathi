import { notFound } from "next/navigation";

import { PlusCircle } from "lucide-react";

import ActivityDialogForm from "@/components/pages/itineraries/activity-dialog-form";
import DayTimeline from "@/components/pages/itineraries/day-timeline";
import ItineraryHeader from "@/components/pages/itineraries/itinerary-header";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";

interface ItineraryViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ItineraryViewPageProps) {
  const { id } = await params;
  const itinerary = await api.itinerary.getById(id);

  if (!itinerary) notFound();

  return {
    title: itinerary.title,
    description: `Explore the itinerary for ${itinerary.destination.name}.`,
    openGraph: {
      title: `Itinerary for ${itinerary.destination.name}`,
      description: `Explore the itinerary for ${itinerary.destination.name}.`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/itineraries/${id}`,
      images: [
        {
          url: itinerary.destination.image,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ItineraryViewPage({
  params,
}: ItineraryViewPageProps) {
  const itineraryId = (await params).id;
  const itinerary = await api.itinerary.getById(itineraryId);
  void api.itinerary.getById.prefetch(itineraryId);

  const itineraryDates = {
    startDate: itinerary.startDate,
    endDate: itinerary.endDate,
  };

  if (!itinerary) notFound();

  return (
    <div className="min-h-screen -mx-8">
      <ItineraryHeader itinerary={itinerary} />
      <main className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Your <span className="text-primary">Itinerary</span>
            </h2>
            <ActivityDialogForm itineraryDates={itineraryDates}>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Activity
              </Button>
            </ActivityDialogForm>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-6">
            {itinerary.days.map((day) => (
              <DayTimeline
                key={day.date.toISOString()}
                day={day}
                itineraryDates={itineraryDates}
              />
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
}

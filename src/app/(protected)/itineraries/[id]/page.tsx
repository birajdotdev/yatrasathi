import { redirect } from "next/navigation";

import { PlusCircle } from "lucide-react";

import ActivityForm from "@/components/pages/itineraries/activity-form";
import DayTimeline from "@/components/pages/itineraries/day-timeline";
import ItineraryHeader from "@/components/pages/itineraries/itinerary-header";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/trpc/server";

interface ItineraryViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItineraryViewPage({
  params,
}: ItineraryViewPageProps) {
  const itineraryId = (await params).id;
  const itinerary = await api.itinerary.getById(itineraryId);
  // If no itinerary is found, redirect to home
  if (!itinerary) {
    return redirect("/itineraries/create");
  }

  return (
    <div className="min-h-screen">
      <ItineraryHeader itinerary={itinerary} />

      <main className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Your <span className="text-primary">Itinerary</span>
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <ActivityForm />
            </Dialog>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-6">
            {itinerary.days.map((day) => (
              <DayTimeline key={day.date.toISOString()} day={day} />
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
}

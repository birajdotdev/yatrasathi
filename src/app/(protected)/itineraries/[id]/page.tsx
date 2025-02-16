import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { format } from "date-fns";
import {
  Building2,
  CalendarCheck,
  CalendarRange,
  Clock,
  MapPin,
  PencilLine,
  Plane,
} from "lucide-react";

import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/server";

interface ItineraryDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ItineraryDetailsPage({
  params,
}: ItineraryDetailsPageProps) {
  const itinerary = await api.itinerary
    .getById({ id: params.id })
    .catch(() => null);

  if (!itinerary) {
    notFound();
  }

  return (
    <main className="space-y-6 lg:space-y-8">
      <div className="flex items-start justify-between">
        <Banner
          badgeText={itinerary.tripType}
          title={itinerary.tripTitle}
          description={`${format(itinerary.startDate, "PPP")} - ${format(
            itinerary.endDate,
            "PPP"
          )}`}
          icon={CalendarRange}
        />
        <Link href={`/itineraries/${params.id}/edit`}>
          <Button variant="outline" className="gap-2">
            <PencilLine className="h-4 w-4" />
            Edit Itinerary
          </Button>
        </Link>
      </div>

      {itinerary.coverImage && (
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
          <Image
            src={itinerary.coverImage}
            alt={itinerary.tripTitle}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.destinations.map((destination, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{destination.location}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      Arrival: {format(destination.arrivalDateTime, "PPP p")}
                    </p>
                    <p>
                      Departure:{" "}
                      {format(destination.departureDateTime, "PPP p")}
                    </p>
                    {destination.notes && (
                      <p className="mt-2">{destination.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transportation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Transportation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.transportation.map((transport, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{transport.mode}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      Departure: {format(transport.departureDateTime, "PPP p")}
                    </p>
                    <p>Arrival: {format(transport.arrivalDateTime, "PPP p")}</p>
                    {transport.bookingReference && (
                      <p>Booking Ref: {transport.bookingReference}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accommodations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Accommodations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.accommodations.map((accommodation, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{accommodation.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      Check-in: {format(accommodation.checkInDateTime, "PPP p")}
                    </p>
                    <p>
                      Check-out:{" "}
                      {format(accommodation.checkOutDateTime, "PPP p")}
                    </p>
                    <p className="mt-2">{accommodation.address}</p>
                    {accommodation.confirmationNumber && (
                      <p>Confirmation: {accommodation.confirmationNumber}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.activities.map((activity, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <p>{format(activity.dateTime, "PPP p")}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <p>{activity.location}</p>
                    </div>
                    {activity.notes && <p className="mt-2">{activity.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {itinerary.generalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{itinerary.generalNotes}</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

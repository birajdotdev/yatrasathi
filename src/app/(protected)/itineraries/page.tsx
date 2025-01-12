import { Calendar, Edit, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const itineraries = [
  {
    name: "Nepal Adventure",
    duration: "10 days",
    startDate: "June 15, 2023",
    status: "upcoming",
  },
  {
    name: "Tokyo Exploration",
    duration: "7 days",
    startDate: "August 3, 2023",
    status: "upcoming",
  },
  {
    name: "European Tour",
    duration: "14 days",
    startDate: "September 20, 2023",
    status: "upcoming",
  },
  {
    name: "Bali Getaway",
    duration: "5 days",
    startDate: "April 10, 2023",
    status: "past",
  },
  {
    name: "New York City Trip",
    duration: "4 days",
    startDate: "January 5, 2023",
    status: "past",
  },
];

export default function ItinerariesPage() {
  return (
    <main className="h-[calc(100vh-4rem)]">
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Your Itineraries
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage and view your travel plans.
          </p>
        </div>

        <div className="mb-8">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Itinerary
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div>
              <div className="space-y-4">
                {itineraries
                  .filter((i) => i.status === "upcoming")
                  .map((itinerary, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{itinerary.name}</CardTitle>
                        <CardDescription>
                          {itinerary.duration} • Starting {itinerary.startDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Itinerary details go here...
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-4 w-4" /> View
                        </Button>
                        <div>
                          <Button variant="ghost" size="sm" className="mr-2">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div>
              <div className="space-y-4">
                {itineraries
                  .filter((i) => i.status === "past")
                  .map((itinerary, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{itinerary.name}</CardTitle>
                        <CardDescription>
                          {itinerary.duration} • Started {itinerary.startDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Past itinerary details go here...
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-4 w-4" /> View
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="drafts">
            <p className="text-muted-foreground">
              You don&apos;t have any draft itineraries.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

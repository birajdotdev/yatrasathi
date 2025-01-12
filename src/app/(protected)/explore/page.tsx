"use client";

import Image from "next/image";

import { Globe, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const destinations = [
  {
    name: "Bali, Indonesia",
    description: "Tropical paradise with rich culture",
    image: "https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg",
  },
  {
    name: "Santorini, Greece",
    description: "Picturesque islands and sunsets",
    image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
  },
  {
    name: "Kyoto, Japan",
    description: "Ancient temples and traditional gardens",
    image: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg",
  },
  {
    name: "Machu Picchu, Peru",
    description: "Incan citadel set high in the Andes Mountains",
    image: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
  },
  {
    name: "Banff, Canada",
    description: "Turquoise lakes and snow-capped peaks",
    image: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
  },
  {
    name: "Marrakech, Morocco",
    description: "Vibrant markets and stunning architecture",
    image: "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg",
  },
];

export default function ExplorePage() {
  return (
    <main className="h-[calc(100vh-4rem)]">
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Explore Destinations
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover new places and plan your next adventure.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((destination, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center text-lg">
                        <MapPin className="mr-2 h-4 w-4" />
                        {destination.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="mb-4">
                        {destination.description}
                      </CardDescription>
                      <Button variant="outline" size="sm">
                        Explore
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="popular">
            <p className="text-muted-foreground">
              Popular destinations content goes here.
            </p>
          </TabsContent>
          <TabsContent value="trending">
            <p className="text-muted-foreground">
              Trending destinations content goes here.
            </p>
          </TabsContent>
          <TabsContent value="recommended">
            <p className="text-muted-foreground">
              Recommended destinations content goes here.
            </p>
          </TabsContent>
        </Tabs>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Discover More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Looking for more travel inspiration? Try our AI-powered travel
                planner to create your perfect itinerary.
              </p>
              <Button>Start Planning</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

import { type Metadata } from "next";
import Image from "next/image";

import { GlobeIcon, MapPin } from "lucide-react";

import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new places and plan your next adventure",
};

export default function ExplorePage() {
  return (
    <main className="space-y-6 lg:space-y-8">
      <Banner
        title="Explore Destinations"
        description="Discover new places and plan your next adventure."
        badgeText="Discover More"
        icon={GlobeIcon}
      />

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
    </main>
  );
}

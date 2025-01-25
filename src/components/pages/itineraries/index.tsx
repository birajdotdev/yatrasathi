"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { ItineraryCard } from "@/components/pages/dashboard/itineraries-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
};

export default function ItinerariesClient() {
  return (
    <motion.main
      className="h-[calc(100vh-4rem)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6 lg:p-8">
        {/* Welcome Banner */}
        <motion.div
          variants={itemVariants}
          className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/90 dark:to-background"
        >
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm text-primary dark:bg-primary/20">
                Travel Plans
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Itineraries
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Manage and organize all your upcoming adventures in one place.
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden rounded-full border-primary/50 px-8 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                <span>Create New Itinerary</span>
              </span>
            </Button>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="upcoming" className="mb-8">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {itineraries
                  .filter((i) => i.status === "upcoming")
                  .map((itinerary) => (
                    <ItineraryCard
                      key={itinerary.title}
                      itinerary={itinerary}
                      variants={itemVariants}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {itineraries
                  .filter((i) => i.status === "past")
                  .map((itinerary) => (
                    <ItineraryCard
                      key={itinerary.title}
                      itinerary={itinerary}
                      variants={itemVariants}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="drafts">
              <p className="text-muted-foreground">
                You don&apos;t have any draft itineraries.
              </p>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.main>
  );
}

const itineraries = [
  {
    title: "Nepal Adventure",
    remainingDays: 10,
    date: "June 15",
    status: "upcoming",
    image:
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Tokyo Exploration",
    remainingDays: 7,
    date: "August 3",
    status: "upcoming",
    image:
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "European Tour",
    remainingDays: 14,
    date: "September 20",
    status: "upcoming",
    image:
      "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Bali Getaway",
    remainingDays: 0,
    date: "April 10",
    status: "past",
    image:
      "https://images.pexels.com/photos/2166608/pexels-photo-2166608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "New York City Trip",
    remainingDays: 0,
    date: "January 5",
    status: "past",
    image:
      "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

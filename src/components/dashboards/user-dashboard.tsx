"use client";

import Image from "next/image";
import { useState } from "react";

import { type User } from "@auth/core/types";
import { motion } from "framer-motion";
import { Calendar, MapPin, PenTool, Plus, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getFirstName } from "@/lib/utils";

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

const destinations = [
  {
    name: "Bali, Indonesia",
    description: "Tropical paradise with rich culture",
    image:
      "https://images.pexels.com/photos/2166608/pexels-photo-2166608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Santorini, Greece",
    description: "Picturesque islands and sunsets",
    image:
      "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Kyoto, Japan",
    description: "Ancient temples and traditional gardens",
    image:
      "https://images.pexels.com/photos/1822605/pexels-photo-1822605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export default function UserDashboard({ user }: { user: User }) {
  const [progress, setProgress] = useState(66);

  return (
    <motion.div
      className="p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back,{" "}
          <span className="text-primary">{getFirstName(user.name!)}!</span>
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Here&apos;s an overview of your travel plans and activities.
        </p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <Progress value={progress} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {progress}% of free credits used
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Trips
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Next trip in 15 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Last post 3 days ago
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Separator className="my-8" />

      {/* Itineraries */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Itineraries
          </h2>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
        <div className="space-y-4">
          {["Nepal Adventure", "Tokyo Exploration", "European Tour"].map(
            (trip, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                  <div>
                    <CardTitle className="text-lg">{trip}</CardTitle>
                    <CardDescription className="mt-1">
                      {index === 0
                        ? "10 days • Starting June 15"
                        : index === 1
                          ? "7 days • Starting August 3"
                          : "14 days • Starting September 20"}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CardHeader>
              </Card>
            )
          )}
        </div>
      </motion.div>

      <Separator className="my-8" />

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Personalized Recommendations
        </h2>
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
                <p className="mb-4 text-sm text-muted-foreground">
                  {destination.description}
                </p>
                <Button variant="outline" size="sm">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

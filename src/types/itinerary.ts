import { type RouterOutputs } from "@/trpc/react";

export interface Destination {
  id: string;
  name: string;
  address: string;
  image: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  image?: string;
}

export interface ItineraryDay {
  date: Date;
  activities: Activity[];
}

export type Itinerary = RouterOutputs["itinerary"]["getById"];

export interface ActivityFormData {
  title: string;
  description: string;
  location: string;
  time: string;
  duration: string;
  image?: string;
}

import { type Metadata } from "next";

import ItinerariesClient from "@/components/pages/itineraries";

export const metadata: Metadata = {
  title: "Itineraries",
  description: "Manage and view your travel plans",
};

export default function ItinerariesPage() {
  return <ItinerariesClient />;
}

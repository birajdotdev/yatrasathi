import { type Itinerary } from "@/types/itinerary";

export const itinerary: Itinerary = {
  id: "itin-001",
  title: "Exploring Kathmandu",
  destination: {
    id: "dest-001",
    name: "Kathmandu",
    address: "Kathmandu Valley, Nepal",
    image:
      "https://images.unsplash.com/photo-1605640797058-58b7040a0e61?q=80&w=1633&auto=format&fit=crop",
  },
  startDate: "2025-04-27",
  endDate: "2025-04-29",
  days: [
    {
      date: "2025-04-27",
      activities: [
        {
          id: "act-001",
          title: "Arrival & Check-in",
          description:
            "Arrive at Tribhuvan International Airport and transfer to hotel in Thamel district.",
          location: "Kathmandu Airport → Thamel",
          time: "10:00",
          duration: "2h",
          image:
            "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "act-002",
          title: "Visit Durbar Square",
          description:
            "Explore the historic Kathmandu Durbar Square, a UNESCO World Heritage site with ancient temples and palaces.",
          location: "Kathmandu Durbar Square",
          time: "14:00",
          duration: "3h",
          image:
            "https://images.unsplash.com/photo-1605640797058-58b7040a0e61?q=80&w=1633&auto=format&fit=crop",
        },
        {
          id: "act-003",
          title: "Dinner at Thamel House",
          description:
            "Experience authentic Nepalese cuisine at this traditional restaurant.",
          location: "Thamel House Restaurant",
          time: "19:00",
          duration: "2h",
        },
      ],
    },
    {
      date: "2025-04-28",
      activities: [], // Empty activities for this day to show the empty state UI
    },
    {
      date: "2025-04-29",
      activities: [
        {
          id: "act-008",
          title: "Boudhanath Stupa",
          description:
            "Visit one of the largest stupas in the world and an important pilgrimage site for Tibetan Buddhists.",
          location: "Boudhanath",
          time: "09:00",
          duration: "2h",
          image:
            "https://images.unsplash.com/photo-1588422333078-44ad73367bcb?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "act-009",
          title: "Souvenir Shopping",
          description:
            "Shop for Nepalese handicrafts, singing bowls, and pashmina at Thamel's vibrant markets.",
          location: "Thamel Markets",
          time: "12:00",
          duration: "3h",
          image:
            "https://images.unsplash.com/photo-1583309219338-a582f1f9ca6d?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "act-010",
          title: "Departure",
          description:
            "Check out from hotel and transfer to Tribhuvan International Airport for departure.",
          location: "Thamel → Kathmandu Airport",
          time: "17:00",
          duration: "1.5h",
        },
      ],
    },
  ],
};

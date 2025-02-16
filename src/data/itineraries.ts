export interface Itinerary {
  title: string;
  remainingDays: number;
  date: string;
  status: "upcoming" | "past" | "draft";
  image: string;
}

export const itineraries: Itinerary[] = [
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

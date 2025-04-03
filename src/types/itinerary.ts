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
  time: string;
  duration: string;
  image?: string;
}

export interface ItineraryDay {
  date: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
}

export interface ActivityFormData {
  title: string;
  description: string;
  location: string;
  time: string;
  duration: string;
  image?: string;
}

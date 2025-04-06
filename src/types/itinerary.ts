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

export interface Itinerary {
  id: string;
  title: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
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

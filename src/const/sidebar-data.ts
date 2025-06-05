import {
  CalendarDays,
  Globe,
  Home,
  LifeBuoy,
  PenTool,
  Send,
} from "lucide-react";

export const sidebarData = {
  sidebarMain: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Explore", url: "/explore", icon: Globe },
    { title: "Itineraries", url: "/itineraries", icon: CalendarDays },
    { title: "Blogs", url: "/blogs", icon: PenTool },
  ],
  sidebarSecondary: [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
};

import {
  Calendar,
  CreditCard,
  Globe,
  Home,
  LifeBuoy,
  PenTool,
  Send,
  Settings,
} from "lucide-react";

export const sidebarData = {
  sidebarMain: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Explore", url: "/explore", icon: Globe },
    { title: "Itineraries", url: "/itineraries", icon: Calendar },
    { title: "Blog", url: "/blog", icon: PenTool },
    { title: "Credits", url: "/credits", icon: CreditCard },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
  sidebarSecondary: [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
};

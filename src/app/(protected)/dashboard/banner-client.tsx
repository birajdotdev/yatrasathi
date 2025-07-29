"use client";

import { Home } from "lucide-react";

import { Banner } from "@/components/ui/banner";
import { api } from "@/trpc/react";

export default function BannerClient() {
  const [userStats] = api.user.getUserStats.useSuspenseQuery();

  const welcomeMessage = userStats.isFirstLogIn
    ? `Welcome, ${userStats.firstName}!`
    : `Welcome back, ${userStats.firstName}!`;
  return (
    <Banner
      badgeText="Dashboard Overview"
      title={welcomeMessage}
      description="Here's an overview of your travel plans and activities."
      icon={Home}
      quickStats={{
        upcomingTrips: userStats.upcomingTripsCount,
        blogPosts: userStats.blogPostsCount,
        nextTripDays: userStats.nextTripDays ?? "--",
      }}
    />
  );
}

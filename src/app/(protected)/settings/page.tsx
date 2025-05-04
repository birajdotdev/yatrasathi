import { type Metadata } from "next";

import { Settings } from "lucide-react";

import Notifications from "@/components/settings/notifications";
import { ReminderPreferences } from "@/components/settings/reminder-preferences";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  // Fetch reminder preferences for the current user - note we use query() in client components
  // but for server components, we directly await the procedure
  const reminderPreferences = await api.user.getReminderPreferences();

  return (
    <main className="space-y-6 lg:space-y-8">
      <Banner
        badgeText="Account Settings"
        title="Your Settings"
        description="Manage your account settings and preferences"
        icon={Settings}
      />

      <Tabs defaultValue="account" className="mb-8">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@example.com"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications />
        </TabsContent>
        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Itinerary Reminders</CardTitle>
              <CardDescription>
                Manage your email reminder preferences for upcoming trips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReminderPreferences initialData={reminderPreferences} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

import { Calendar, MapPin } from "lucide-react";

import ActivityForm from "@/components/pages/itineraries/activity-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const EmptyActivities = () => {
  return (
    <div className="travel-card p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
        <Calendar className="h-8 w-8 text-travel-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Activities Planned Yet</h3>
      <p className="text-travel-muted max-w-md mb-6">
        Start building your perfect itinerary by adding activities for each day
        of your trip.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <MapPin className="h-4 w-4" />
            Create First Activity
          </Button>
        </DialogTrigger>
        <ActivityForm />
      </Dialog>
    </div>
  );
};

export default EmptyActivities;

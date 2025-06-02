import { Calendar, MapPin } from "lucide-react";

import ActivityForm from "@/components/pages/itineraries/activity-dialog-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const EmptyActivities = () => {
  return (
    <div className="travel-card flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <Calendar className="text-travel-accent h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No Activities Planned Yet</h3>
      <p className="text-travel-muted mb-6 max-w-md">
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

import { ArrowRight, Sparkles } from "lucide-react";

import DestinationSearch from "@/components/pages/itineraries/destination-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Label } from "@/components/ui/label";

export default function CreateItinerary() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-9rem)]">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Create New <span className="text-primary">Itinerary</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Plan your perfect trip step by step.
        </p>
      </div>

      <Card className="rounded-2xl w-full max-w-3xl border p-6 mb-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="destination" className="text-sm font-medium">
              Where to?
            </Label>
            <DestinationSearch />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              When are you traveling?
            </Label>
            <DatePickerWithRange />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="rounded-full group w-full sm:w-auto">
          Start planning
          <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-full sm:w-auto"
          disabled
        >
          <Sparkles />
          Generate with AI
        </Button>
      </div>
    </div>
  );
}

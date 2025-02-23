import { type Control } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { type ItineraryFormValues } from "@/lib/schemas/itinerary";

interface NotesProps {
  control: Control<ItineraryFormValues>;
}

export function Notes({ control }: NotesProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Notes & Attachments</h2>

          <FormField
            control={control}
            name="generalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any general notes, packing lists, emergency contacts, etc."
                    className="min-h-[150px]"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

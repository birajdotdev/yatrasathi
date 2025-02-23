import { format } from "date-fns";
import { PlusCircle, X } from "lucide-react";
import { type Control, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ItineraryFormValues,
  transportationModes,
} from "@/lib/schemas/itinerary";

interface TransportationProps {
  control: Control<ItineraryFormValues>;
}

export function Transportation({ control }: TransportationProps) {
  const { fields, append, remove } = useFieldArray({
    name: "transportation",
    control,
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Transportation</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  mode: "Flight",
                  departureDateTime: new Date(),
                  arrivalDateTime: new Date(),
                  bookingReference: "",
                  attachments: [],
                })
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Transportation
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              <FormField
                control={control}
                name={`transportation.${index}.mode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode of Transportation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transportationModes.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`transportation.${index}.departureDateTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={format(
                            field.value || new Date(),
                            "yyyy-MM-dd'T'HH:mm"
                          )}
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : new Date();
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`transportation.${index}.arrivalDateTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={format(
                            field.value || new Date(),
                            "yyyy-MM-dd'T'HH:mm"
                          )}
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : new Date();
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name={`transportation.${index}.bookingReference`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Reference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter booking reference"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

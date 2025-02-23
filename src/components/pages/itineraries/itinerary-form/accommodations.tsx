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
import { Textarea } from "@/components/ui/textarea";
import { type ItineraryFormValues } from "@/lib/schemas/itinerary";

interface AccommodationsProps {
  control: Control<ItineraryFormValues>;
}

export function Accommodations({ control }: AccommodationsProps) {
  const { fields, append, remove } = useFieldArray({
    name: "accommodations",
    control,
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Accommodations</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  name: "",
                  checkInDateTime: new Date(),
                  checkOutDateTime: new Date(),
                  address: "",
                  confirmationNumber: "",
                })
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Accommodation
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
                name={`accommodations.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodation Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter hotel/accommodation name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`accommodations.${index}.checkInDateTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Date & Time</FormLabel>
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
                  name={`accommodations.${index}.checkOutDateTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Date & Time</FormLabel>
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
                name={`accommodations.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter accommodation address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`accommodations.${index}.confirmationNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmation Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter confirmation number"
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

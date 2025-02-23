"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type ItineraryFormValues,
  itineraryFormSchema,
  transportationModes,
  tripTypes,
} from "@/lib/schemas/itinerary";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

type ItineraryFormProps = {
  mode?: "create" | "update";
  itineraryId?: string;
  defaultValues?: ItineraryFormValues;
};

export function ItineraryForm({
  mode = "create",
  itineraryId,
  defaultValues,
}: ItineraryFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: defaultValues ?? {
      tripTitle: "",
      tripType: "Vacation",
      startDate: new Date(),
      endDate: new Date(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      destinations: [],
      transportation: [],
      accommodations: [],
      activities: [],
      attachments: [],
      coverImage: "",
      generalNotes: "",
    },
  });

  // Create mutation
  const createMutation = api.itinerary.create.useMutation({
    onSuccess: (itinerary) => {
      toast.success("Itinerary created successfully!");
      void utils.itinerary.getAll.invalidate();
      router.push(`/itineraries/${itinerary.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update mutation
  const updateMutation = api.itinerary.update.useMutation({
    onSuccess: (itinerary) => {
      toast.success("Itinerary updated successfully!");
      void utils.itinerary.getAll.invalidate();
      router.push(`/itineraries/${itinerary.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Get itinerary data for update mode
  const { data: itineraryData } = api.itinerary.getById.useQuery(
    { id: itineraryId! },
    {
      enabled: mode === "update" && !!itineraryId,
    }
  );

  // Use useEffect to update form data when itineraryData changes
  useEffect(() => {
    if (itineraryData) {
      // Transform data to match form schema
      const formData: ItineraryFormValues = {
        tripTitle: itineraryData.tripTitle,
        tripType: itineraryData.tripType,
        coverImage: itineraryData.coverImage ?? undefined,
        startDate: itineraryData.startDate,
        endDate: itineraryData.endDate,
        timeZone: itineraryData.timeZone,
        destinations: itineraryData.destinations.map((dest) => ({
          location: dest.location,
          arrivalDateTime: dest.arrivalDateTime,
          departureDateTime: dest.departureDateTime,
          notes: dest.notes ?? undefined,
        })),
        transportation: itineraryData.transportation.map((trans) => ({
          mode: trans.mode,
          departureDateTime: trans.departureDateTime,
          arrivalDateTime: trans.arrivalDateTime,
          bookingReference: trans.bookingReference ?? undefined,
          attachments: trans.attachments ?? undefined,
        })),
        accommodations: itineraryData.accommodations.map((acc) => ({
          name: acc.name,
          checkInDateTime: acc.checkInDateTime,
          checkOutDateTime: acc.checkOutDateTime,
          address: acc.address,
          confirmationNumber: acc.confirmationNumber ?? undefined,
        })),
        activities: itineraryData.activities.map((act) => ({
          name: act.name,
          dateTime: act.dateTime,
          location: act.location,
          notes: act.notes ?? undefined,
          attachments: act.attachments ?? undefined,
        })),
        generalNotes: itineraryData.generalNotes ?? undefined,
        attachments: itineraryData.attachments ?? undefined,
      };

      form.reset(formData);
    }
  }, [form, itineraryData]);

  const {
    fields: destinationFields,
    append: appendDestination,
    remove: removeDestination,
  } = useFieldArray({
    name: "destinations",
    control: form.control,
  });

  const {
    fields: transportationFields,
    append: appendTransportation,
    remove: removeTransportation,
  } = useFieldArray({
    name: "transportation",
    control: form.control,
  });

  const {
    fields: accommodationFields,
    append: appendAccommodation,
    remove: removeAccommodation,
  } = useFieldArray({
    name: "accommodations",
    control: form.control,
  });

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    name: "activities",
    control: form.control,
  });

  function onSubmit(data: ItineraryFormValues) {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({
        id: itineraryId!,
        data,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Trip Overview Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Trip Overview</h2>

              <FormField
                control={form.control}
                name="tripTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter trip title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trip type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tripTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.getValues("startDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Intl.supportedValuesOf("timeZone").map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Destinations Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Destinations</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendDestination({
                      location: "",
                      arrivalDateTime: new Date(),
                      departureDateTime: new Date(),
                      notes: "",
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Destination
                </Button>
              </div>

              {destinationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeDestination(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
                    name={`destinations.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`destinations.${index}.arrivalDateTime`}
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

                    <FormField
                      control={form.control}
                      name={`destinations.${index}.departureDateTime`}
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
                  </div>

                  <FormField
                    control={form.control}
                    name={`destinations.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any notes about this destination"
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

        {/* Transportation Section */}
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
                    appendTransportation({
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

              {transportationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeTransportation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
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

        {/* Accommodations Section */}
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
                    appendAccommodation({
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

              {accommodationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeAccommodation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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

        {/* Activities Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Activities & Reservations
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendActivity({
                      name: "",
                      dateTime: new Date(),
                      location: "",
                      notes: "",
                      attachments: [],
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              {activityFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeActivity(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
                    name={`activities.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter activity name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`activities.${index}.dateTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
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
                    control={form.control}
                    name={`activities.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter activity location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`activities.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any notes about this activity"
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

        {/* Notes & Attachments Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Notes & Attachments</h2>

              <FormField
                control={form.control}
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/itineraries")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <span>Saving...</span>
            ) : mode === "create" ? (
              "Create Itinerary"
            ) : (
              "Update Itinerary"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

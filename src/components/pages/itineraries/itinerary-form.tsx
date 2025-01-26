"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const destinationSchema = z.object({
  name: z.string().min(1, "Destination name is required"),
  activities: z.array(z.string()),
  note: z.string().optional(),
});

const dayWiseSchema = z.object({
  date: z.date(),
  destinations: z.array(destinationSchema),
});

const formSchema = z.object({
  title: z.string().min(1, "Itinerary title is required"),
  coverImage: z.instanceof(File).optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  dayWise: z.array(dayWiseSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface ItineraryDetailsFields {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "date" | "file";
}

const itineraryDetailsFields: ItineraryDetailsFields[] = [
  {
    name: "title",
    label: "Itinerary Title",
    placeholder: "e.g., Summer Europe Trip",
    type: "text",
  },
  {
    name: "coverImage",
    label: "Cover Image",
    placeholder: "Upload an image",
    type: "file",
  },
  {
    name: "dateRange",
    label: "Date Range",
    type: "date",
  },
];

export default function ItineraryForm() {
  const [currentActivity, setCurrentActivity] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      dayWise: [],
    },
  });

  const dateRange = form.watch("dateRange");

  const { fields: dayWiseFields } = useFieldArray({
    name: "dayWise",
    control: form.control,
  });

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const days: {
        date: Date;
        destinations: { name: string; activities: string[]; note?: string }[];
      }[] = [];
      const currentDate = new Date(dateRange.from);

      while (currentDate <= dateRange.to) {
        days.push({
          date: new Date(currentDate),
          destinations: [{ name: "", activities: [], note: "" }],
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      form.setValue("dayWise", days);
    }
  }, [dateRange.from, dateRange.to, form.setValue]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const addDestination = (dayIndex: number) => {
    const currentDestinations = form.getValues(
      `dayWise.${dayIndex}.destinations`
    );
    form.setValue(`dayWise.${dayIndex}.destinations`, [
      ...currentDestinations,
      { name: "", activities: [], note: "" },
    ]);
  };

  const addActivity = (
    dayIndex: number,
    destIndex: number,
    activity: string
  ) => {
    if (activity.trim()) {
      const currentActivities = form.getValues(
        `dayWise.${dayIndex}.destinations.${destIndex}.activities`
      );
      form.setValue(
        `dayWise.${dayIndex}.destinations.${destIndex}.activities`,
        [...currentActivities, activity.trim()]
      );
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Submitting itinerary:", data);
    // Here you would typically send the itinerary data to your backend
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Itinerary Details</CardTitle>
            <CardDescription>
              Give your itinerary a name and start adding destinations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {itineraryDetailsFields.map((detailField) => (
              <FormField
                key={detailField.name}
                control={form.control}
                name={detailField.name as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{detailField.label}</FormLabel>
                    <FormControl>
                      <div>
                        {detailField.type === "text" && (
                          <Input
                            placeholder={detailField.placeholder}
                            {...field}
                            value={(field.value as string) ?? ""}
                          />
                        )}
                        {detailField.type === "textarea" && (
                          <Textarea
                            placeholder={detailField.placeholder}
                            {...field}
                            value={(field.value as string) ?? ""}
                          />
                        )}
                        {detailField.type === "date" && (
                          <DatePickerWithRange
                            date={field.value as DateRange}
                            setDate={field.onChange}
                          />
                        )}
                        {detailField.type === "file" && (
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            accept="image/*"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        {dayWiseFields.map((day, dayIndex) => (
          <Card key={day.id} className="mb-8">
            <CardHeader>
              <CardTitle>{formatDate(day.date)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {form
                  .getValues(`dayWise.${dayIndex}.destinations`)
                  ?.map((_, destIndex) => (
                    <div key={destIndex} className="border p-4 rounded-lg">
                      <FormField
                        control={form.control}
                        name={`dayWise.${dayIndex}.destinations.${destIndex}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Eiffel Tower"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-4">
                        <FormLabel>Activities</FormLabel>
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={currentActivity}
                            onChange={(e) => setCurrentActivity(e.target.value)}
                            placeholder="Add an activity"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              addActivity(dayIndex, destIndex, currentActivity);
                              setCurrentActivity("");
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <ul className="list-disc list-inside">
                          {form
                            .getValues(
                              `dayWise.${dayIndex}.destinations.${destIndex}.activities`
                            )
                            ?.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                        </ul>
                      </div>

                      <FormField
                        control={form.control}
                        name={`dayWise.${dayIndex}.destinations.${destIndex}.note`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Add any notes about this destination"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addDestination(dayIndex)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another Destination
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Create Itinerary</Button>
        </div>
      </form>
    </Form>
  );
}

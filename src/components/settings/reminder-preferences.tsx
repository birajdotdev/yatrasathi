"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";

const reminderPreferenceSchema = z.object({
  optOut: z.boolean().default(false),
  daysBefore: z.number().int().min(1).max(30).default(7),
});

type ReminderPreferenceFormValues = z.infer<typeof reminderPreferenceSchema>;

export function ReminderPreferences({
  initialData,
}: {
  initialData: { optOut: boolean; daysBefore: number } | null;
}) {
  const updatePreferences = api.user.updateReminderPreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update preferences.", {
        description: error.message,
      });
    },
  });

  const form = useForm<ReminderPreferenceFormValues>({
    resolver: zodResolver(reminderPreferenceSchema),
    defaultValues: initialData ?? {
      optOut: false,
      daysBefore: 7,
    },
  });

  function onSubmit(data: ReminderPreferenceFormValues) {
    updatePreferences.mutate(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Email Reminder Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure when you want to receive trip reminders
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="optOut"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Reminders</FormLabel>
                  <FormDescription>
                    Receive email reminders before your trips
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!field.value}
                    onCheckedChange={(checked) => field.onChange(!checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!form.watch("optOut") && (
            <FormField
              control={form.control}
              name="daysBefore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Timing</FormLabel>
                  <Select
                    disabled={form.watch("optOut")}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select when to receive reminders" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 day before trip</SelectItem>
                      <SelectItem value="3">3 days before trip</SelectItem>
                      <SelectItem value="7">1 week before trip</SelectItem>
                      <SelectItem value="14">2 weeks before trip</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    When should we send you trip reminders?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={updatePreferences.isPending}>
            {updatePreferences.isPending ? "Saving..." : "Save preferences"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

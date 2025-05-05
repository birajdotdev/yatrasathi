"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ReminderPreferencesDialogProps {
  children: React.ReactNode;
}

const reminderPreferenceSchema = z.object({
  optOut: z.boolean().default(false),
  daysBefore: z.number().int().min(1).max(30).default(7),
});

type ReminderPreferenceFormValues = z.infer<typeof reminderPreferenceSchema>;

export default function ReminderPreferencesDialog({
  children,
}: ReminderPreferencesDialogProps) {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const { data: initialData } = api.user.getReminderPreferences.useQuery();

  const updatePreferences = api.user.updateReminderPreferences.useMutation({
    onMutate: () => {
      toast.loading("Saving preferences...");
    },
    onSuccess: async () => {
      await utils.user.getReminderPreferences.invalidate();
      toast.dismiss();
      toast.success("Preferences updated successfully!");
      setOpen(false);
    },
    onError: (error) => {
      toast.dismiss();
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

  // Check if form is dirty (has changed)
  const formIsDirty = form.formState.isDirty;

  function onSubmit(data: ReminderPreferenceFormValues) {
    updatePreferences.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>
                Itinerary <span className="text-primary">Reminders</span>
              </DialogTitle>
              <DialogDescription>
                Manage your email reminder preferences for upcoming trips
              </DialogDescription>
            </DialogHeader>

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

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={updatePreferences.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={updatePreferences.isPending || !formIsDirty}
              >
                Save Preferences
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined;
  setDate?: (date: DateRange | undefined) => void;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  disablePastDates?: boolean;
  maxDate?: Date;
  minDate?: Date;
  numberOfMonths?: number;
  /**
   * Callback when the date picker is opened
   */
  onOpenChange?: (open: boolean) => void;
}

export function DatePickerWithRange({
  date,
  setDate,
  error = false,
  disabled = false,
  placeholder = "Select date range",
  fromPlaceholder = "LLL dd, y",
  toPlaceholder = "LLL dd, y",
  disablePastDates = false,
  maxDate,
  minDate,
  numberOfMonths = 2,
  onOpenChange,
  className,
  ...props
}: DatePickerWithRangeProps) {
  const today = React.useMemo(() => new Date(), []);

  // Handle disabled dates logic
  const handleDisabledDates = React.useCallback(
    (date: Date) => {
      if (disablePastDates) {
        const currentDate = new Date(today);
        currentDate.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
          return true;
        }
      }

      if (minDate && date < minDate) {
        return true;
      }

      if (maxDate && date > maxDate) {
        return true;
      }

      return false;
    },
    [disablePastDates, maxDate, minDate, today]
  );

  return (
    <div className={cn("grid w-full", className)} {...props}>
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 rounded-xl border-input !bg-background hover:!bg-accent",
              !date && "text-muted-foreground",
              error &&
                "!border-destructive !text-destructive !bg-destructive/20 hover:!bg-destructive/30 transition-colors"
            )}
            disabled={disabled}
            aria-invalid={error}
            aria-label="Select date range"
          >
            <CalendarIcon
              className={cn(
                "mr-2 h-4 w-4 text-muted-foreground",
                error && "text-destructive"
              )}
            />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, fromPlaceholder)} -{" "}
                  {format(date.to, toPlaceholder)}
                </>
              ) : (
                format(date.from, fromPlaceholder)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-input shadow-lg rounded-xl"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from ?? today}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            disabled={handleDisabledDates}
            className="rounded-lg"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

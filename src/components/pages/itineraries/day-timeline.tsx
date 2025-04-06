import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { format } from "date-fns";
import { ChevronDownIcon, MapPin } from "lucide-react";

import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { type ItineraryDay } from "@/types/itinerary";

import ActivityCard from "./activity-card";

interface DayTimelineProps {
  day: ItineraryDay;
}
//   // Parse and format the date
//   const dateObj = parseISO(day.date);
//   const dayOfWeek = format(dateObj, "EEEE");
//   const dayDate = format(dateObj, "do MMMM");

//   return (
//     <div
//       className="travel-card mb-6 overflow-hidden"
//       style={{ animationDelay: `${index * 150}ms` }}
//     >
//       <div
//         className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//         onClick={onToggle}
//       >
//         <div>
//           <h3 className="font-medium">
//             <span className="text-travel-accent font-semibold">
//               {dayOfWeek}
//             </span>
//             , {dayDate}
//           </h3>
//           <div className="text-sm text-travel-muted mt-1">
//             {day.activities.length}{" "}
//             {day.activities.length === 1 ? "activity" : "activities"}
//           </div>
//         </div>
//         <div className="flex items-center">
//           {isActive ? (
//             <ChevronUp className="h-5 w-5 text-travel-muted" />
//           ) : (
//             <ChevronDown className="h-5 w-5 text-travel-muted" />
//           )}
//         </div>
//       </div>

//       {isActive && (
//         <div className="p-4 border-t border-gray-100 dark:border-gray-800">
//           <div className="relative pl-6 border-l-2 border-dashed border-gray-200 dark:border-gray-700">
//             {day.activities.length > 0 ? (
//               day.activities.map((activity, idx) => (
//                 <div key={activity.id} className="relative">
//                   <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-travel-accent ring-4 ring-white dark:ring-black"></div>
//                   <ActivityCard activity={activity} index={idx} />
//                 </div>
//               ))
//             ) : (
//               <div className="py-8 flex flex-col items-center text-center">
//                 <p className="text-travel-muted mb-4">
//                   No activities planned for this day yet.
//                 </p>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" size="sm" className="gap-1">
//                       <PlusCircle className="h-4 w-4" />
//                       Add Activity
//                     </Button>
//                   </DialogTrigger>
//                   <ActivityForm selectedDayDate={day.date} />
//                 </Dialog>
//               </div>
//             )}
//           </div>

//           {day.activities.length > 0 && (
//             <div className="mt-4 flex justify-center">
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-1">
//                     <PlusCircle className="h-4 w-4" />
//                     Add Another Activity
//                   </Button>
//                 </DialogTrigger>
//                 <ActivityForm selectedDayDate={day.date} />
//               </Dialog>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DayTimeline;

export default function DayTimeline({ day }: DayTimelineProps) {
  // Parse and format the date
  const dateObj = day.date;
  const dayOfWeek = format(dateObj, "EEEE");
  const dayDate = format(dateObj, "do MMMM");

  return (
    <AccordionItem
      value={day.date.toISOString()}
      key={day.date.toISOString()}
      className="bg-card has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-xl border px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
          <span className="flex flex-col space-y-1">
            <span className="text-xl">
              {dayOfWeek}, <span className="text-primary">{dayDate}</span>
            </span>
            {day.activities.length > 0 ? (
              <span className="text-sm text-muted-foreground font-normal">
                {day.activities.length}{" "}
                {day.activities.length === 1 ? "activity" : "activities"}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground font-normal">
                No activities planned for this day yet.
              </span>
            )}
          </span>
          <ChevronDownIcon
            size={16}
            className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent>
        <Timeline defaultValue={day.activities.length} className="mt-3">
          {day.activities.map((activity, index) => (
            <TimelineItem
              key={activity.id}
              step={index + 1}
              className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-6"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                  <MapPin size={14} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent className="-mt-0.5">
                <ActivityCard activity={activity} day={day} />
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </AccordionContent>
    </AccordionItem>
  );
}

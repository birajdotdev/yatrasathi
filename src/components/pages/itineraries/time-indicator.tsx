import { Clock } from "lucide-react";

interface TimeIndicatorProps {
  startTime: string;
  endTime: string;
  className?: string;
}

const TimeIndicator = ({
  startTime,
  endTime,
  className = "",
}: TimeIndicatorProps) => {
  // Format time for display (e.g., 14:00 → 2:00 PM)
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      const period = hours! >= 12 ? "PM" : "AM";
      const displayHours = hours! % 12 || 12;
      return `${displayHours}:${minutes!.toString().padStart(2, "0")} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  return (
    <div className={`text-travel-muted flex items-center ${className}`}>
      <Clock className="mr-1 h-4 w-4 flex-shrink-0" />
      <span className="text-sm">
        {formatTime(startTime)} - {formatTime(endTime)}
      </span>
    </div>
  );
};

export default TimeIndicator;

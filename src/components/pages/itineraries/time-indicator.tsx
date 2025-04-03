import { Clock } from "lucide-react";

interface TimeIndicatorProps {
  time: string;
  duration?: string;
  className?: string;
}

const TimeIndicator = ({
  time,
  duration,
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
    <div className={`flex items-center text-travel-muted ${className}`}>
      <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
      <span className="text-sm">
        {formatTime(time)}
        {duration && ` • ${duration}`}
      </span>
    </div>
  );
};

export default TimeIndicator;

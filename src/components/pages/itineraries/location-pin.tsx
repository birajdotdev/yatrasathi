import { MapPin } from "lucide-react";

interface LocationPinProps {
  location: string;
  className?: string;
}

const LocationPin = ({ location, className = "" }: LocationPinProps) => {
  return (
    <div className={`text-travel-muted flex items-center ${className}`}>
      <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
      <span className="truncate text-sm">{location}</span>
    </div>
  );
};

export default LocationPin;

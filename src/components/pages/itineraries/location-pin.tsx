import { MapPin } from "lucide-react";

interface LocationPinProps {
  location: string;
  className?: string;
}

const LocationPin = ({ location, className = "" }: LocationPinProps) => {
  return (
    <div className={`flex items-center text-travel-muted ${className}`}>
      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
      <span className="text-sm truncate">{location}</span>
    </div>
  );
};

export default LocationPin;

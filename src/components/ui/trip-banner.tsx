import Image from "next/image";

import { CalendarIcon, Edit, MapPinIcon } from "lucide-react";

import { splitTitle } from "@/lib/utils";

interface TripBannerProps {
  title: string;
  location: string;
  dateRange: string;
  coverImage: string;
  onEdit?: () => void;
}

export function TripBanner({
  title,
  location,
  dateRange,
  coverImage,
  onEdit,
}: TripBannerProps) {
  const [text, highlight] = splitTitle(title);

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-background dark:from-primary/10 dark:via-background/90 dark:to-background">
      {/* Background Image - This replaces the gradient background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Multiple overlays for better control of opacity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Edit Button - Visible only on hover */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full z-20 text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Edit trip"
        >
          <Edit className="h-5 w-5" />
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-8 lg:p-12">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/15 px-4 py-1 text-sm text-primary dark:bg-primary/20">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {dateRange}
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {text}{" "}
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h2>

          <div className="mt-4 flex items-center gap-2 text-lg text-white/80">
            <MapPinIcon className="h-5 w-5" />
            <p>{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

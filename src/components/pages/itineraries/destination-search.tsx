"use client";

import { useState } from "react";

import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function DestinationSearch() {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleFocus = () => {
    if (search) setShowResults(true);
  };

  const destinations = [
    { name: "Kathmandu", region: "Nepal", type: "City" },
    { name: "Kathmandu Valley", region: "Nepal", type: "District" },
    {
      name: "Patan (Lalitpur)",
      region: "Kathmandu Valley, Nepal",
      type: "City",
    },
    { name: "Bhaktapur", region: "Kathmandu Valley, Nepal", type: "City" },
    { name: "Kirtipur", region: "Kathmandu Valley, Nepal", type: "City" },
    { name: "Changunarayan", region: "Kathmandu Valley, Nepal", type: "City" },
  ];

  return (
    <div className="relative">
      {" "}
      <div className="relative">
        {" "}
        <Input
          id="destination"
          placeholder="e.g. Paris, Hawaii, Japan"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value) setShowResults(true);
            else setShowResults(false);
          }}
          onFocus={handleFocus}
          className="pl-10 h-12 rounded-xl bg-background"
        />{" "}
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />{" "}
      </div>
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-background rounded-xl border border-input shadow-lg overflow-hidden">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => {
                setSearch(destination.name);
                setShowResults(false);
              }}
            >
              <div className="flex items-center">
                <div className="bg-accent p-2 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{destination.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {destination.region}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-accent text-xs">
                {destination.type}
              </Badge>
            </div>
          ))}
        </div>
      )}
      {search && !showResults && (
        <div className="text-center text-sm text-destructive mt-2">
          Choose a destination to start planning
        </div>
      )}
    </div>
  );
}

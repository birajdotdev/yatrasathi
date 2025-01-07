"use client";

import { useState } from "react";

import { MapPin, Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const destinations: string[] = ["Kathmandu", "Pokhara", "Swoyambhunath"];

export function SearchForm() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search destinations..."
          className="pl-8 rounded-full bg-sidebar"
          onClick={() => setOpen(!open)}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle hidden />
        <CommandInput placeholder="Search destinations..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {destinations.map((destination) => (
              <CommandItem key={destination}>
                <MapPin />
                <span>{destination}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

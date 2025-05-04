"use client";

import { useState } from "react";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import ActivityForm from "./activity-dialog-form";

export default function ActivityButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Activity
        </Button>
      </DialogTrigger>
      <ActivityForm onComplete={() => setIsOpen(false)} />
    </Dialog>
  );
}

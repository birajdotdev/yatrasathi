"use client";

import Image from "next/image";
import { useState } from "react";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialNotifications = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    user: "Chris Tompson",
    action: "liked your travel guide on",
    target: "Hidden Gems of Kathmandu",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    user: "Emma Davis",
    action: "commented on your post",
    target: "Best Street Food in Tokyo",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    user: "James Wilson",
    action: "saved your itinerary",
    target: "3 Days in Pokhara",
    timestamp: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
    user: "Alex Morgan",
    action: "asked about your experience at",
    target: "Annapurna Base Camp",
    timestamp: "12 hours ago",
    unread: false,
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    user: "Sarah Chen",
    action: "is planning to visit",
    target: "Bhaktapur Durbar Square",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    user: "Miky Derya",
    action: "recommended your guide about",
    target: "Trekking in Nepal",
    timestamp: "2 weeks ago",
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationButton() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative data-[state=open]:bg-accent"
          aria-label="Open notifications"
        >
          <Bell size={16} strokeWidth={2} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1 rounded-lg" align="end">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
        ></div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <div className="relative flex items-start gap-3 pe-3">
              <Image
                className="size-9 rounded-md object-cover"
                src={notification.image}
                width={36}
                height={36}
                alt={notification.user}
              />
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

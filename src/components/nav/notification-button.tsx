"use client";

import Image from "next/image";
import { useMemo } from "react";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/trpc/react";

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
  // Fetch notifications, polling every 10 seconds
  const { data: notifications = [], refetch } =
    api.notification.getNotifications.useQuery(undefined, {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    });
  const markAllAsRead = api.notification.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  const markAsRead = api.notification.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleNotificationClick = (id: string) => {
    markAsRead.mutate({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative data-[state=open]:bg-accent rounded-lg"
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
              disabled={markAllAsRead.isPending}
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
        {notifications.length === 0 ? (
          <div className="px-3 py-4 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <div className="relative flex items-start gap-3 pe-3">
                <Image
                  className="size-9 rounded-md object-cover"
                  src={notification.fromUser?.image ?? "/default-user.png"}
                  width={36}
                  height={36}
                  alt={notification.fromUser?.name ?? "User"}
                />
                <div className="flex-1 space-y-1">
                  <button
                    className="text-left text-foreground/80 after:absolute after:inset-0"
                    onClick={() => handleNotificationClick(notification.id)}
                    disabled={markAsRead.isPending}
                  >
                    <span className="font-medium text-foreground hover:underline">
                      {notification.fromUser?.name}
                    </span>{" "}
                    {notification.type === "like"
                      ? "liked your post"
                      : notification.type === "comment"
                        ? "commented on your post"
                        : notification.type}
                    {notification.target && (
                      <span className="font-medium text-foreground hover:underline">
                        {" "}
                        {notification.target}
                      </span>
                    )}
                    .
                  </button>
                  <div className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notification.read && (
                  <div className="absolute end-0 self-center">
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getDaysAgoString } from "@/lib/utils";
import { type RouterOutputs, api } from "@/trpc/react";

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

function NotificationSkeletonList() {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
          <Skeleton className="size-9 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotificationButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Fetch notifications, polling every 10 seconds
  const {
    data: notifications,
    refetch,
    isLoading,
    error,
  } = api.notification.getNotifications.useQuery(undefined, {
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
    () => notifications?.filter((n) => !n.read).length ?? 0,
    [notifications]
  );

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleNotificationClick = async (id: string, postSlug?: string) => {
    await markAsRead.mutateAsync({ id });
    if (postSlug) {
      router.push(`/blogs/${postSlug}`);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative rounded-lg data-[state=open]:bg-accent"
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
      <PopoverContent className="w-80 rounded-lg p-1" align="end">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">
            Your <span className="text-primary">Notifications</span>
          </div>
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
        />
        {isLoading ? (
          <NotificationSkeletonList />
        ) : error ? (
          <div className="px-3 py-4 text-center text-sm text-destructive">
            Failed to load notifications.
            <br />
            <span className="text-xs text-muted-foreground">
              Please try again later.
            </span>
          </div>
        ) : (notifications?.length ?? 0) === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications?.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              isPending={
                markAsRead.isPending &&
                markAsRead.variables?.id === notification.id
              }
            />
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}

interface NotificationItemProps {
  notification: RouterOutputs["notification"]["getNotifications"][number];
  onClick: (id: string, postSlug?: string) => void;
  isPending?: boolean;
}

function NotificationItem({
  notification,
  onClick,
  isPending,
}: NotificationItemProps) {
  return (
    <button
      className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
      onClick={() =>
        onClick(notification.id, notification.postSlug ?? undefined)
      }
      disabled={isPending}
    >
      <div className="relative flex items-start gap-3 pe-3">
        <Image
          className="size-9 rounded-md bg-muted object-cover"
          src={notification.fromUser?.image ?? ""}
          width={36}
          height={36}
          alt={notification.fromUser?.name ?? "User"}
          priority
        />
        <div className="flex-1 space-y-1">
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
          <div className="text-xs text-muted-foreground">
            {getDaysAgoString(notification.createdAt)}
          </div>
        </div>
        {!notification.read && (
          <div className="absolute end-0 self-center">
            <Dot className="text-primary" />
          </div>
        )}
      </div>
    </button>
  );
}

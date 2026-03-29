"use client";

import NextLink from "next/link";
import { useMemo, useState } from "react";
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SITE_URL } from "@/config/environment";

function isAllowedCtaUrl(input?: string | null): input is string {
  if (!input) {
    return false;
  }

  if (input.startsWith("/")) {
    return !input.startsWith("//");
  }

  try {
    const parsed = new URL(input);
    const siteOrigin = new URL(SITE_URL).origin;
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.origin === siteOrigin;
  } catch {
    return false;
  }
}

function formatRelativeTime(input: string) {
  const timestamp = new Date(input).getTime();
  const deltaMs = timestamp - Date.now();
  const deltaMinutes = Math.round(deltaMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(deltaMinutes) < 60) {
    return formatter.format(deltaMinutes, "minute");
  }

  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) {
    return formatter.format(deltaHours, "hour");
  }

  const deltaDays = Math.round(deltaHours / 24);
  return formatter.format(deltaDays, "day");
}

interface NotificationCenterProps {
  align?: "start" | "center" | "end";
  triggerClassName?: string;
  buttonVariant?: "ghost" | "outline" | "secondary";
}

export function NotificationCenter({
  align = "end",
  triggerClassName,
  buttonVariant = "ghost",
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    isLoading,
    isMutating,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ enabled: isAuthenticated });

  const unreadLabel = useMemo(() => {
    if (unreadCount > 9) {
      return "9+";
    }

    return unreadCount.toString();
  }, [unreadCount]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen && !notifications.length) {
      void refresh();
    }
  };

  const handleMarkAsRead = async (notificationId: number | string) => {
    try {
      await markAsRead(notificationId);
    } catch {
      toast({
        title: "Unable to mark notification as read",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast({
        title: "Notifications cleared",
        description: "All notifications have been marked as read.",
      });
    } catch {
      toast({
        title: "Unable to update notifications",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={buttonVariant}
          size="icon"
          className={cn("relative", triggerClassName)}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-actionRed px-1 text-[10px] font-semibold text-white">
              {unreadLabel}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">
              Updates for followed topics and premium access.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleMarkAllAsRead()}
            disabled={isMutating || unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        </div>
        <Separator />
        <ScrollArea className="h-[360px]">
          <div className="divide-y">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3 px-4 py-4">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Follow a category or tag to start receiving updates.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isRead = Boolean(notification.read_at);
                const timestamp = formatRelativeTime(notification.created_at);
                const safeCtaUrl = isAllowedCtaUrl(notification.cta_url) ? notification.cta_url : null;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "space-y-3 px-4 py-4 transition-colors",
                      isRead ? "bg-background" : "bg-muted/30",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold leading-none">{notification.title}</p>
                          {!isRead ? (
                            <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] uppercase">
                              New
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.body}</p>
                      </div>
                      {!isRead ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => void handleMarkAsRead(notification.id)}
                          disabled={isMutating}
                        >
                          Read
                        </Button>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">{timestamp}</p>
                      {safeCtaUrl ? (
                        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                          <NextLink href={safeCtaUrl}>
                            Open
                            <ExternalLink className="h-3.5 w-3.5" />
                          </NextLink>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
        <Separator />
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void refresh()}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
          <Button asChild variant="link" size="sm" className="h-auto p-0">
            <NextLink href="/settings">Notification settings</NextLink>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { clientNotificationService } from "@/lib/client";
import type { AppNotification } from "@/types/engagement";

interface UseNotificationsOptions {
  enabled: boolean;
}

export function useNotifications({ enabled }: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setNotifications([]);
      setUnreadTotal(0);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await clientNotificationService.list();
      setNotifications(response.data);
      setUnreadTotal(response.unread_count);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const unreadCount = useMemo(() => unreadTotal, [unreadTotal]);

  const markAsRead = useCallback(
    async (notificationId: number | string) => {
      if (!enabled || isMutating) {
        return;
      }

      const previous = notifications;
      const previousUnreadTotal = unreadTotal;
      const next = notifications.map((notification) =>
        notification.id === notificationId && !notification.read_at
          ? { ...notification, read_at: new Date().toISOString() }
          : notification,
      );

      try {
        setIsMutating(true);
        setError(null);
        setNotifications(next);
        setUnreadTotal((current) => Math.max(0, current - (previous.some((notification) => notification.id === notificationId && !notification.read_at) ? 1 : 0)));
        await clientNotificationService.markAsRead(notificationId);
      } catch (caughtError) {
        setNotifications(previous);
        setUnreadTotal(previousUnreadTotal);
        setError(caughtError instanceof Error ? caughtError.message : "Unable to update notification.");
        throw caughtError;
      } finally {
        setIsMutating(false);
      }
    },
    [enabled, isMutating, notifications, unreadTotal],
  );

  const markAllAsRead = useCallback(async () => {
    if (!enabled || isMutating || unreadCount === 0) {
      return;
    }

    const previous = notifications;
    const previousUnreadTotal = unreadTotal;
    const readAt = new Date().toISOString();

    try {
      setIsMutating(true);
      setError(null);
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, read_at: notification.read_at ?? readAt })),
      );
      setUnreadTotal(0);
      await clientNotificationService.markAllAsRead();
    } catch (caughtError) {
      setNotifications(previous);
      setUnreadTotal(previousUnreadTotal);
      setError(caughtError instanceof Error ? caughtError.message : "Unable to update notifications.");
      throw caughtError;
    } finally {
      setIsMutating(false);
    }
  }, [enabled, isMutating, notifications, unreadCount, unreadTotal]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isMutating,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
  };
}

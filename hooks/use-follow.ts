"use client";

import { useCallback, useEffect, useState } from "react";
import { clientFollowService } from "@/lib/client";
import type { FollowTargetType } from "@/types/engagement";

interface UseFollowOptions {
  itemId: number;
  type: FollowTargetType;
  enabled: boolean;
  initialFollowing?: boolean;
}

export function useFollow({
  itemId,
  type,
  enabled,
  initialFollowing = false,
}: UseFollowOptions) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setIsFollowing(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await clientFollowService.list();
      const collection = type === "category" ? result.categories : result.tags;
      setIsFollowing(collection.some((item) => item.id === itemId));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load follow status.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, itemId, type]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(async () => {
    if (!enabled || isSubmitting) {
      return isFollowing;
    }

    const previous = isFollowing;
    const next = !previous;

    try {
      setIsSubmitting(true);
      setError(null);
      setIsFollowing(next);

      if (type === "category") {
        if (previous) {
          await clientFollowService.unfollowCategory(itemId);
        } else {
          await clientFollowService.followCategory(itemId);
        }
      } else if (previous) {
        await clientFollowService.unfollowTag(itemId);
      } else {
        await clientFollowService.followTag(itemId);
      }

      return next;
    } catch (caughtError) {
      setIsFollowing(previous);
      setError(caughtError instanceof Error ? caughtError.message : "Unable to update follow preference.");
      throw caughtError;
    } finally {
      setIsSubmitting(false);
    }
  }, [enabled, isFollowing, isSubmitting, itemId, type]);

  return {
    isFollowing,
    isLoading,
    isSubmitting,
    error,
    toggle,
    refresh,
  };
}

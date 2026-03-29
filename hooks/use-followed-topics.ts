"use client";

import { useCallback, useEffect, useState } from "react";
import { clientFollowService } from "@/lib/client";
import type { FollowCollection, FollowTargetType } from "@/types/engagement";

const emptyFollows: FollowCollection = {
  categories: [],
  tags: [],
};

interface UseFollowedTopicsOptions {
  enabled: boolean;
}

export function useFollowedTopics({ enabled }: UseFollowedTopicsOptions) {
  const [follows, setFollows] = useState<FollowCollection>(emptyFollows);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setFollows(emptyFollows);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await clientFollowService.list();
      setFollows(response);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load followed topics.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const unfollow = useCallback(
    async (type: FollowTargetType, itemId: number) => {
      if (!enabled || isMutating) {
        return;
      }

      const previous = follows;
      const key = type === "category" ? "categories" : "tags";

      try {
        setIsMutating(true);
        setError(null);
        setFollows((current) => ({
          ...current,
          [key]: current[key].filter((item) => item.id !== itemId),
        }));

        if (type === "category") {
          await clientFollowService.unfollowCategory(itemId);
        } else {
          await clientFollowService.unfollowTag(itemId);
        }
      } catch (caughtError) {
        setFollows(previous);
        setError(caughtError instanceof Error ? caughtError.message : "Unable to update followed topics.");
        throw caughtError;
      } finally {
        setIsMutating(false);
      }
    },
    [enabled, follows, isMutating],
  );

  return {
    follows,
    isLoading,
    isMutating,
    error,
    refresh,
    unfollow,
  };
}

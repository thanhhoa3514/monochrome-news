"use client";

import { useCallback, useEffect, useState } from "react";
import { clientNotificationService } from "@/lib/client";
import type { DigestFrequency, DigestPreviewResponse } from "@/types/engagement";

interface UseDigestPreviewOptions {
  enabled: boolean;
  frequency: DigestFrequency;
}

export function useDigestPreview({ enabled, frequency }: UseDigestPreviewOptions) {
  const [preview, setPreview] = useState<DigestPreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled || frequency === "off") {
      setPreview(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await clientNotificationService.getDigestPreview({ frequency, limit: 4 });
      setPreview(response);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load digest preview.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, frequency]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    preview,
    isLoading,
    error,
    refresh,
  };
}

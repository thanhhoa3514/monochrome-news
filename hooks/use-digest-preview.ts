"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clientNotificationService } from "@/lib/client";
import type { DigestFrequency, DigestPreviewResponse } from "@/types/engagement";

interface UseDigestPreviewOptions {
  enabled: boolean;
  frequency: DigestFrequency;
}

export function useDigestPreview({ enabled, frequency }: UseDigestPreviewOptions) {
  const requestIdRef = useRef(0);
  const [preview, setPreview] = useState<DigestPreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!enabled || frequency === "off") {
      setPreview(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setPreview(null);
      setIsLoading(true);
      setError(null);
      const response = await clientNotificationService.getDigestPreview({ frequency, limit: 4 });

      if (requestIdRef.current !== requestId) {
        return;
      }

      setPreview(response);
    } catch (caughtError) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setError(caughtError instanceof Error ? caughtError.message : "Unable to load digest preview.");
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
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

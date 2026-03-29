"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clientPreferenceService } from "@/lib/client";
import type { DigestPreferences, UpdateDigestPreferencesInput } from "@/types/engagement";

const defaultPreferences: DigestPreferences = {
  email_enabled: true,
  digest_frequency: "weekly",
};

interface UseDigestPreferencesOptions {
  enabled: boolean;
}

export function useDigestPreferences({ enabled }: UseDigestPreferencesOptions) {
  const saveInFlightRef = useRef(false);
  const refreshRequestIdRef = useRef(0);
  const [preferences, setPreferences] = useState<DigestPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const requestId = ++refreshRequestIdRef.current;

    if (!enabled) {
      setPreferences(defaultPreferences);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await clientPreferenceService.getDigestPreferences();

      if (refreshRequestIdRef.current !== requestId) {
        return;
      }

      setPreferences(response);
    } catch (caughtError) {
      if (refreshRequestIdRef.current !== requestId) {
        return;
      }

      setError(caughtError instanceof Error ? caughtError.message : "Unable to load digest preferences.");
    } finally {
      if (refreshRequestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateLocal = useCallback((next: Partial<DigestPreferences>) => {
    setPreferences((current) => ({ ...current, ...next }));
  }, []);

  const save = useCallback(
    async (next?: UpdateDigestPreferencesInput) => {
      if (saveInFlightRef.current) {
        return preferences;
      }

      if (!enabled) {
        return preferences;
      }

      const payload = next ?? preferences;

      try {
        saveInFlightRef.current = true;
        setIsSaving(true);
        setError(null);
        const response = await clientPreferenceService.updateDigestPreferences(payload);
        setPreferences(response);
        return response;
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Unable to save digest preferences.");
        throw caughtError;
      } finally {
        saveInFlightRef.current = false;
        setIsSaving(false);
      }
    },
    [enabled, preferences],
  );

  return {
    preferences,
    isLoading,
    isSaving,
    error,
    refresh,
    updateLocal,
    save,
  };
}

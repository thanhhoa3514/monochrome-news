"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [preferences, setPreferences] = useState<DigestPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setPreferences(defaultPreferences);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await clientPreferenceService.getDigestPreferences();
      setPreferences(response);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load digest preferences.");
    } finally {
      setIsLoading(false);
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
      if (!enabled) {
        return preferences;
      }

      const payload = next ?? preferences;

      try {
        setIsSaving(true);
        setError(null);
        const response = await clientPreferenceService.updateDigestPreferences(payload);
        setPreferences(response);
        return response;
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Unable to save digest preferences.");
        throw caughtError;
      } finally {
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

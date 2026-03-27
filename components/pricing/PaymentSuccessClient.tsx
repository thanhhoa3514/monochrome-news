"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentSuccessClientProps {
  sessionId: string | null;
}

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 6;

export function PaymentSuccessClient({ sessionId }: PaymentSuccessClientProps) {
  const router = useRouter();
  const { canAccessPremium, refreshAuth } = useAuth();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (canAccessPremium) {
      return;
    }

    let isCancelled = false;

    const poll = async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        if (isCancelled) {
          return;
        }

        await refreshAuth();

        if (isCancelled) {
          return;
        }

        setAttempts(attempt);

        if (attempt < MAX_ATTEMPTS) {
          await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
        }
      }
    };

    void poll();

    return () => {
      isCancelled = true;
    };
  }, [canAccessPremium, refreshAuth]);

  const statusMessage = useMemo(() => {
    if (canAccessPremium) {
      return "Premium access is active on this account now. You can head back and open subscriber-only articles immediately.";
    }

    if (attempts > 0) {
      return "We are still waiting for Stripe webhook confirmation. If the badge does not switch to Premium in a few seconds, refresh once or check the backend webhook logs.";
    }

    return "Stripe reported a successful checkout. Your subscription should be activated shortly, and premium articles should become available on this account.";
  }, [attempts, canAccessPremium]);

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl rounded-3xl border bg-background p-8 shadow-sm">
        <Badge variant="outline" className="mb-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
          Payment Complete
        </Badge>
        <h1 className="font-serif text-4xl font-black tracking-tight">Your upgrade is on the way.</h1>
        <p className="mt-4 text-muted-foreground">{statusMessage}</p>
        {sessionId ? (
          <p className="mt-4 rounded-xl bg-muted px-4 py-3 font-mono text-xs text-muted-foreground">
            Session: {sessionId}
          </p>
        ) : null}
        {canAccessPremium ? (
          <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Premium access confirmed.
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Waiting for webhook confirmation{attempts > 0 ? ` (${attempts}/${MAX_ATTEMPTS})` : ""}.
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-actionRed text-white hover:bg-actionRed/90">
            <Link href="/">Back to Homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Review Plans</Link>
          </Button>
          {!canAccessPremium ? (
            <Button variant="ghost" onClick={() => router.refresh()}>
              Refresh Status
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

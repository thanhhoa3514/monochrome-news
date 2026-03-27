"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2, QrCode, CreditCard, Copy, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { clientSubscriptionService } from "@/lib/client";
import type { Plan } from "@/types/plan";
import type { PaymentProvider, SePayCheckoutSessionResponse } from "@/types/payment";

const SEPAY_ENABLED = process.env.NEXT_PUBLIC_SEPAY_ENABLED === "true";

interface PricingPageClientProps {
  plans: Plan[] | null;
  canceledPlanId?: number;
  initialProvider?: PaymentProvider;
}

function formatPrice(price: number) {
  if (price <= 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildPlanFeatures(plan: Plan): string[] {
  if (Array.isArray(plan.features) && plan.features.length > 0) {
    return plan.features;
  }

  const fallback = [
    `${plan.duration_days} day access window`,
    plan.price > 0 ? "Premium articles and subscriber-only reads" : "Public news access",
    "Responsive reading experience across devices",
  ];

  if (plan.access_limit) {
    fallback.splice(1, 0, `${plan.access_limit} article access limit`);
  }

  return fallback;
}

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingPageClient({
  plans,
  canceledPlanId,
  initialProvider = "stripe",
}: PricingPageClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, canAccessPremium, refreshAuth } = useAuth();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(
    initialProvider === "sepay" && !SEPAY_ENABLED ? "stripe" : initialProvider,
  );
  const [sepayCheckout, setSepayCheckout] = useState<SePayCheckoutSessionResponse | null>(null);
  const [sepayStatus, setSepayStatus] = useState<"pending" | "active" | "cancelled" | "expired">("pending");
  const hasPlanLoadError = plans === null;
  const checkoutInFlightRef = useRef(false);

  const normalizedPlans = useMemo(
    () =>
      [...(plans ?? [])].sort((left, right) => Number(left.price) - Number(right.price)).map((plan, index) => ({
        ...plan,
        features: buildPlanFeatures(plan),
        popular: index === 1 || plan.slug === "premium",
      })),
    [plans],
  );

  useEffect(() => {
    if (!sepayCheckout || canAccessPremium) {
      return;
    }

    let isCancelled = false;

    const poll = async () => {
      for (let attempt = 1; attempt <= 8; attempt += 1) {
        if (isCancelled) {
          return;
        }

        try {
          const subscription = await clientSubscriptionService.getById(sepayCheckout.subscriptionId);

          if (isCancelled) {
            return;
          }

          setSepayStatus(subscription.status);

          if (subscription.status === "active") {
            await refreshAuth();
            return;
          }

          if (subscription.status === "cancelled" || subscription.status === "expired") {
            return;
          }
        } catch {
          // keep polling through transient proxy or webhook timing issues
        }

        if (isCancelled || attempt === 8) {
          return;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 3000));
      }
    };

    void poll();

    return () => {
      isCancelled = true;
    };
  }, [canAccessPremium, refreshAuth, sepayCheckout]);

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: `${label} copied`,
        description: value,
      });
    } catch {
      toast({
        title: `Could not copy ${label.toLowerCase()}`,
        description: "Please copy it manually.",
        variant: "destructive",
      });
    }
  };

  const handlePlanAction = async (plan: Plan) => {
    if (checkoutInFlightRef.current) {
      return;
    }

    if (selectedProvider === "sepay" && !SEPAY_ENABLED) {
      toast({
        title: "SePay is disabled",
        description: "This payment option is currently shown for demo purposes only.",
      });
      return;
    }

    if (plan.price <= 0) {
      router.push(isAuthenticated ? "/" : "/register");
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/pricing?provider=${selectedProvider}`)}`);
      return;
    }

    if (canAccessPremium) {
      toast({
        title: "Premium already active",
        description: "Your account already has premium article access.",
      });
      return;
    }

    try {
      checkoutInFlightRef.current = true;

      setLoadingPlanId(plan.id);
      setSepayCheckout(null);
      const result = await clientSubscriptionService.createCheckoutSession(plan.id, selectedProvider);

      if (result.provider === "stripe") {
        window.location.assign(result.checkoutUrl);
        return;
      }

      setSepayCheckout(result);
      setSepayStatus("pending");
      toast({
        title: "SePay checkout ready",
        description: "Scan the QR code or copy the bank transfer details below.",
      });
    } catch (error) {
      setSepayCheckout(null);
      const message = error instanceof Error ? error.message : "Unable to start checkout right now.";
      toast({
        title: "Checkout unavailable",
        description: message,
        variant: "destructive",
      });
    } finally {
      checkoutInFlightRef.current = false;

      setLoadingPlanId(null);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container space-y-10">
        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
            Upgrade Access
          </Badge>
          <h1 className="font-serif text-4xl font-black tracking-tight md:text-6xl">
            Pick a plan and unlock the premium side of the newsroom.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Upgrade gives readers access to premium articles, longer access windows, and a smoother reading experience.
          </p>
          {canceledPlanId ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Checkout for plan #{canceledPlanId} was canceled. You can choose a plan again whenever you are ready.
            </div>
          ) : null}
          {canAccessPremium ? (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Premium access is already active on this account.
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant={selectedProvider === "stripe" ? "default" : "outline"}
              className={selectedProvider === "stripe" ? "bg-actionRed text-white hover:bg-actionRed/90" : ""}
              onClick={() => setSelectedProvider("stripe")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Stripe
            </Button>
            <Button
              type="button"
              variant={selectedProvider === "sepay" ? "default" : "outline"}
              className={selectedProvider === "sepay" ? "bg-actionRed text-white hover:bg-actionRed/90" : ""}
              disabled={!SEPAY_ENABLED}
              onClick={() => setSelectedProvider("sepay")}
            >
              <QrCode className="mr-2 h-4 w-4" />
              SePay VietQR {!SEPAY_ENABLED ? "(Soon)" : ""}
            </Button>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {selectedProvider === "stripe"
              ? "Use Stripe for international card payments and hosted checkout."
              : "Use SePay for Vietnamese bank transfers via VietQR. Exact VND transfer details will be generated after you pick a plan."}
          </p>
          {!SEPAY_ENABLED ? (
            <p className="max-w-2xl text-sm text-amber-700">
              SePay is currently disabled on the client and kept visible only as a demo payment option.
            </p>
          ) : null}
        </div>

        {sepayCheckout ? (
          <Card className="border-2 border-border/60 bg-background">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2 text-actionRed">
                <Landmark className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">SePay Transfer</span>
              </div>
              <CardTitle className="font-serif text-3xl font-black">
                Bank transfer ready for subscription #{sepayCheckout.subscriptionId}
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm">
                Scan the QR code below or transfer manually using the exact amount and transfer content. The account will upgrade automatically after the SePay webhook confirms the payment.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="rounded-3xl border bg-muted/30 p-4">
                <img
                  src={sepayCheckout.payment.qrCode}
                  alt="SePay VietQR checkout"
                  className="mx-auto w-full max-w-[240px] rounded-2xl border bg-white p-3 shadow-sm"
                />
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Scan with a Vietnamese banking app or VietQR-compatible wallet.
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bank</p>
                    <p className="mt-2 font-semibold">{sepayCheckout.payment.bankName}</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Amount</p>
                    <p className="mt-2 font-semibold">{formatVnd(sepayCheckout.payment.amount)}</p>
                  </div>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account Holder</p>
                  <p className="mt-2 font-semibold">{sepayCheckout.payment.accountName}</p>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account Number</p>
                      <p className="mt-2 font-semibold">{sepayCheckout.payment.accountNumber}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void copyToClipboard(sepayCheckout.payment.accountNumber, "Account number")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Transfer Content</p>
                      <p className="mt-2 font-semibold">{sepayCheckout.payment.content}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void copyToClipboard(sepayCheckout.payment.content, "Transfer content")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Instructions</p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                    {sepayCheckout.payment.instructions.map((instruction) => (
                      <li key={instruction} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-actionRed" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-sm ${canAccessPremium ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
                  {canAccessPremium || sepayStatus === "active"
                    ? "Payment confirmed. Premium access is now active on this account."
                    : sepayStatus === "cancelled" || sepayStatus === "expired"
                      ? "This SePay payment is no longer pending. Please start a new checkout if you still want to upgrade."
                      : "Waiting for SePay webhook confirmation. Keep this page open or refresh your account status in a moment."}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          {hasPlanLoadError ? (
            <Card className="border-2 border-amber-300 bg-amber-50 lg:col-span-3">
              <CardHeader className="space-y-3">
                <CardTitle className="font-serif text-3xl font-black text-amber-950">
                  Checkout is temporarily down.
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm text-amber-900">
                  We could not load the available subscription plans right now. Please retry in a moment, or return to the homepage while the billing catalog recovers.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-3">
                <Button type="button" className="bg-actionRed text-white hover:bg-actionRed/90" onClick={() => router.refresh()}>
                  Retry Pricing
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Back to Homepage</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : normalizedPlans.length === 0 ? (
            <Card className="border-2 border-border/60 lg:col-span-3">
              <CardHeader className="space-y-3">
                <CardTitle className="font-serif text-3xl font-black">
                  No plans are available right now.
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm">
                  The pricing catalog is currently empty. Please check back later or contact the site owner before attempting checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Back to Homepage</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : normalizedPlans.map((plan) => {
            const isBusy = loadingPlanId === plan.id;
            const isCurrentPremium = canAccessPremium && plan.price > 0;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-2 ${plan.popular ? "border-actionRed shadow-xl shadow-actionRed/10" : "border-border/60"}`}
              >
                {plan.popular ? (
                  <div className="absolute right-4 top-4">
                    <Badge className="bg-actionRed text-white">Most Popular</Badge>
                  </div>
                ) : null}

                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-2 text-actionRed">
                    <Crown className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">{plan.slug}</span>
                  </div>
                  <CardTitle className="font-serif text-3xl font-black">{plan.name}</CardTitle>
                  <CardDescription className="min-h-10 text-sm">
                    {plan.description || "Flexible access to Monochrome News premium content."}
                  </CardDescription>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black tracking-tight">{formatPrice(Number(plan.price) || 0)}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/{plan.duration_days} days</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features?.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-actionRed" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col items-stretch gap-3">
                  <Button
                    type="button"
                    size="lg"
                    className={plan.popular ? "bg-actionRed text-white hover:bg-actionRed/90" : ""}
                    variant={plan.popular ? "default" : "outline"}
                    disabled={isBusy || isCurrentPremium}
                    onClick={() => void handlePlanAction(plan)}
                  >
                    {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isCurrentPremium
                      ? "Already Premium"
                      : plan.price <= 0
                        ? isAuthenticated ? "Continue Reading" : "Create Account"
                        : selectedProvider === "stripe"
                          ? "Pay with Stripe"
                          : "Pay with SePay"}
                  </Button>

                  {!isAuthenticated && plan.price > 0 ? (
                    <p className="text-center text-xs text-muted-foreground">
                      You&apos;ll be asked to sign in before checkout starts.
                    </p>
                  ) : selectedProvider === "sepay" && plan.price > 0 ? (
                    <p className="text-center text-xs text-muted-foreground">
                      SePay will generate a VietQR payment with the exact VND amount after you choose this plan.
                    </p>
                  ) : null}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="rounded-3xl border bg-muted/40 p-6 text-sm text-muted-foreground">
          Need a different billing setup or a classroom demo flow?{" "}
          <Link href="/" className="font-semibold text-foreground underline decoration-actionRed/50 underline-offset-4">
            Return to the homepage
          </Link>{" "}
          and continue exploring the public site.
        </div>
      </div>
    </section>
  );
}

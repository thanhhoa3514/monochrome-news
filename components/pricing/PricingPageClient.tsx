"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { clientSubscriptionService } from "@/lib/client";
import type { Plan } from "@/types/plan";

interface PricingPageClientProps {
  plans: Plan[];
  canceledPlanId?: number;
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

export function PricingPageClient({ plans, canceledPlanId }: PricingPageClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, canAccessPremium } = useAuth();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const normalizedPlans = useMemo(
    () =>
      [...plans].sort((left, right) => Number(left.price) - Number(right.price)).map((plan, index) => ({
        ...plan,
        features: buildPlanFeatures(plan),
        popular: index === 1 || plan.slug === "premium",
      })),
    [plans],
  );

  const handlePlanAction = async (plan: Plan) => {
    if (plan.price <= 0) {
      router.push(isAuthenticated ? "/" : "/register");
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
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
      setLoadingPlanId(plan.id);
      const result = await clientSubscriptionService.createCheckoutSession(plan.id);
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout right now.";
      toast({
        title: "Checkout unavailable",
        description: message,
        variant: "destructive",
      });
    } finally {
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
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {normalizedPlans.map((plan) => {
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
                        : "Upgrade Now"}
                  </Button>

                  {!isAuthenticated && plan.price > 0 ? (
                    <p className="text-center text-xs text-muted-foreground">
                      You&apos;ll be asked to sign in before checkout starts.
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

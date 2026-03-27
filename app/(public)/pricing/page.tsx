import type { Metadata } from "next";
import { serverPlanService } from "@/lib/server";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";
import type { Plan } from "@/types/plan";
import type { PaymentProvider } from "@/types/payment";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Review subscription plans and start premium checkout for Monochrome News.",
  alternates: {
    canonical: "/pricing",
  },
};

export const revalidate = 300;

interface PricingPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const resolvedSearchParams = searchParams ?? undefined;
  const canceledParam = resolvedSearchParams?.canceled;
  const planParam = resolvedSearchParams?.plan_id;
  const providerParam = resolvedSearchParams?.provider;

  const canceledPlanId =
    canceledParam && typeof planParam === "string" && /^\d+$/.test(planParam)
      ? Number(planParam)
      : undefined;
  const initialProvider: PaymentProvider =
    providerParam === "sepay" ? "sepay" : "stripe";

  let plans: Plan[] | null = null;

  try {
    plans = await serverPlanService.list("active");
  } catch (error) {
    console.error("PricingPage failed to load active plans:", error);
  }

  return (
    <PricingPageClient
      plans={plans}
      canceledPlanId={canceledPlanId}
      initialProvider={initialProvider}
    />
  );
}

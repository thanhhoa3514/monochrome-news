import type { Metadata } from "next";
import { serverPlanService } from "@/lib/server";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";
import type { Plan } from "@/types/plan";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Review subscription plans and start premium checkout for Monochrome News.",
  alternates: {
    canonical: "/pricing",
  },
};

export const revalidate = 300;

interface PricingPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const canceledParam = resolvedSearchParams?.canceled;
  const planParam = resolvedSearchParams?.plan_id;

  const canceledPlanId =
    canceledParam && typeof planParam === "string" && /^\d+$/.test(planParam)
      ? Number(planParam)
      : undefined;

  const plans = await serverPlanService.list("active").catch(() => [] as Plan[]);

  return <PricingPageClient plans={plans} canceledPlanId={canceledPlanId} />;
}

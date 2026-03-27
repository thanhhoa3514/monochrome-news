import type { Metadata } from "next";
import { PaymentSuccessClient } from "@/components/pricing/PaymentSuccessClient";

export const metadata: Metadata = {
  title: "Payment Success",
  description: "Stripe checkout completed successfully.",
  alternates: {
    canonical: "/payment-success",
  },
};

interface PaymentSuccessPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sessionId = typeof resolvedSearchParams?.session_id === "string" ? resolvedSearchParams.session_id : null;

  return <PaymentSuccessClient sessionId={sessionId} />;
}

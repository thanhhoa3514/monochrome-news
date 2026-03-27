import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Resume or retry a canceled checkout session.",
};

interface CheckoutCanceledPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutCanceledPage({ params, searchParams }: CheckoutCanceledPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isCanceled = resolvedSearchParams?.canceled === "true";

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl rounded-3xl border bg-background p-8 shadow-sm">
        <h1 className="font-serif text-4xl font-black tracking-tight">
          {isCanceled ? "Checkout was canceled." : "Continue your upgrade."}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {isCanceled
            ? `The payment flow for plan #${id} did not finish. You can return to pricing and start again.`
            : `Plan #${id} is ready whenever you want to resume checkout.`}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-actionRed text-white hover:bg-actionRed/90">
            <Link href={`/pricing?canceled=true&plan_id=${id}`}>Back to Pricing</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

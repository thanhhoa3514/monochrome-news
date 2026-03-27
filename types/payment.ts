export type PaymentProvider = "stripe" | "sepay";

export interface StripeCheckoutSessionResponse {
    provider: "stripe";
    mode: "redirect";
    checkoutUrl: string;
    sessionId: string;
    subscriptionId: number;
}

export interface SePayCheckoutSessionResponse {
    provider: "sepay";
    mode: "qr";
    subscriptionId: number;
    payment: {
        bankName: string;
        accountName: string;
        accountNumber: string;
        amount: number;
        currency: "VND";
        content: string;
        qrCode: string;
        instructions: string[];
    };
}

export type CheckoutSessionResponse = StripeCheckoutSessionResponse | SePayCheckoutSessionResponse;

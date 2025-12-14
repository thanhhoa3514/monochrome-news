import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { planService } from '@/services/planService';
import { paymentService } from '@/services/paymentService';
import { Plan } from '@/types/plan';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CheckoutPage() {
    const { planId } = useParams();
    const [searchParams] = useSearchParams();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'vnpay'>('stripe');
    const navigate = useNavigate();
    const { toast } = useToast();

    // Check if user came back from canceled checkout
    const isCanceled = searchParams.get('canceled') === 'true';

    // Fetch plan details
    useEffect(() => {
        const fetchPlan = async () => {
            if (!planId) return;
            try {
                const data = await planService.getPlan(parseInt(planId));
                setPlan(data);
            } catch (error) {
                console.error('Failed to fetch plan:', error);
                toast({
                    title: "Error",
                    description: "Failed to load plan details.",
                    variant: "destructive",
                });
                navigate('/pricing');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [planId, navigate, toast]);

    const handleStripeCheckout = async () => {
        if (!plan) return;

        setProcessing(true);
        try {
            const response = await paymentService.createCheckoutSession(plan.id);
            // Redirect to Stripe Checkout page
            window.location.href = response.checkoutUrl;
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to start checkout. Please try again.",
                variant: "destructive",
            });
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!plan) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="font-medium">Duration</span>
                                    <span>{plan.duration_days} days</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="font-medium">Subtotal</span>
                                    <span>${plan.price}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-xl font-bold text-actionRed">
                                    <span>Total</span>
                                    <span>${plan.price}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-6">Payment Details</h2>

                        {isCanceled && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Your payment was canceled. Please try again when you're ready.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Select Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'vnpay')}
                                >
                                    {/* Stripe Option */}
                                    <div
                                        className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-actionRed bg-red-50/50' : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setPaymentMethod('stripe')}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="stripe" id="stripe" />
                                            <Label htmlFor="stripe" className="cursor-pointer font-medium flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                Credit Card (Stripe)
                                            </Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/64px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/64px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                                        </div>
                                    </div>

                                    {paymentMethod === 'stripe' && (
                                        <div className="pl-4 border-l-2 border-actionRed ml-2 py-2 text-sm text-muted-foreground animate-in slide-in-from-top-2 duration-200">
                                            You will be securely redirected to Stripe to complete your payment.
                                        </div>
                                    )}

                                    {/* VNPay Option */}
                                    <div
                                        className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'vnpay' ? 'border-actionRed bg-red-50/50' : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setPaymentMethod('vnpay')}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="vnpay" id="vnpay" />
                                            <Label htmlFor="vnpay" className="cursor-pointer font-medium">VNPay QR</Label>
                                        </div>
                                        <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/VNPAYQR.png" alt="VNPay" className="h-8" />
                                    </div>

                                    {paymentMethod === 'vnpay' && (
                                        <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm animate-in slide-in-from-top-2 duration-200">
                                            VNPay integration coming soon. Please use Stripe for now.
                                        </div>
                                    )}
                                </RadioGroup>

                                <Button
                                    className="w-full bg-actionRed hover:bg-actionRed-hover h-12 text-lg"
                                    onClick={handleStripeCheckout}
                                    disabled={processing || paymentMethod !== 'stripe'}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Redirecting to Stripe...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Checkout - ${plan.price}
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Secured by Stripe. Your payment information is never stored on our servers.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

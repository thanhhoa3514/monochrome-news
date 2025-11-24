import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { planService } from '@/services/planService';
import { Plan } from '@/types/plan';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
    const { planId } = useParams();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'vnpay'>('card');
    const navigate = useNavigate();
    const { toast } = useToast();

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

    const handlePayment = async () => {
        setProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            toast({
                title: "Success",
                description: `Subscription activated successfully via ${paymentMethod === 'card' ? 'Credit Card' : 'VNPay'}!`,
            });
            navigate('/profile');
        }, 2000);
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'vnpay')}>
                                    {/* Credit Card Option */}
                                    <div className={`flex items-center justify-between space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-actionRed bg-red-50/50' : 'hover:bg-gray-50'}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card" className="cursor-pointer font-medium">Credit Card</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/64px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/64px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                                        </div>
                                    </div>

                                    {/* Credit Card Form */}
                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4 pl-2 border-l-2 border-actionRed ml-2 animate-in slide-in-from-top-2 duration-200">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-9" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">Expiry Date</Label>
                                                    <Input id="expiry" placeholder="MM/YY" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input id="cvc" placeholder="123" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Cardholder Name</Label>
                                                <Input id="name" placeholder="JOHN DOE" />
                                            </div>
                                        </div>
                                    )}

                                    {/* VNPay Option */}
                                    <div className={`flex items-center justify-between space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'vnpay' ? 'border-actionRed bg-red-50/50' : 'hover:bg-gray-50'}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="vnpay" id="vnpay" />
                                            <Label htmlFor="vnpay" className="cursor-pointer font-medium">VNPay QR</Label>
                                        </div>
                                        <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/VNPAYQR.png" alt="VNPay" className="h-8" />
                                    </div>

                                    {paymentMethod === 'vnpay' && (
                                        <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm animate-in slide-in-from-top-2 duration-200">
                                            You will be redirected to VNPay gateway to complete your payment securely.
                                        </div>
                                    )}
                                </RadioGroup>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-actionRed hover:bg-actionRed-hover h-12 text-lg"
                                    onClick={handlePayment}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Pay ${plan.price}
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Your payment information is secure and encrypted.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

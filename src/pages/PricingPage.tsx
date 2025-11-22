import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { planService } from '@/services/planService';
import { Plan } from '@/types/plan';
import { useToast } from '@/hooks/use-toast';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PricingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleSubscribe = (planId: number) => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please login to subscribe to a plan.",
            });
            navigate('/login', { state: { from: '/pricing' } });
            return;
        }
        navigate(`/checkout/${planId}`);
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await planService.getPlans();
                setPlans(data);
            } catch (error) {
                console.error('Failed to fetch plans:', error);
                toast({
                    title: "Error",
                    description: "Failed to load plans. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">Choose Your Plan</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Unlock premium content and exclusive features with our subscription plans.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card key={plan.id} className="flex flex-col hover:shadow-lg transition-shadow border-primary/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">${plan.price}</span>
                                        <span className="text-muted-foreground"> / {plan.duration_days} days</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {/* Placeholder features if not in DB, or map from plan.features if available */}
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-2" />
                                            <span>Unlimited Access</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-2" />
                                            <span>Ad-free Experience</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-2" />
                                            <span>Premium Support</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full bg-actionRed hover:bg-actionRed-hover"
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        Subscribe Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

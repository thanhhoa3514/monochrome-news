import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for casual readers',
        features: [
            'Access to basic news',
            'Limited articles per day',
            'Standard search',
            'Mobile app access'
        ],
        cta: 'Get Started',
        popular: false
    },
    {
        name: 'Premium',
        price: '$9.99',
        period: 'per month',
        description: 'Best for news enthusiasts',
        features: [
            'Unlimited article access',
            'Ad-free experience',
            'Advanced search & filters',
            'Save articles offline',
            'Priority support',
            'Exclusive newsletters'
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'contact us',
        description: 'For teams and organizations',
        features: [
            'Everything in Premium',
            'Team collaboration tools',
            'API access',
            'Custom integrations',
            'Dedicated account manager',
            'Advanced analytics'
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const PricingCard = memo(({ plan, index }: { plan: typeof plans[0], index: number }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        transition={{ delay: index * 0.15 }}
        className="h-full"
    >
        <Card className={`h-full relative ${plan.popular ? 'border-primary border-2 shadow-xl' : 'border-2'}`}>
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                    <span className="text-4xl font-bold font-serif">{plan.price}</span>
                    {plan.period !== 'contact us' && (
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                >
                    <Link to="/pricing">
                        {plan.cta}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </motion.div>
));

PricingCard.displayName = 'PricingCard';

const PricingPreview = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <div className="mb-4 inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium">Pricing</div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your needs. All plans include a 14-day free trial.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <PricingCard key={plan.name} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(PricingPreview);

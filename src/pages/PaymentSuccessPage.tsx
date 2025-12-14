import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        // Check payment status from URL params
        const sessionId = searchParams.get('session_id');
        const canceled = searchParams.get('canceled');

        if (canceled === 'true') {
            setStatus('failed');
        } else if (sessionId) {
            // Session ID present means checkout was completed
            setStatus('success');
        } else {
            // No clear status, assume success for direct access
            setStatus('success');
        }
    }, [searchParams]);

    const handleGoToProfile = () => {
        navigate('/user/profile');
    };

    const handleGoToPricing = () => {
        navigate('/pricing');
    };

    if (status === 'loading') {
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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        {status === 'success' ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl text-green-600">
                                    Payment Successful!
                                </CardTitle>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <CardTitle className="text-2xl text-red-600">
                                    Payment Canceled
                                </CardTitle>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {status === 'success' ? (
                            <>
                                <p className="text-muted-foreground">
                                    Thank you for your subscription! Your premium access is being activated.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    It may take a few moments for your subscription to be fully active.
                                </p>
                                <Button
                                    onClick={handleGoToProfile}
                                    className="w-full bg-actionRed hover:bg-actionRed-hover"
                                >
                                    Go to Profile
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground">
                                    Your payment was canceled. No charges have been made.
                                </p>
                                <Button
                                    onClick={handleGoToPricing}
                                    className="w-full bg-actionRed hover:bg-actionRed-hover"
                                >
                                    Back to Pricing
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}

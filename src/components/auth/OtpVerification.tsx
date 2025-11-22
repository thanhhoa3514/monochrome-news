import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Timer, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OtpVerificationProps {
    email: string;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    isLoading?: boolean;
    initialTimeLeft?: number; // in seconds
}

export default function OtpVerification({
    email,
    onVerify,
    onResend,
    isLoading = false,
    initialTimeLeft = 300
}: OtpVerificationProps) {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
    const [isResending, setIsResending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "Please enter a valid 6-digit code.",
                variant: "destructive",
            });
            return;
        }
        await onVerify(otp);
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await onResend();
            setTimeLeft(300); // Reset timer to 5 minutes
            setOtp('');
            toast({
                title: "OTP Resent",
                description: "A new code has been sent to your email.",
            });
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } catch (error) {
            // Error handled by parent or toast in service
        } finally {
            setIsResending(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(value);

        // Auto submit when 6 digits entered
        if (value.length === 6) {
            // Optional: trigger verify automatically
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Verification Required</CardTitle>
                <CardDescription>
                    We've sent a 6-digit code to <strong>{email}</strong>.
                    Please enter it below to verify your account.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <div className="relative">
                            <Input
                                id="otp"
                                ref={inputRef}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="000000"
                                className="text-center text-2xl tracking-widest"
                                value={otp}
                                onChange={handleOtpChange}
                                maxLength={6}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className={`flex items-center ${timeLeft < 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <Timer className="w-4 h-4 mr-1" />
                            <span>Expires in {formatTime(timeLeft)}</span>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleResend}
                            disabled={timeLeft > 0 || isResending || isLoading}
                            className="text-actionRed hover:text-actionRed-hover"
                        >
                            {isResending ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                                <RefreshCw className="w-3 h-3 mr-1" />
                            )}
                            Resend Code
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full bg-actionRed hover:bg-actionRed-hover"
                        disabled={otp.length !== 6 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify Account'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

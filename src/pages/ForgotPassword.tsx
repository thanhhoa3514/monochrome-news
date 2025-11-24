
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import { useLanguage } from '@/lib/language-context';
import { authService } from '@/services/authService';
import OtpVerification from '@/components/auth/OtpVerification';
import { Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: t('error.missing_fields'),
        description: t('error.provide_email'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.resendOtp(email);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      toast({
        title: "Success",
        description: "Email verified successfully. You can now reset your password.",
      });
      // Navigate to reset password page or handle next step
      // For now, we'll just show success and maybe redirect to login or a reset password page if it existed
      // navigate('/reset-password', { state: { email, otp } }); 
      // Since user just asked for "verified email page", we can redirect to login or stay here
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await authService.resendOtp(email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif font-bold text-3xl">
            NewsPortal
          </Link>
          <p className="text-muted-foreground mt-2">
            {step === 'email' ? t('password.reset.title') : 'Verify Email'}
          </p>
        </div>

        {step === 'email' ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('password.reset.header')}</CardTitle>
              <CardDescription>
                {t('password.reset.enter_email')}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleEmailSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-actionRed hover:bg-actionRed-hover"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('password.reset.sending')}
                    </>
                  ) : (
                    t('password.reset.submit')
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <OtpVerification
            email={email}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            isLoading={isLoading}
          />
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t('login.remember_password')}{' '}
            <Link to="/login" className="text-actionRed hover:underline">
              {t('password.reset.back_to_login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


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
import { CheckCircle2 } from 'lucide-react';

type Step = 'register' | 'verify' | 'success';

export default function Register() {
  const [step, setStep] = useState<Step>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(300);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: t('error.missing_fields'),
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu không khớp.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword
      });

      setOtpExpiresIn(response.expires_in || 300);
      setStep('verify');
      toast({
        title: "Đăng ký thành công",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      await authService.verifyRegistration({ email, otp });
      setStep('success');
      toast({
        title: "Xác thực thành công",
        description: "Tài khoản của bạn đã được kích hoạt.",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Lỗi xác thực",
        description: error.message || "Mã OTP không hợp lệ.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.resendOtp(email);
    } catch (error: any) {
      toast({
        title: "Lỗi gửi lại OTP",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Propagate to component
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md mb-8 text-center">
          <Link to="/" className="font-serif font-bold text-3xl">
            NewsPortal
          </Link>
        </div>
        <OtpVerification
          email={email}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          isLoading={isLoading}
          initialTimeLeft={otpExpiresIn}
        />
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md text-center p-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Đăng ký thành công!</h2>
          <p className="text-muted-foreground mb-6">
            Tài khoản của bạn đã được xác thực. Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-actionRed hover:bg-actionRed-hover"
          >
            Đăng nhập ngay
          </Button>
        </Card>
      </div>
    );
  }

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
          <p className="text-muted-foreground mt-2">{t('register.title')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('register.title')}</CardTitle>
            <CardDescription>
              Điền vào form để tạo tài khoản của bạn.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('register.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Họ và tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('register.email')}</Label>
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
              <div className="space-y-2">
                <Label htmlFor="password">{t('register.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('register.confirm')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Đang xử lý...' : t('register.submit')}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t('register.login').split('?')[0]}?{' '}
            <Link to="/login" className="text-actionRed hover:underline">
              {t('register.login').split('?')[1]}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

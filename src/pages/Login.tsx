import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import { useLanguage } from '@/lib/language-context';
import { Facebook, Mail } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t('error.missing_fields'),
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Update global auth state
      login(response.user);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng trở lại, ${response.user.name}.`,
      });

      // Check if user is admin and redirect accordingly
      const isAdmin = response.user.roles?.some(role => role.name === 'Admin' || role.name === 'admin');
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: unknown) {
      toast({
        title: "Lỗi đăng nhập",
        description: "Email hoặc mật khẩu không đúng.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-muted-foreground mt-2">Truy cập tài khoản của bạn</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('login.title')}</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập để truy cập tài khoản.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
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
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <Link to="/forgot-password" className="text-sm text-actionRed hover:underline">
                    {t('login.forgot')}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-actionRed hover:bg-actionRed-hover"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : t('login.submit')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href = 'http://localhost:8000/api/v1/auth/google';
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href = 'http://localhost:8000/api/v1/auth/facebook';
                  }}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t('login.register').split('?')[0]}?{' '}
            <Link to="/register" className="text-actionRed hover:underline">
              {t('login.register').split('?')[1]}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

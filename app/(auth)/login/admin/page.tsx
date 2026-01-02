'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
  userType: 'admin' | 'member';
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: 'admin',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'حدث خطأ أثناء تسجيل الدخول');
        return;
      }

      if (result.user.role !== 'ADMIN') {
        setError('ليس لديك صلاحية للدخول كمدير');
        return;
      }

      await checkAuth();
      router.push('/admin/dashboard');
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary-500/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary-500">
            تسجيل دخول المدراء
          </CardTitle>
          <CardDescription className="text-center">
            منطقة محمية - للمدراء فقط
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ics.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-secondary-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                كلمة المرور
              </label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-secondary-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
                className="rounded border-background-tertiary"
              />
              <label htmlFor="rememberMe" className="text-sm">
                تذكرني
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-secondary-500/10 border border-secondary-500/50">
                <p className="text-sm text-secondary-500">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

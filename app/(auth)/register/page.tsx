'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  avatar?: FileList;
};

export default function RegisterPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('birthdate', data.birthdate);
      
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'حدث خطأ أثناء إنشاء الحساب');
        return;
      }

      await checkAuth();
      router.push('/member/dashboard');
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary-500">
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription className="text-center">
            انضم إلى منصة ICS للتعلم والتطوير
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                اسم المستخدم
              </label>
              <Input
                id="username"
                placeholder="username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-secondary-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
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
                showStrengthMeter
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-secondary-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                تأكيد كلمة المرور
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-secondary-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="birthdate" className="text-sm font-medium">
                تاريخ الميلاد
              </label>
              <Input
                id="birthdate"
                type="date"
                {...register('birthdate')}
              />
              {errors.birthdate && (
                <p className="text-sm text-secondary-500">{errors.birthdate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="avatar" className="text-sm font-medium">
                الصورة الشخصية (اختياري)
              </label>
              <Input
                id="avatar"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                {...register('avatar')}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-secondary-500/10 border border-secondary-500/50">
                <p className="text-sm text-secondary-500">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-text-secondary">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-primary-500 hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type ProfileFormData = {
  username?: string;
  email?: string;
  birthdate?: string;
};

export default function MemberProfilePage() {
  const { user, loading, checkAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      birthdate: user?.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : undefined,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'حدث خطأ أثناء تحديث الملف الشخصي');
        return;
      }

      setSuccess('تم تحديث الملف الشخصي بنجاح');
      await checkAuth();
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            الملف الشخصي
          </h1>
          <p className="text-text-secondary">
            إدارة معلوماتك الشخصية
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
            <CardDescription>
              قم بتحديث معلوماتك الشخصية
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
                  defaultValue={user?.username}
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
                  defaultValue={user?.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-secondary-500">{errors.email.message}</p>
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

              {error && (
                <div className="p-3 rounded-md bg-secondary-500/10 border border-secondary-500/50">
                  <p className="text-sm text-secondary-500">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-md bg-primary-500/10 border border-primary-500/50">
                  <p className="text-sm text-primary-500">{success}</p>
                </div>
              )}

              <Button type="submit" disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


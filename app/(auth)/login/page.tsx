'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/member/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-text-secondary">
            اختر نوع الحساب للدخول
          </p>
        </div>

        <div className="space-y-4">
          <Button
            asChild
            className="w-full"
            size="lg"
          >
            <Link href="/login/admin">تسجيل دخول المدراء</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Link href="/login/member">تسجيل دخول الأعضاء</Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-text-secondary">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary-500 hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

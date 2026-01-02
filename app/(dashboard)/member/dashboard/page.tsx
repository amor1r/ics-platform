'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function MemberDashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    projectsCount: 0,
    likesCount: 0,
    commentsCount: 0,
  });

  useEffect(() => {
    if (user) {
      // Fetch user stats
      fetch('/api/user/stats')
        .then(res => res.json())
        .then(data => {
          if (data.stats) {
            setStats(data.stats);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            مرحباً، {user?.username}
          </h1>
          <p className="text-text-secondary">
            لوحة تحكم الأعضاء - ICS Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-500">المشاريع</CardTitle>
              <CardDescription>عدد المشاريع المتاحة</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.projectsCount}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/member/projects">عرض المشاريع</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-accent-500">الإعجابات</CardTitle>
              <CardDescription>عدد الإعجابات الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.likesCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-secondary-500">التعليقات</CardTitle>
              <CardDescription>عدد تعليقاتك</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.commentsCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/member/projects">استكشف المشاريع</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/member/profile">الملف الشخصي</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


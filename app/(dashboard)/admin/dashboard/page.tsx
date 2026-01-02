'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function AdminDashboardPage() {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      <AdminDashboardContent />
    </AuthGuard>
  );
}

function AdminDashboardContent() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    usersCount: 0,
    projectsCount: 0,
    publishedProjects: 0,
    draftProjects: 0,
    commentsCount: 0,
    logsCount: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            لوحة تحكم المدراء
          </h1>
          <p className="text-text-secondary">
            مرحباً، {user?.username}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-500">المستخدمين</CardTitle>
              <CardDescription>إجمالي المستخدمين</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.usersCount}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/admin/users">إدارة المستخدمين</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-accent-500">المشاريع</CardTitle>
              <CardDescription>إجمالي المشاريع</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.projectsCount}</p>
              <div className="mt-2 text-sm text-text-secondary">
                <p>منشور: {stats.publishedProjects}</p>
                <p>مسودة: {stats.draftProjects}</p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/admin/projects">إدارة المشاريع</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-secondary-500">التعليقات</CardTitle>
              <CardDescription>إجمالي التعليقات</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.commentsCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-warning">السجلات</CardTitle>
              <CardDescription>سجلات النشاط</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.logsCount}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/admin/logs">عرض السجلات</Link>
              </Button>
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
                <Link href="/admin/projects/new">إنشاء مشروع جديد</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/invites">إدارة دعوات المدراء</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/settings">الإعدادات</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDate } from '@/lib/utils';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function AdminProjectsPage() {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      <AdminProjectsContent />
    </AuthGuard>
  );
}

function AdminProjectsContent() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
      });
      
      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const response = await fetch(`/api/projects?${params}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-500 mb-2">
              إدارة المشاريع
            </h1>
            <p className="text-text-secondary">
              إدارة جميع المشاريع التعليمية
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">إنشاء مشروع جديد</Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                placeholder="ابحث في المشاريع..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 rounded-md border border-background-tertiary bg-background-secondary text-text-primary"
              >
                <option value="">جميع الحالات</option>
                <option value="DRAFT">مسودة</option>
                <option value="PUBLISHED">منشور</option>
                <option value="ARCHIVED">مؤرشف</option>
              </select>
              <Button onClick={fetchProjects}>بحث</Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-text-secondary">لا توجد مشاريع</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary-500 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-text-secondary line-clamp-2 mb-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>الحالة: {project.status}</span>
                        <span>•</span>
                        <span>المشاهدات: {project.views}</span>
                        <span>•</span>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


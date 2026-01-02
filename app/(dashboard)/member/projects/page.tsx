'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDate } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  likesCount: number;
  commentsCount: number;
  views: number;
  createdAt: string;
}

export default function MemberProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, search]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: 'PUBLISHED',
      });
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            المشاريع التعليمية
          </h1>
          <p className="text-text-secondary">
            استكشف المشاريع التعليمية المتاحة
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="ابحث في المشاريع..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 rounded-md border border-background-tertiary bg-background-secondary text-text-primary"
              >
                <option value="">جميع الفئات</option>
                <option value="TOOLS">أدوات</option>
                <option value="KALI_LINUX">كالي لينكس</option>
                <option value="COMMANDS">أوامر</option>
                <option value="GENERAL_CYBER">أمن سيبراني عام</option>
              </select>
              <Button type="submit">بحث</Button>
            </form>
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
              <p className="text-text-secondary">لا توجد مشاريع متاحة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:border-primary-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-primary-500">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>بواسطة: {project.author.username}</span>
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>👁️ {project.views}</span>
                      <span>❤️ {project.likesCount}</span>
                      <span>💬 {project.commentsCount}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/member/project/${project.id}`}>عرض المشروع</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              السابق
            </Button>
            <span className="flex items-center px-4 text-text-secondary">
              صفحة {page} من {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


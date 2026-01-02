'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: {
    username: string;
  };
  views: number;
  likesCount: number;
  createdAt: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.projects || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            البحث
          </h1>
          <p className="text-text-secondary">
            ابحث في المشاريع التعليمية
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            placeholder="ابحث في المشاريع..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'جاري البحث...' : 'بحث'}
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : results.length === 0 && query ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-text-secondary">لا توجد نتائج</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((project) => (
              <Card key={project.id} className="hover:border-primary-500 transition-colors">
                <CardContent className="pt-6">
                  <Link href={`/member/project/${project.id}`}>
                    <h3 className="text-xl font-semibold text-primary-500 mb-2 hover:underline">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-text-secondary mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-text-tertiary">
                    <span>بواسطة: {project.author.username}</span>
                    <span>{formatDate(project.createdAt)}</span>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-primary p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';
import { Heart, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  allowComments: boolean;
  allowLikes: boolean;
  views: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !project) return;

    setLiking(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: project.isLiked ? 'DELETE' : 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setProject({
          ...project,
          isLiked: data.liked,
          likesCount: data.likesCount,
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">المشروع غير موجود</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Project Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-primary-500 mb-2">
                  {project.title}
                </h1>
                <p className="text-text-secondary text-lg">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>بواسطة: {project.author.username}</span>
                  <span>•</span>
                  <span>{formatDate(project.createdAt)}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded bg-primary-500/10 text-primary-500">
                    {project.category}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Eye className="h-4 w-4" />
                    <span>{project.views}</span>
                  </div>
                  {project.allowLikes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={liking || !user}
                      className={project.isLiked ? 'text-secondary-500' : ''}
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${project.isLiked ? 'fill-current' : ''}`}
                      />
                      {project.likesCount}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <pre className="bg-background-tertiary p-4 rounded-lg overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-background-tertiary px-1 rounded" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {project.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section - Placeholder */}
        {project.allowComments && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">التعليقات</h2>
              <p className="text-text-secondary">
                نظام التعليقات قيد التطوير...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


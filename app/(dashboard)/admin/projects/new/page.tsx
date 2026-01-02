'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth/auth-guard';

type ProjectFormData = {
  title: string;
  description: string;
  content: string;
  category: 'TOOLS' | 'KALI_LINUX' | 'COMMANDS' | 'GENERAL_CYBER';
  status: 'DRAFT' | 'PUBLISHED';
  allowComments: boolean;
  allowLikes: boolean;
};

export default function NewProjectPage() {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      <NewProjectContent />
    </AuthGuard>
  );
}

function NewProjectContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      status: 'DRAFT',
      allowComments: true,
      allowLikes: true,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setError(null);
    setSaving(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'حدث خطأ أثناء إنشاء المشروع');
        return;
      }

      router.push('/admin/projects');
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            إنشاء مشروع جديد
          </h1>
          <p className="text-text-secondary">
            أضف مشروعاً تعليمياً جديداً
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>معلومات المشروع</CardTitle>
            <CardDescription>
              املأ جميع الحقول المطلوبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  العنوان *
                </label>
                <Input
                  id="title"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-secondary-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  الوصف *
                </label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-secondary-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  المحتوى (Markdown) *
                </label>
                <Textarea
                  id="content"
                  rows={15}
                  className="font-mono"
                  {...register('content')}
                />
                {errors.content && (
                  <p className="text-sm text-secondary-500">{errors.content.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  الفئة *
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full px-4 py-2 rounded-md border border-background-tertiary bg-background-secondary text-text-primary"
                >
                  <option value="TOOLS">أدوات</option>
                  <option value="KALI_LINUX">كالي لينكس</option>
                  <option value="COMMANDS">أوامر</option>
                  <option value="GENERAL_CYBER">أمن سيبراني عام</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-secondary-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  الحالة *
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full px-4 py-2 rounded-md border border-background-tertiary bg-background-secondary text-text-primary"
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="PUBLISHED">منشور</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-secondary-500">{errors.status.message}</p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowComments"
                    {...register('allowComments')}
                    className="rounded border-background-tertiary"
                  />
                  <label htmlFor="allowComments" className="text-sm">
                    السماح بالتعليقات
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowLikes"
                    {...register('allowLikes')}
                    className="rounded border-background-tertiary"
                  />
                  <label htmlFor="allowLikes" className="text-sm">
                    السماح بالإعجابات
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-secondary-500/10 border border-secondary-500/50">
                  <p className="text-sm text-secondary-500">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'جاري الحفظ...' : 'إنشاء المشروع'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


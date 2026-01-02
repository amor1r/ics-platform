'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDate } from '@/lib/utils';
import { AuthGuard } from '@/components/auth/auth-guard';

interface Invite {
  id: string;
  email: string;
  expiresAt: string;
  usedAt: string | null;
  createdBy: {
    username: string;
  };
}

export default function AdminInvitesPage() {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      <AdminInvitesContent />
    </AuthGuard>
  );
}

function AdminInvitesContent() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/invites', {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setInvites(data.invites);
      }
    } catch (error) {
      console.error('Failed to fetch invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmail('');
        fetchInvites();
      } else {
        alert(result.error || 'حدث خطأ أثناء إنشاء الدعوة');
      }
    } catch (error) {
      console.error('Failed to create invite:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            إدارة دعوات المدراء
          </h1>
          <p className="text-text-secondary">
            إنشاء وإدارة دعوات المدراء الجدد
          </p>
        </div>

        {/* Create Invite */}
        <Card>
          <CardHeader>
            <CardTitle>إنشاء دعوة جديدة</CardTitle>
            <CardDescription>
              أرسل دعوة لمدير جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateInvite} className="flex gap-4">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={creating}>
                {creating ? 'جاري الإنشاء...' : 'إنشاء دعوة'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invites List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : invites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-text-secondary">لا توجد دعوات</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <Card key={invite.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">{invite.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                        <span>أنشأها: {invite.createdBy.username}</span>
                        <span>•</span>
                        <span>ينتهي: {formatDate(invite.expiresAt)}</span>
                        {invite.usedAt && (
                          <>
                            <span>•</span>
                            <span className="text-primary-500">مستخدم</span>
                          </>
                        )}
                      </div>
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


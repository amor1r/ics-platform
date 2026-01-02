'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDate } from '@/lib/utils';
import { AuthGuard } from '@/components/auth/auth-guard';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      <AdminUsersContent />
    </AuthGuard>
  );
}

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: string, ban: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isBanned: ban }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            إدارة المستخدمين
          </h1>
          <p className="text-text-secondary">
            إدارة جميع المستخدمين في المنصة
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchUsers();
              }}
              className="flex gap-4"
            >
              <Input
                placeholder="ابحث عن مستخدم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">بحث</Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-text-secondary">لا يوجد مستخدمون</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary-500 mb-2">
                        {user.username}
                      </h3>
                      <p className="text-text-secondary mb-2">{user.email}</p>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="px-2 py-1 rounded bg-primary-500/10 text-primary-500">
                          {user.role}
                        </span>
                        {user.isBanned && (
                          <span className="px-2 py-1 rounded bg-secondary-500/10 text-secondary-500">
                            محظور
                          </span>
                        )}
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.isBanned ? (
                        <Button
                          variant="outline"
                          onClick={() => handleBan(user.id, false)}
                        >
                          إلغاء الحظر
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          onClick={() => handleBan(user.id, true)}
                        >
                          حظر
                        </Button>
                      )}
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


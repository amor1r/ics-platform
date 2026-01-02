'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.username}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        )}
        <span className="hidden md:inline">{user.username}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-56 z-50">
            <CardContent className="p-2">
              <div className="space-y-1">
                <div className="px-3 py-2 border-b border-background-tertiary">
                  <p className="text-sm font-medium text-text-primary">
                    {user.username}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {user.email}
                  </p>
                </div>

                <Link
                  href={user.role === 'ADMIN' ? '/admin/dashboard' : '/member/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-background-tertiary text-sm text-text-primary"
                >
                  <UserCircle className="h-4 w-4" />
                  لوحة التحكم
                </Link>

                <Link
                  href={user.role === 'ADMIN' ? '/admin/settings' : '/member/profile'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-background-tertiary text-sm text-text-primary"
                >
                  <Settings className="h-4 w-4" />
                  الإعدادات
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-background-tertiary text-sm text-secondary-500"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}


'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserMenu } from './user-menu';
import { Search } from 'lucide-react';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b border-background-tertiary bg-background-secondary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/member/dashboard') : '/'} className="text-2xl font-bold text-primary-500 hover:text-primary-400 transition-colors">
            ICS
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/search">
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                </Link>
                <NotificationsDropdown />
                <UserMenu />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">تسجيل الدخول</Button>
                </Link>
                <Link href="/register">
                  <Button>إنشاء حساب</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

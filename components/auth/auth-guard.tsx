'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'ADMIN' | 'MODERATOR' | 'USER';
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    if (requireRole && user) {
      const roleHierarchy: Record<string, number> = {
        USER: 1,
        MODERATOR: 2,
        ADMIN: 3,
      };

      const userRoleLevel = roleHierarchy[user.role] || 0;
      const requiredRoleLevel = roleHierarchy[requireRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        router.push('/member/dashboard');
        return;
      }
    }

    if (user?.isBanned) {
      router.push('/login?error=banned');
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, requireAuth, requireRole, router, redirectTo, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary-500">جاري التحميل...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

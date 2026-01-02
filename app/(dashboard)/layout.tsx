'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { MemberSidebar } from '@/components/layout/member-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background-primary">
        <Header />
        <div className="flex">
          {user?.role === 'ADMIN' ? <AdminSidebar /> : <MemberSidebar />}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

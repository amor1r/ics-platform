'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function AdminSettingsPage() {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      <AdminSettingsContent />
    </AuthGuard>
  );
}

function AdminSettingsContent() {
  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            إعدادات النظام
          </h1>
          <p className="text-text-secondary">
            إدارة إعدادات المنصة
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الإعدادات العامة</CardTitle>
            <CardDescription>
              إعدادات المنصة العامة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">
              صفحة الإعدادات قيد التطوير...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


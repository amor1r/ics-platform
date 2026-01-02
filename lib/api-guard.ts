import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { getUserFromToken } from './auth';
import { canManageUsers, canViewLogs, canCreateAdmin, canManageSettings } from './permissions';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    avatar: string | null;
    isBanned: boolean;
  };
}

export async function requireAuth(request: NextRequest): Promise<{
  user: NonNullable<AuthenticatedRequest['user']>;
  response?: NextResponse;
} | {
  user: null;
  response: NextResponse;
}> {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - يرجى تسجيل الدخول' },
        { status: 401 }
      ),
    };
  }

  const user = await getUserFromToken(token);
  
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'رمز غير صالح أو منتهي الصلاحية' },
        { status: 401 }
      ),
    };
  }

  if (user.isBanned) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'تم حظر حسابك' },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export async function requireAdmin(request: NextRequest): Promise<{
  user: NonNullable<AuthenticatedRequest['user']>;
  response?: NextResponse;
} | {
  user: null;
  response: NextResponse;
}> {
  const authResult = await requireAuth(request);
  
  if (!authResult.user) {
    return authResult;
  }

  if (authResult.user.role !== 'ADMIN') {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - يتطلب صلاحيات مدير' },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

export async function requireModerator(request: NextRequest): Promise<{
  user: NonNullable<AuthenticatedRequest['user']>;
  response?: NextResponse;
} | {
  user: null;
  response: NextResponse;
}> {
  const authResult = await requireAuth(request);
  
  if (!authResult.user) {
    return authResult;
  }

  if (authResult.user.role !== 'ADMIN' && authResult.user.role !== 'MODERATOR') {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - يتطلب صلاحيات مدير أو مشرف' },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

// Permission-specific guards
export async function requireUserManagement(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.user) return authResult;

  if (!canManageUsers(authResult.user)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - لا يمكنك إدارة المستخدمين' },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

export async function requireLogsAccess(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.user) return authResult;

  if (!canViewLogs(authResult.user)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - لا يمكنك عرض السجلات' },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

export async function requireAdminCreation(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.user) return authResult;

  if (!canCreateAdmin(authResult.user)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - لا يمكنك إنشاء مدراء جدد' },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

export async function requireSettingsAccess(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.user) return authResult;

  if (!canManageSettings(authResult.user)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرح - لا يمكنك الوصول للإعدادات' },
        { status: 403 }
      ),
    };
  }

  return authResult;
}


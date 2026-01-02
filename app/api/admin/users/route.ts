import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { asyncHandler, AuthorizationError } from '@/lib/error-handler';
import { canManageUsers } from '@/lib/permissions';

async function getUsersHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  // Check permission
  if (!canManageUsers(authResult.user)) {
    throw new AuthorizationError('غير مصرح - للمدراء فقط');
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const role = searchParams.get('role');
  const isBanned = searchParams.get('isBanned');

  const where: any = {};
  
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (isBanned !== null) {
    where.isBanned = isBanned === 'true';
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({ users });
}

export const GET = asyncHandler(getUsersHandler);


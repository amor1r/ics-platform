import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { asyncHandler, NotFoundError, AuthorizationError } from '@/lib/error-handler';
import { canBanUser, canUnbanUser } from '@/lib/permissions';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';

async function updateUserHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const userId = params.id;
  const body = await request.json();

  // Get target user
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    throw new NotFoundError('المستخدم غير موجود');
  }

  // Check permission for ban/unban
  if (body.isBanned !== undefined) {
    if (body.isBanned) {
      if (!canBanUser(authResult.user, targetUser)) {
        throw new AuthorizationError('غير مصرح - لا يمكنك حظر هذا المستخدم');
      }
    } else {
      if (!canUnbanUser(authResult.user, targetUser)) {
        throw new AuthorizationError('غير مصرح - لا يمكنك إلغاء حظر هذا المستخدم');
      }
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.isBanned !== undefined && {
        isBanned: body.isBanned,
        bannedAt: body.isBanned ? new Date() : null,
        bannedBy: body.isBanned ? authResult.user.id : null,
      }),
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });

  // Log activity
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: body.isBanned ? ActivityType.USER_BAN : ActivityType.USER_UNBAN,
      action: body.isBanned
        ? `حظر مستخدم: ${targetUser.username}`
        : `إلغاء حظر مستخدم: ${targetUser.username}`,
      details: { targetUserId: userId },
      ipAddress,
      userAgent,
    },
  });

  logger.info('User updated', {
    userId,
    action: body.isBanned ? 'banned' : 'unbanned',
    adminId: authResult.user.id,
  });

  return NextResponse.json({
    user: updatedUser,
    message: body.isBanned ? 'تم حظر المستخدم بنجاح' : 'تم إلغاء حظر المستخدم بنجاح',
  });
}

export const PATCH = asyncHandler(updateUserHandler);

